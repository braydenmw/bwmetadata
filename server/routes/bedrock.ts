/**
 * AWS Bedrock API Route
 * Handles AI inference requests using AWS Bedrock
 * Uses AWS Bedrock API Key for authentication
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

// Check if AWS Bedrock is configured
const hasBedrockConfig = (): boolean => {
  return !!(
    process.env.AWS_REGION && 
    (process.env.AWS_BEDROCK_API_KEY || 
     process.env.AWS_ACCESS_KEY_ID || 
     process.env.AWS_EXECUTION_ENV ||
     process.env.AWS_LAMBDA_FUNCTION_NAME)
  );
};

// Gemini fallback for when Bedrock is unavailable
async function invokeGeminiFallback(prompt: string, maxTokens?: number, temperature?: number) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('No GEMINI_API_KEY configured');
  }

  console.log('[AI Service] Using Gemini fallback');
  
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
      input_tokens: prompt.length / 4,
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

  // Check if Bedrock is configured
  if (!hasBedrockConfig()) {
    console.log('[Bedrock] No AWS config, trying Gemini fallback');
    
    try {
      const fallbackResult = await invokeGeminiFallback(prompt, maxTokens, temperature);
      res.json(fallbackResult);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AI Service] Gemini fallback failed:', errorMessage);
      res.status(500).json({ 
        error: 'AI service unavailable',
        message: errorMessage
      });
      return;
    }
  }

  try {
    console.log('[Bedrock] AWS config detected, using Bedrock');
    
    // Dynamic import of AWS SDK
    const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');
    
    // Configure client with API key if available
    const clientConfig: { region: string; credentials?: { accessKeyId: string; secretAccessKey: string } } = {
      region: process.env.AWS_REGION || 'us-east-1'
    };
    
    // If using Bedrock API Key (base64 encoded credentials)
    if (process.env.AWS_BEDROCK_API_KEY) {
      try {
        const decoded = Buffer.from(process.env.AWS_BEDROCK_API_KEY, 'base64').toString('utf-8');
        const [keyId, secret] = decoded.split(':');
        if (keyId && secret) {
          // Extract the actual key ID (remove prefix if present)
          const accessKeyId = keyId.includes('BedrockAPIKey') ? keyId : keyId;
          clientConfig.credentials = {
            accessKeyId: accessKeyId,
            secretAccessKey: secret
          };
          console.log('[Bedrock] Using API Key credentials');
        }
      } catch (e) {
        console.warn('[Bedrock] Could not decode API key, using default credentials');
      }
    }
    
    const client = new BedrockRuntimeClient(clientConfig);

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
    
    // Try Gemini fallback on Bedrock failure
    console.log('[Bedrock] Trying Gemini fallback after Bedrock error');
    try {
      const fallbackResult = await invokeGeminiFallback(prompt, maxTokens, temperature);
      res.json(fallbackResult);
      return;
    } catch (fallbackError) {
      const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : 'Unknown';
      console.error('[AI Service] Both Bedrock and Gemini failed');
      
      if (errorMessage.includes('AccessDeniedException')) {
        res.status(403).json({ 
          error: 'Access denied to Bedrock model',
          message: 'Ensure IAM role has bedrock:InvokeModel permission',
          fallbackError: fallbackMsg
        });
      } else if (errorMessage.includes('ResourceNotFoundException')) {
        res.status(404).json({ 
          error: 'Model not found',
          message: 'Request access to Claude models in AWS Bedrock console',
          fallbackError: fallbackMsg
        });
      } else {
        res.status(500).json({ 
          error: 'AI service invocation failed',
          bedrockError: errorMessage,
          fallbackError: fallbackMsg
        });
      }
    }
  }
});

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasBedrockKey = !!process.env.AWS_BEDROCK_API_KEY;
  const hasAWSRegion = !!process.env.AWS_REGION;
  const bedrockReady = hasBedrockConfig();
  
  res.json({
    service: 'AI Intelligence',
    mode: bedrockReady ? 'AWS Bedrock (Production)' : (hasGeminiKey ? 'Gemini (Fallback)' : 'No AI'),
    bedrockAvailable: bedrockReady,
    bedrockApiKey: hasBedrockKey ? 'configured' : 'not-set',
    geminiAvailable: hasGeminiKey,
    region: process.env.AWS_REGION || 'not-configured',
    status: (bedrockReady || hasGeminiKey) ? 'ready' : 'no-api-keys'
  });
});

export default router;
