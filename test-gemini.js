import { GoogleGenerativeAI } from '@google/generative-ai';

// Test Gemini API
const testGemini = async () => {
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || 'AIzaSyCuntjqultlnc6sYnXgDAcFjmRfgW37AoY';

  console.log('Testing Gemini API with key length:', apiKey.length);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent('Say "Hello World" in JSON format: {"message": "Hello World"}');
    const response = await result.response;
    const text = response.text();

    console.log('Gemini test response:', text);
  } catch (error) {
    console.error('Gemini test failed:', error);
  }
};

testGemini();