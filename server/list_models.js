require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    console.log("Listing Gemini Models...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: genAI.getGenerativeModel is for getting a model instance.
        // To list models, we might need to use the model manager if exposed, or just try known ones.
        // The SDK doesn't expose listModels directly on the main class easily in some versions.
        // HACK: Start with a likely error to see if it lists them in error? No.

        // Let's try to infer from docs or just try `gemini-1.5-flash-latest`

        const modelsToTry = [
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro-vision"
        ];

        for (const m of modelsToTry) {
            console.log(`Trying ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Test");
                console.log(`SUCCESS: ${m}`);
                break;
            } catch (e) {
                console.log(`FAILED: ${m} - ${e.message.split(':')[0]}`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
