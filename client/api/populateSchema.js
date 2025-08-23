import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.GENAI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export async function populateSchemaStream(prompt, onData, onComplete, onError) {
    try {
        const stream = await openai.chat.completions.create({
            model: "gemini-2.5-flash-lite",
            stream: true,
            messages: [
                {
                    role: "system",
                    content: "You are a database schema populator. Respond ONLY with a valid JSON array. Do not include any markdown formatting, code blocks, or the word 'json'. Start directly with the opening bracket '['."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        let isFirstChunk = true;
        
        for await (const chunk of stream) {
            let delta = chunk.choices[0]?.delta?.content || "";
            
            if (delta) {
                // More aggressive cleaning for the first chunk
                if (isFirstChunk) {
                    // Remove common prefixes that AI might add
                    delta = delta.replace(/^```json\s*/i, "")
                                 .replace(/^```\s*/i, "")
                                 .replace(/^json\s*/i, "")
                                 .replace(/^here\s+is\s+the\s+json\s*/i, "")
                                 .replace(/^here\s+is\s*/i, "")
                                 .trim();
                    isFirstChunk = false;
                }
                
                // Clean any remaining markdown or formatting
                delta = delta.replace(/```json/g, "")
                           .replace(/```/g, "")
                           .replace(/^\s*json\s*$/gmi, ""); // More comprehensive json removal
                
                // Only send non-empty chunks
                if (delta.trim()) {
                    onData?.(delta);
                }
            }
        }
        
        onComplete?.();
    } catch (err) {
        onError?.(err);
        console.error("Streaming error:", err);
    }
}
