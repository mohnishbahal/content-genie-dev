const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeProductImage(imageData, prompt = "") {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });
    
    // Prepare the image data
    const imageBytes = await fileToGenerativePart(imageData);
    
    // Default prompt if none provided
    const defaultPrompt = "Analyze this product image and provide: \n" +
      "1. Product description\n" +
      "2. Key features\n" +
      "3. Suggested use cases";
    
    // Generate content
    const result = await model.generateContent([
      prompt || defaultPrompt,
      imageBytes,
    ]);
    
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error analyzing product image:', error);
    throw error;
  }
}

// Helper function to convert file to GenerativePart
async function fileToGenerativePart(file) {
  const uint8Array = new Uint8Array(await file.arrayBuffer());
  
  return {
    inlineData: {
      data: Buffer.from(uint8Array).toString('base64'),
      mimeType: file.type
    },
  };
}

module.exports = { analyzeProductImage }; 