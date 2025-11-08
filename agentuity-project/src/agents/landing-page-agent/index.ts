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
      'Landing Page Generator Agent - Creates beautiful, conversion-focused landing pages using OpenRouter',
    prompts: [
      {
        data: JSON.stringify({
          appName: 'TaskFlow',
          tagline: 'Project management that works',
          targetAudience: 'Small businesses',
          problemSolved: 'Complex project management',
          keyFeatures: ['Simple boards', 'Team collaboration', 'Smart tracking'],
          brandColors: { primary: '#3B82F6', secondary: '#8B5CF6', accent: '#F59E0B' },
          stylePreference: 'modern'
        }),
        contentType: 'application/json',
      },
    ],
  };
};

const SYSTEM_PROMPT = `You are an expert web designer and copywriter specializing in high-converting landing pages for SaaS and tech products.

Your task is to generate comprehensive landing page content that is:
- Compelling and conversion-focused
- SEO-optimized with clear value propositions
- Modern and professional
- Tailored to the target audience
- Ready for immediate implementation

You must respond with valid JSON matching this exact structure:
{
  "hero": { "headline": string, "subheadline": string, "cta": string },
  "features": [{ "title": string, "description": string, "icon": string }],
  "benefits": [{ "title": string, "description": string }],
  "howItWorks": [{ "step": number, "title": string, "description": string }],
  "testimonials": [{ "name": string, "role": string, "content": string, "avatar": string }],
  "cta": { "headline": string, "description": string, "buttonText": string },
  "footer": { "links": [{ "category": string, "items": string[] }] },
  "reactCode": string,
  "htmlCode": string
}`;

export default async function LandingPageAgent(
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
      brandColors: { primary: string; secondary: string; accent: string };
      stylePreference: string;
      competitors?: string;
    }>();

    ctx.logger.info('Generating landing page for: %s', input.appName);

    const userPrompt = `Generate a complete landing page for the following app:

**App Name:** ${input.appName}
**Tagline:** ${input.tagline}
**Target Audience:** ${input.targetAudience}
**Problem Solved:** ${input.problemSolved}
**Key Features:** ${input.keyFeatures.join(', ')}
**Brand Colors:** Primary: ${input.brandColors.primary}, Secondary: ${input.brandColors.secondary}, Accent: ${input.brandColors.accent}
**Style Preference:** ${input.stylePreference}
${input.competitors ? `**Competitors:** ${input.competitors}` : ''}

Generate landing page content with:

1. **Hero Section**: Compelling headline (8-12 words), punchy subheadline (15-25 words), and clear CTA button text
2. **Features Section**: 5 detailed features with titles, descriptions (30-50 words each), and relevant icon names (use lucide-react icon names like "Zap", "Users", "Shield", "TrendingUp", "Clock")
3. **Benefits Section**: 4 key benefits showing outcomes, not features
4. **How It Works**: 3-4 step process explaining the user journey
5. **Testimonials**: 3 realistic testimonial placeholders with names, roles, and authentic feedback
6. **Final CTA Section**: Strong closing call-to-action with headline and description
7. **Footer**: Organized footer links in 4 categories (Product, Company, Resources, Legal)

Also generate:
- **React Component Code**: A complete Next.js/React component using Tailwind CSS and the provided brand colors. Make it production-ready.
- **HTML Code**: A standalone HTML page with inline CSS using the brand colors. Make it deployable.

Return ONLY valid JSON with no markdown formatting or code blocks.`;

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
    
    // Parse the JSON response (remove markdown code blocks if present)
    try {
      let jsonContent = content;
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1];
      }
      
      const jsonData = JSON.parse(jsonContent);
      ctx.logger.info('Successfully generated landing page');
      return resp.json(jsonData);
    } catch (parseError) {
      ctx.logger.error('Failed to parse JSON response:', parseError);
      return resp.json({
        error: 'Failed to parse AI response',
        details: content.substring(0, 500)
      });
    }
  } catch (error) {
    ctx.logger.error('Error running landing page agent:', error);
    return resp.json({ error: 'Failed to generate landing page', details: String(error) });
  }
}
