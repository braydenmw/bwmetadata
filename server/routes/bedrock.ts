/**
 * AWS Bedrock API Route
 * Handles AI inference requests using AWS Bedrock
 * Falls back to Gemini for local development
 */

import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Types for Bedrock
interface BedrockRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface BedrockMessage {
  role: string;
  content: string;
}

interface BedrockRequestBody {
  anthropic_version: string;
  max_tokens: number;
  messages: BedrockMessage[];
  temperature?: number;
}

// Check if running on AWS
const isAWSEnvironment = (): boolean => {
  return !!(
    process.env.AWS_REGION ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );
};

// Gemini fallback for local development
async function invokeGeminiFallback(prompt: string, maxTokens?: number, temperature?: number) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('No GEMINI_API_KEY configured for local development');
  }

  console.log('[Bedrock Fallback] Using Gemini for local development');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: temperature || 0.3,
      maxOutputTokens: maxTokens || 4096,
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return {
    content: [{ type: 'text', text: responseText }],
    usage: {
      input_tokens: prompt.length / 4, // Rough estimate
      output_tokens: responseText.length / 4
    },
    model: 'gemini-2.0-flash',
    provider: 'gemini-fallback'
  };
}

router.post('/invoke', async (req: Request, res: Response) => {
  const { prompt, model, maxTokens, temperature }: BedrockRequest = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  // If not on AWS, use Gemini fallback
  if (!isAWSEnvironment()) {
    console.log('[Bedrock] Not on AWS, using Gemini fallback');
    
    try {
      const fallbackResult = await invokeGeminiFallback(prompt, maxTokens, temperature);
      res.json(fallbackResult);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Bedrock Fallback] Gemini failed:', errorMessage);
      res.status(500).json({ 
        error: 'AI service unavailable',
        message: errorMessage,
        hint: 'Ensure GEMINI_API_KEY is set in .env for local development'
      });
      return;
    }
  }

  try {
    // Dynamic import of AWS SDK (only works on AWS)
    const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');
    
    const client = new BedrockRuntimeClient({ 
      region: process.env.AWS_REGION || 'us-east-1' 
    });

    const modelId = model || 'anthropic.claude-3-sonnet-20240229-v1:0';
    
    const requestBody: BedrockRequestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: maxTokens || 4096,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature || 0.3
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    });

    console.log(`[Bedrock] Invoking model: ${modelId}`);
    
    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));

    console.log('[Bedrock] Response received successfully');
    
    res.json({
      content: result.content,
      usage: result.usage,
      model: modelId,
      provider: 'bedrock'
    });

  } catch (error) {
    console.error('[Bedrock] Invocation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('AccessDeniedException')) {
      res.status(403).json({ 
        error: 'Access denied to Bedrock model',
        message: 'Ensure IAM role has bedrock:InvokeModel permission'
      });
    } else if (errorMessage.includes('ResourceNotFoundException')) {
      res.status(404).json({ 
        error: 'Model not found',
        message: 'Request access to Claude models in AWS Bedrock console'
      });
    } else {
      res.status(500).json({ 
        error: 'Bedrock invocation failed',
        message: errorMessage
      });
    }
  }
});

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const onAWS = isAWSEnvironment();
  
  res.json({
    service: 'AI Intelligence',
    mode: onAWS ? 'AWS Bedrock (Production)' : 'Gemini (Development)',
    bedrockAvailable: onAWS,
    geminiAvailable: hasGeminiKey,
    region: process.env.AWS_REGION || 'local',
    status: (onAWS || hasGeminiKey) ? 'ready' : 'no-api-keys'
  });
});

export default router;
