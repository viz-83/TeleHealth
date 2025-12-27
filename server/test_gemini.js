require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    console.log("Testing Gemini API...");
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const msg = "Hello, how are you?";
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();
        console.log("Response:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
