/**
 * AWS Bedrock API Route
 * Handles AI inference requests using AWS Bedrock
 */

import { Router, Request, Response } from 'express';

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

router.post('/invoke', async (req: Request, res: Response) => {
  const { prompt, model, maxTokens, temperature }: BedrockRequest = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  // If not on AWS, return a helpful message
  if (!isAWSEnvironment()) {
    console.log('[Bedrock] Not on AWS, returning fallback');
    res.status(503).json({ 
      error: 'AWS Bedrock only available in AWS environment',
      message: 'Use Gemini API for local development'
    });
    return;
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
  res.json({
    service: 'AWS Bedrock',
    available: isAWSEnvironment(),
    region: process.env.AWS_REGION || 'not-configured'
  });
});

export default router;
