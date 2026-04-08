import * as ai from '../services/ai.service.js';

export const getResult = async (req, res) => {
    try {
        // Extract the 'prompt' query parameter
        const { prompt } = req.query;
        
        // Validate that prompt exists and is a string
        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            return res.status(400).json({ 
                message: 'Prompt is required and must be a non-empty string' 
            });
        }
        
        const result = await ai.generateContent(prompt);

        // Send a structured response with helpful metadata and example prompts
        res.status(200).json({
            result,
            examples: ai.examplePrompts.slice(0, 4)
        });
    } catch (error) {
        console.error('Error in getResult controller:', error);
        
        // Provide specific error messages based on error type
        let statusCode = 500;
        let message = error.message || 'Internal server error';
        
        if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
            statusCode = 504;
            message = 'AI service timeout: Please try again';
        } else if (error.message?.includes('authentication') || error.message?.includes('API key')) {
            statusCode = 503;
            message = 'AI service is unavailable';
        }
        
        return res.status(statusCode).json({ message });
    }
}