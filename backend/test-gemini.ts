import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const runTest = async () => {
    console.log("Testing Gemini API Models...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.0-pro", "gemini-pro"];

    for (const modelName of modelsToTry) {
        console.log(`\nAttempting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} works! Response: ${response.text()}`);
            return; // Exit on first success
        } catch (error: any) {
            console.log(`FAILED: ${modelName}. Status: ${error.status || 'Unknown'}`);
            if (error.status === 404) console.log("Reason: Model not found or not supported.");
            else if (error.status === 400) console.log("Reason: Invalid Argument / API Key issue.");
            else console.log("Reason:", error.message);
        }
    }
    console.error("\nALL MODELS FAILED.");
};

runTest();
