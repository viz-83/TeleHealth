const { GoogleGenerativeAI } = require("@google/generative-ai");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { isCrisis } = require('../utils/crisisDetection');
const wellBeingSystemPrompt = require('../ai/systemPrompts/wellbeingPrompt');

// Initialize Gemini
// Note: We create the client inside the handler or globally. 
// Globally is better, but if env changes we might need to recreate.
// For now, global is fine.
const getGeminiClient = () => {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getGeminiModel = (genAI) => {
    // Falls back to gemini-pro if 1.5-flash not available or preferred
    return genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: wellBeingSystemPrompt
    });
};

const FALLBACK_RESPONSES = [
    "I hear you. That sounds difficult, but I'm here to support you.",
    "It helps to take things one step at a time. How are you feeling right now?",
    "Thank you for sharing that with me. What do you think would help you feel a bit better?",
    "I'm listening. Please go on."
];

exports.handleMessage = catchAsync(async (req, res, next) => {
    const { message, history } = req.body;

    if (!message) {
        return next(new AppError('Message content is required', 400));
    }

    // 1. CRISIS DETECTION (Rule-based Pre-check)
    if (isCrisis(message)) {
        return res.status(200).json({
            status: 'success',
            data: {
                message: "I'm really sorry you're feeling this much pain. You deserve support and care that I can't provide safely here.\n\nPlease reach out to a trusted friend, family member, or call **Tele Manas (14416)** or the **Vandrevala Foundation (9999666555)** immediately.",

                flags: {
                    isCrisis: true,
                    isSupportive: false
                },
                suggestedActions: [
                    { label: "Call Tele Manas (14416)", action: "CRISIS_CALL_EMERGENCY" },
                    { label: "Vandrevala Foundation (9999666555)", action: "CRISIS_HELPLINE" }
                ]

            }
        });
    }

    // 2. GEMINI INTERACTION
    try {
        const genAI = getGeminiClient();
        if (!genAI) throw new Error("API Key missing");

        const model = getGeminiModel(genAI);

        let chatHistory = (history || []).map(msg => ({
            role: (msg.role === 'user' || msg.role === 'client') ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // Gemini REQUIREMENT: History must start with 'user'
        if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            chatHistory.shift(); // Remove the first model message
        }


        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 600, // Increased to prevent truncation of resource lists
                temperature: 0.7,
            },

        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        res.status(200).json({
            status: 'success',
            data: {
                message: responseText,
                flags: { isCrisis: false, isSupportive: true }
            }
        });

    } catch (error) {
        console.error("Gemini Error:", error.message);

        // FAILOVER: Return a simulated response so the UI works
        const randomFallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

        res.status(200).json({
            status: 'success',
            data: {
                message: `${randomFallback}\n\n(Note: AI connection failed, using offline mode. Error: ${error.message})`,
                flags: {
                    isCrisis: false,
                    isSupportive: true,
                    isFallback: true
                }
            }
        });
    }
});
