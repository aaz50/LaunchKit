import { NextRequest, NextResponse } from 'next/server';
import { AppInput, GenerationResult } from '@/types';
import { randomUUID } from 'crypto';
import http from 'http';

// Force this API route to use Node.js runtime instead of Edge runtime
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for generation

// Agentuity agent URLs - use 127.0.0.1 to avoid IPv6/IPv4 issues
const AGENTUITY_BASE_URL = process.env.AGENTUITY_BASE_URL || 'http://127.0.0.1:3500';
const AGENTUITY_PROJECT_KEY = process.env.AGENTUITY_PROJECT_KEY || '';

// Agent IDs from agentuity.yaml
const AGENT_IDS = {
  'landing-page-agent': 'agent_14fff4f9144df70b100efe998ca48f08',
  'pitch-deck-agent': 'agent_03bc7c56cb387e0805570aa43dfa39b5',
  'marketing-agent': 'agent_b69848deb11689d34f2754598219dfb8',
};

async function callAgentuityAgent(agentName: string, input: any): Promise<any> {
  const agentId = AGENT_IDS[agentName as keyof typeof AGENT_IDS];
  if (!agentId) {
    throw new Error(`Unknown agent: ${agentName}`);
  }

  return new Promise((resolve, reject) => {
    const url = `http://127.0.0.1:3500/${agentId}`;
    console.log(`[API] Calling agent ${agentName} at ${url}`);
    
    const payload = JSON.stringify(input);
    
    const options = {
      hostname: '127.0.0.1',
      port: 3500,
      path: `/${agentId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...(AGENTUITY_PROJECT_KEY && { 'Authorization': `Bearer ${AGENTUITY_PROJECT_KEY}` }),
      },
      timeout: 120000, // 2 minute timeout
    };

    const req = http.request(options, (res) => {
      console.log(`[API] Agent ${agentName} response status: ${res.statusCode}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (parseError) {
            reject(new Error(`Failed to parse response: ${parseError}`));
          }
        } else {
          reject(new Error(`Agent ${agentName} failed: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`[API] Error calling agent ${agentName}:`, error);
      reject(new Error(`Agent ${agentName} failed: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Agent ${agentName} timed out`));
    });

    req.write(payload);
    req.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const input: AppInput = await req.json();

    // Validate input
    if (!input.appName || !input.tagline || !input.targetAudience || !input.problemSolved) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!input.keyFeatures || input.keyFeatures.length < 3) {
      return NextResponse.json(
        { error: 'At least 3 key features are required' },
        { status: 400 }
      );
    }

    // Generate unique project ID
    const projectId = randomUUID();

    // Run all three Agentuity agents in parallel for faster generation
    const [landingPage, pitchDeck, marketing] = await Promise.allSettled([
      callAgentuityAgent('landing-page-agent', input),
      callAgentuityAgent('pitch-deck-agent', input),
      callAgentuityAgent('marketing-agent', input),
    ]);

    // Check for errors
    const errors: string[] = [];
    
    if (landingPage.status === 'rejected') {
      errors.push(`Landing Page: ${landingPage.reason}`);
    }
    if (pitchDeck.status === 'rejected') {
      errors.push(`Pitch Deck: ${pitchDeck.reason}`);
    }
    if (marketing.status === 'rejected') {
      errors.push(`Marketing: ${marketing.reason}`);
    }

    if (errors.length === 3) {
      // All agents failed
      return NextResponse.json(
        { error: 'All agents failed to generate content', details: errors },
        { status: 500 }
      );
    }

    // Build result with successful generations and error messages for failures
    const result: GenerationResult = {
      projectId,
      landingPage: landingPage.status === 'fulfilled' ? landingPage.value : null,
      pitchDeck: pitchDeck.status === 'fulfilled' ? pitchDeck.value : null,
      marketing: marketing.status === 'fulfilled' ? marketing.value : null,
      createdAt: new Date().toISOString(),
    };

    // Return result with partial errors if any
    if (errors.length > 0) {
      return NextResponse.json({
        ...result,
        warnings: errors,
        message: 'Some content generated successfully, but some agents failed',
      }, { status: 207 }); // 207 Multi-Status
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

