import { Request, Response } from 'express';
import axios from 'axios';

// OpenRouter Endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_INSTRUCTION = "You are a friendly and helpful assistant for Omkar International School. Your goal is to answer questions from prospective parents and students. When relevant, provide links to pages on the website by formatting them as [Page Name](/path). YOU MUST USE one of the following exact paths: /about/founder-trustee, /about/principal, /about/mission-vision, /academics/foundational-years, /academics/primary, /academics/middle-school, /academics/secondary, /academics/isc, /infrastructure, /awards, /admission, /testimonials, /contact. For example: [Learn about admissions](/admission). Use markdown for formatting (like bolding and lists). Place links at the end of your response. Be concise, polite, and informative. If you don't know an answer, suggest contacting the school directly through the [Contact Us](/contact) page. Do not make up information.";

export const chatWithGemini = async (req: Request, res: Response) => {
    const { message } = req.body;

    try {
        // Use OpenRouter Key
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenRouter API Key not configured' });
        }

        const payload = {
            model: "openai/gpt-oss-20b:free",
            messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                { role: "user", content: message }
            ]
        };

        const response = await axios.post(OPENROUTER_API_URL, payload, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000", // Optional, for OpenRouter rankings
                "X-Title": "Omkar International School",
                "Content-Type": "application/json"
            }
        });

        // OpenRouter / OpenAI response format
        const generatedText = response.data.choices?.[0]?.message?.content || "I'm sorry, I couldn't understand that.";

        res.json({ text: generatedText });

    } catch (error: any) {
        console.error('OpenRouter Chat Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to communicate with AI' });
    }
};
