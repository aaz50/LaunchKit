import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import PptxGenJS from 'pptxgenjs';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface PitchDeckSlide {
  slideNumber: number;
  title: string;
  content: string[];
  speakerNotes: string;
  layout: 'title' | 'bullets' | 'two-column' | 'image-text' | 'chart';
}

interface PitchDeckData {
  slides: PitchDeckSlide[];
  metadata: {
    title: string;
    subtitle: string;
    author: string;
    date: string;
  };
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

async function generatePPTX(
  pitchDeckData: PitchDeckData,
  brandColors?: { primary: string; secondary: string; accent: string }
): Promise<string> {
  const pptx = new PptxGenJS();
  
  // Configure presentation
  pptx.author = pitchDeckData.metadata.author;
  pptx.title = pitchDeckData.metadata.title;
  pptx.subject = pitchDeckData.metadata.subtitle;
  
  // Helper function to convert hex to PowerPoint color format
  const hexToColor = (hex: string): string => {
    return hex.replace('#', '');
  };
  
  // Define color scheme using user's brand colors with professional defaults
  const colors = {
    primary: brandColors?.primary ? hexToColor(brandColors.primary) : '3B82F6',
    secondary: brandColors?.secondary ? hexToColor(brandColors.secondary) : '8B5CF6',
    accent: brandColors?.accent ? hexToColor(brandColors.accent) : 'F59E0B',
    // Neutral colors for professionalism (70% of design)
    text: '1E293B',         // Slate 800 - main text
    lightText: '64748B',    // Slate 500 - secondary text
    background: 'FFFFFF',   // White - backgrounds
    lightBg: 'F8FAFC',      // Slate 50 - subtle backgrounds
    divider: 'E2E8F0',      // Slate 200 - dividers
  };
  
  // Process each slide
  for (const slideData of pitchDeckData.slides) {
    const slide = pptx.addSlide();
    
    // Add clean white background
    slide.background = { color: colors.background };
    
    if (slideData.slideNumber === 1) {
      // ===== TITLE SLIDE =====
      // Subtle gradient accent bar at top
      slide.addShape('rect', {
        x: 0,
        y: 0,
        w: 10,
        h: 0.15,
        fill: { color: colors.primary }
      });
      
      // Main title with enhanced typography
      slide.addText(pitchDeckData.metadata.title, {
        x: 0.5,
        y: 2.8,
        w: 9,
        h: 1.2,
        fontSize: 48,
        bold: true,
        color: colors.text,
        align: 'center',
        fontFace: 'Arial'
      });
      
      // Accent line under title
      slide.addShape('rect', {
        x: 3.5,
        y: 4.1,
        w: 3,
        h: 0.05,
        fill: { color: colors.accent }
      });
      
      // Subtitle with secondary color
      slide.addText(pitchDeckData.metadata.subtitle, {
        x: 0.5,
        y: 4.5,
        w: 9,
        h: 0.7,
        fontSize: 22,
        color: colors.secondary,
        align: 'center',
        fontFace: 'Arial'
      });
      
      // Author and date in light text
      slide.addText(`${pitchDeckData.metadata.author} | ${pitchDeckData.metadata.date}`, {
        x: 0.5,
        y: 6.8,
        w: 9,
        h: 0.4,
        fontSize: 14,
        color: colors.lightText,
        align: 'center',
        fontFace: 'Arial'
      });
      
    } else {
      // ===== CONTENT SLIDES =====
      const layout = slideData.layout || 'bullets';
      
      // Top accent strip
      slide.addShape('rect', {
        x: 0,
        y: 0,
        w: 10,
        h: 0.1,
        fill: { color: colors.primary }
      });
      
      // Title with underline accent
      slide.addText(slideData.title, {
        x: 0.6,
        y: 0.35,
        w: 8.8,
        h: 0.6,
        fontSize: 32,
        bold: true,
        color: colors.text,
        fontFace: 'Arial'
      });
      
      // Subtle accent line under title
      slide.addShape('rect', {
        x: 0.6,
        y: 1.0,
        w: 1.2,
        h: 0.05,
        fill: { color: colors.accent }
      });
      
      // Layout-specific content
      if (layout === 'bullets') {
        // ===== BULLETS LAYOUT =====
        if (slideData.content && slideData.content.length > 0) {
          slideData.content.forEach((point, index) => {
            const yPos = 1.5 + (index * 0.7);
            
            // Bullet point circle with primary color
            slide.addShape('ellipse', {
              x: 0.7,
              y: yPos + 0.1,
              w: 0.12,
              h: 0.12,
              fill: { color: colors.primary }
            });
            
            // Text content
            slide.addText(point, {
              x: 1.0,
              y: yPos,
              w: 8.3,
              h: 0.6,
              fontSize: 18,
              color: colors.text,
              fontFace: 'Arial',
              valign: 'top'
            });
          });
        }
        
      } else if (layout === 'two-column') {
        // ===== TWO-COLUMN LAYOUT =====
        const midPoint = 5.0;
        const leftContent = slideData.content.slice(0, Math.ceil(slideData.content.length / 2));
        const rightContent = slideData.content.slice(Math.ceil(slideData.content.length / 2));
        
        // Left column
        leftContent.forEach((point, index) => {
          const yPos = 1.5 + (index * 0.65);
          slide.addShape('ellipse', {
            x: 0.7,
            y: yPos + 0.08,
            w: 0.1,
            h: 0.1,
            fill: { color: colors.primary }
          });
          slide.addText(point, {
            x: 1.0,
            y: yPos,
            w: 3.7,
            h: 0.55,
            fontSize: 16,
            color: colors.text,
            fontFace: 'Arial'
          });
        });
        
        // Vertical divider with secondary color
        slide.addShape('rect', {
          x: midPoint - 0.02,
          y: 1.4,
          w: 0.04,
          h: 4.8,
          fill: { color: colors.secondary }
        });
        
        // Right column
        rightContent.forEach((point, index) => {
          const yPos = 1.5 + (index * 0.65);
          slide.addShape('ellipse', {
            x: midPoint + 0.2,
            y: yPos + 0.08,
            w: 0.1,
            h: 0.1,
            fill: { color: colors.primary }
          });
          slide.addText(point, {
            x: midPoint + 0.5,
            y: yPos,
            w: 3.7,
            h: 0.55,
            fontSize: 16,
            color: colors.text,
            fontFace: 'Arial'
          });
        });
        
      } else if (layout === 'image-text') {
        // ===== IMAGE-TEXT LAYOUT =====
        // Image placeholder with colored border
        slide.addShape('rect', {
          x: 0.6,
          y: 1.4,
          w: 4.2,
          h: 4.8,
          fill: { color: colors.lightBg },
          line: { color: colors.primary, width: 3 }
        });
        
        // "Image" placeholder text
        slide.addText('[Product Demo]', {
          x: 0.6,
          y: 3.5,
          w: 4.2,
          h: 0.6,
          fontSize: 16,
          color: colors.lightText,
          align: 'center',
          italic: true,
          fontFace: 'Arial'
        });
        
        // Content on the right with accent highlights
        if (slideData.content && slideData.content.length > 0) {
          slideData.content.forEach((point, index) => {
            const yPos = 1.5 + (index * 0.9);
            
            // Accent bar for each point
            slide.addShape('rect', {
              x: 5.2,
              y: yPos,
              w: 0.08,
              h: 0.7,
              fill: { color: colors.accent }
            });
            
            slide.addText(point, {
              x: 5.5,
              y: yPos,
              w: 3.9,
              h: 0.8,
              fontSize: 16,
              color: colors.text,
              fontFace: 'Arial',
              valign: 'top'
            });
          });
        }
        
      } else if (layout === 'chart') {
        // ===== CHART LAYOUT =====
        // Large chart/data area with subtle background
        slide.addShape('rect', {
          x: 0.6,
          y: 1.4,
          w: 8.8,
          h: 4.5,
          fill: { color: colors.lightBg },
          line: { color: colors.divider, width: 1 }
        });
        
        // Chart placeholder with accent color
        slide.addShape('rect', {
          x: 1.0,
          y: 1.8,
          w: 8.0,
          h: 3.7,
          fill: { color: colors.background },
          line: { color: colors.secondary, width: 2, dashType: 'dash' }
        });
        
        slide.addText('[Data Visualization / Chart]', {
          x: 1.0,
          y: 3.3,
          w: 8.0,
          h: 0.6,
          fontSize: 18,
          color: colors.lightText,
          align: 'center',
          italic: true,
          fontFace: 'Arial'
        });
        
        // Key metrics below chart
        if (slideData.content && slideData.content.length > 0) {
          const metricsY = 6.1;
          const spacing = 8.8 / slideData.content.length;
          
          slideData.content.forEach((metric, index) => {
            const xPos = 0.6 + (index * spacing);
            
            // Metric box with primary color accent
            slide.addShape('rect', {
              x: xPos,
              y: metricsY - 0.15,
              w: spacing - 0.2,
              h: 0.05,
              fill: { color: colors.primary }
            });
            
            slide.addText(metric, {
              x: xPos,
              y: metricsY,
              w: spacing - 0.2,
              h: 0.7,
              fontSize: 13,
              color: colors.text,
              align: 'center',
              fontFace: 'Arial',
              bold: true
            });
          });
        }
        
      } else {
        // Default to bullets layout
        if (slideData.content && slideData.content.length > 0) {
          slideData.content.forEach((point, index) => {
            const yPos = 1.5 + (index * 0.7);
            
            slide.addShape('ellipse', {
              x: 0.7,
              y: yPos + 0.1,
              w: 0.12,
              h: 0.12,
              fill: { color: colors.primary }
            });
            
            slide.addText(point, {
              x: 1.0,
              y: yPos,
              w: 8.3,
              h: 0.6,
              fontSize: 18,
              color: colors.text,
              fontFace: 'Arial'
            });
          });
        }
      }
      
      // Footer with slide number
      slide.addShape('rect', {
        x: 0,
        y: 7.4,
        w: 10,
        h: 0.1,
        fill: { color: colors.lightBg }
      });
      
      slide.addText(`${slideData.slideNumber}`, {
        x: 9.2,
        y: 7.15,
        w: 0.5,
        h: 0.3,
        fontSize: 11,
        color: colors.lightText,
        align: 'right',
        fontFace: 'Arial'
      });
    }
    
    // Add speaker notes
    if (slideData.speakerNotes) {
      slide.addNotes(slideData.speakerNotes);
    }
  }
  
  // Generate PPTX as base64
  const pptxData = await pptx.write({ outputType: 'base64' });
  return pptxData as string;
}

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
      brandColors?: {
        primary: string;
        secondary: string;
        accent: string;
      };
      stylePreference?: 'modern' | 'minimal' | 'bold' | 'elegant';
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

1. **Title Slide**: Company name, tagline, and contact info (layout: "title")
2. **Problem**: The pain point in the market, 3-4 bullet points (layout: "bullets")
3. **Solution**: How ${input.appName} solves it, 3-4 bullet points (layout: "bullets")
4. **Product/Demo**: Key features with visual emphasis (layout: "image-text")
5. **Market Opportunity**: TAM, SAM, SOM with realistic numbers (layout: "chart")
6. **Business Model**: Pricing and revenue streams (layout: "two-column")
7. **Traction/Roadmap**: Current status and future milestones (layout: "bullets")
8. **Competition**: Before/After or competitive comparison (layout: "two-column")
9. **Go-to-Market Strategy**: Customer acquisition channels (layout: "bullets")
10. **Team**: Founder/team highlights - placeholder (layout: "bullets")
11. **Financial Projections**: 3-year revenue/growth data (layout: "chart")
12. **Ask/Use of Funds**: Funding amount and allocation breakdown (layout: "bullets")

IMPORTANT LAYOUT GUIDELINES:
- Use "title" ONLY for the first slide
- Use "bullets" for standard content with bullet points (40% of slides)
- Use "two-column" for comparisons, before/after, or split content (20% of slides)
- Use "image-text" for product demos or visual features (20% of slides)
- Use "chart" for data, metrics, or financial information (20% of slides)
- Vary the layouts for visual interest

For each slide provide:
- Title (clear and compelling)
- 3-5 concise bullet points or data points
- Detailed speaker notes (2-3 sentences on what to say when presenting)
- Layout type that matches the content

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
        model: 'openai/gpt-4o',
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
      
      const jsonData: PitchDeckData = JSON.parse(jsonContent);
      ctx.logger.info('Successfully generated pitch deck JSON');
      
      // Generate PPTX from the JSON data
      try {
        ctx.logger.info('Generating PPTX file...');
        const pptxBase64 = await generatePPTX(jsonData, input.brandColors);
        ctx.logger.info('Successfully generated PPTX file');
        
        // Return both the slide data and the PPTX file
        return resp.json({
          slides: jsonData.slides,
          metadata: jsonData.metadata,
          pptxBase64: pptxBase64
        });
      } catch (pptxError) {
        ctx.logger.error('Failed to generate PPTX:', pptxError);
        // Fallback: return just the JSON data with an error message
        return resp.json({
          slides: jsonData.slides,
          metadata: jsonData.metadata,
          pptxBase64: '',
          error: 'Failed to generate PPTX file',
          details: String(pptxError)
        });
      }
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
