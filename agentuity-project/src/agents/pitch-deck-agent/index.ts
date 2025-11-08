import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const welcome = () => {
  return {
    welcome:
      'Pitch Deck Generator Agent - Creates investor-ready pitch decks using OpenRouter',
    prompts: [
      {
        data: JSON.stringify({
          appName: 'TaskFlow',
          tagline: 'Project management that works',
          targetAudience: 'Small businesses',
          problemSolved: 'Complex project management',
          keyFeatures: ['Simple boards', 'Team collaboration', 'Smart tracking'],
          fundingStage: 'seed'
        }),
        contentType: 'application/json',
      },
    ],
  };
};

const SYSTEM_PROMPT = `You are a seasoned startup advisor and pitch deck expert who has helped hundreds of companies raise funding.

Your task is to create investor-ready pitch decks that:
- Follow proven investor pitch deck formats
- Include realistic market data and projections
- Tell a compelling story
- Address key investor concerns
- Use clear, concise language

You must respond with valid JSON matching this exact structure:
{
  "slides": [{
    "slideNumber": number,
    "title": string,
    "content": string[],
    "speakerNotes": string,
    "layout": "title" | "bullets" | "two-column" | "image-text" | "chart"
  }],
  "metadata": {
    "title": string,
    "subtitle": string,
    "author": string,
    "date": string
  }
}`;

export default async function PitchDeckAgent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  try {
    const input = await req.data.object<{
      appName: string;
      tagline: string;
      targetAudience: string;
      problemSolved: string;
      keyFeatures: string[];
      fundingStage?: string;
      competitors?: string;
    }>();

    ctx.logger.info('Generating pitch deck for: %s', input.appName);

    const fundingStage = input.fundingStage || 'seed';
    const today = new Date().toISOString().split('T')[0];

    const userPrompt = `Create a professional pitch deck for the following startup:

**App Name:** ${input.appName}
**Tagline:** ${input.tagline}
**Target Audience:** ${input.targetAudience}
**Problem Solved:** ${input.problemSolved}
**Key Features:** ${input.keyFeatures.join(', ')}
**Funding Stage:** ${fundingStage}
${input.competitors ? `**Competitors:** ${input.competitors}` : ''}

Create a 10-12 slide pitch deck with the following slides:

1. **Title Slide**: Company name, tagline, and contact info
2. **Problem**: The pain point in the market (3-4 bullet points)
3. **Solution**: How ${input.appName} solves it (3-4 bullet points)
4. **Product/Demo**: Key features and how it works
5. **Market Opportunity**: TAM, SAM, SOM with realistic numbers
6. **Business Model**: How you make money (pricing, revenue streams)
7. **Traction/Roadmap**: Current status and future milestones
8. **Competition**: Competitive landscape and differentiation
9. **Go-to-Market Strategy**: How you'll acquire customers
10. **Team**: Founder/team highlights (placeholder)
11. **Financial Projections**: 3-year revenue projections
12. **Ask/Use of Funds**: Funding amount and allocation

For each slide provide:
- Title
- 3-5 concise bullet points
- Detailed speaker notes (what to say when presenting)
- Appropriate layout type

Use realistic numbers and data. Make it compelling for investors.

Return ONLY valid JSON with no markdown formatting or code blocks. Set the date to "${today}".`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
    }

    const data: OpenRouterResponse = await response.json() as OpenRouterResponse;
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenRouter API');
    }
    
    try {
      let jsonContent = content;
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1];
      }
      
      const jsonData = JSON.parse(jsonContent);
      ctx.logger.info('Successfully generated pitch deck');
      return resp.json(jsonData);
    } catch (parseError) {
      ctx.logger.error('Failed to parse JSON response:', parseError);
      return resp.json({
        error: 'Failed to parse AI response',
        details: content.substring(0, 500)
      });
    }
  } catch (error) {
    ctx.logger.error('Error running pitch deck agent:', error);
    return resp.json({ error: 'Failed to generate pitch deck', details: String(error) });
  }
}
