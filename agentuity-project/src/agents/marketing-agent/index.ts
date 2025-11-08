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
      'Marketing Content Generator Agent - Creates platform-specific social media content using OpenRouter',
    prompts: [
      {
        data: JSON.stringify({
          appName: 'TaskFlow',
          tagline: 'Project management that works',
          targetAudience: 'Small businesses',
          problemSolved: 'Complex project management',
          keyFeatures: ['Simple boards', 'Team collaboration', 'Smart tracking']
        }),
        contentType: 'application/json',
      },
    ],
  };
};

const SYSTEM_PROMPT = `You are an expert social media marketing strategist with deep knowledge of platform-specific best practices, viral content patterns, and conversion-optimized copywriting.

Your task is to create platform-ready launch content that:
- Matches each platform's tone and format
- Respects character limits and best practices
- Includes strategic hashtags and CTAs
- Is ready to post immediately
- Drives engagement and conversions

You must respond with valid JSON matching this exact structure:
{
  "instagram": {
    "platform": "Instagram",
    "posts": [{ "content": string, "hashtags": string[], "imagePrompt": string, "characterCount": number }]
  },
  "twitter": {
    "platform": "Twitter",
    "posts": [{ "content": string, "hashtags": string[], "characterCount": number }]
  },
  "facebook": {
    "platform": "Facebook",
    "posts": [{ "content": string, "hashtags": string[], "imagePrompt": string }]
  },
  "linkedin": {
    "platform": "LinkedIn",
    "posts": [{ "content": string, "hashtags": string[] }]
  },
  "googleAds": [
    {
      "headline1": string,
      "headline2": string,
      "headline3": string,
      "description1": string,
      "description2": string
    }
  ],
  "emailTemplate": {
    "subject": string,
    "preheader": string,
    "body": string
  }
}`;

export default async function MarketingAgent(
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
    }>();

    ctx.logger.info('Generating marketing content for: %s', input.appName);

    const userPrompt = `Create a complete social media launch campaign for:

**App Name:** ${input.appName}
**Tagline:** ${input.tagline}
**Target Audience:** ${input.targetAudience}
**Problem Solved:** ${input.problemSolved}
**Key Features:** ${input.keyFeatures.join(', ')}

Generate launch content for multiple platforms:

**INSTAGRAM (5 posts):**
- Mix of announcement, features, benefits, testimonial, and CTA posts
- Engaging captions (up to 2200 characters)
- 5-10 relevant hashtags per post
- Image/video prompts for visual content
- Include characterCount for each post

**TWITTER/X (5 posts):**
- Launch announcement thread (280 chars max each)
- Feature highlights
- Engaging hooks
- 2-3 hashtags max
- Clear CTAs
- Include characterCount for each post

**FACEBOOK (3 ad variations):**
- Different angles (problem-focused, solution-focused, benefit-focused)
- Compelling hooks
- Clear value propositions
- Strong CTAs
- Image prompts for each

**LINKEDIN (3 posts):**
- Professional tone
- Thought leadership angle
- Industry insights
- Personal story elements
- Relevant hashtags

**GOOGLE ADS (3 variations):**
Each variation must have:
- headline1: 30 characters max
- headline2: 30 characters max  
- headline3: 30 characters max
- description1: 90 characters max
- description2: 90 characters max

**EMAIL LAUNCH TEMPLATE:**
- Compelling subject line (50 chars max)
- Preheader text (100 chars max)
- Email body in HTML format (full email with styling)

Make all content compelling, on-brand, and ready to use immediately.

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
    
    try {
      let jsonContent = content;
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1];
      }
      
      const jsonData = JSON.parse(jsonContent);
      ctx.logger.info('Successfully generated marketing content');
      return resp.json(jsonData);
    } catch (parseError) {
      ctx.logger.error('Failed to parse JSON response:', parseError);
      return resp.json({
        error: 'Failed to parse AI response',
        details: content.substring(0, 500)
      });
    }
  } catch (error) {
    ctx.logger.error('Error running marketing agent:', error);
    return resp.json({ error: 'Failed to generate marketing content', details: String(error) });
  }
}
