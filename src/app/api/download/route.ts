import { NextRequest, NextResponse } from 'next/server';
import { GenerationResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { type, data }: { type: 'landing-page' | 'pitch-deck' | 'marketing' | 'all', data: GenerationResult } = await req.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    let content = '';
    let filename = '';
    let contentType = 'text/plain';

    switch (type) {
      case 'landing-page':
        if (data.landingPage?.htmlCode) {
          content = data.landingPage.htmlCode;
          filename = `${data.projectId}-landing-page.html`;
          contentType = 'text/html';
        }
        break;

      case 'pitch-deck':
        if (data.pitchDeck) {
          // Convert pitch deck to markdown format for download
          content = convertPitchDeckToMarkdown(data.pitchDeck);
          filename = `${data.projectId}-pitch-deck.md`;
          contentType = 'text/markdown';
        }
        break;

      case 'marketing':
        if (data.marketing) {
          content = JSON.stringify(data.marketing, null, 2);
          filename = `${data.projectId}-marketing.json`;
          contentType = 'application/json';
        }
        break;

      case 'all':
        content = JSON.stringify(data, null, 2);
        filename = `${data.projectId}-complete.json`;
        contentType = 'application/json';
        break;
    }

    if (!content) {
      return NextResponse.json(
        { error: 'No content available for download' },
        { status: 404 }
      );
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

function convertPitchDeckToMarkdown(pitchDeck: any): string {
  let markdown = `# ${pitchDeck.metadata.title}\n\n`;
  markdown += `## ${pitchDeck.metadata.subtitle}\n\n`;
  markdown += `**Author:** ${pitchDeck.metadata.author}\n`;
  markdown += `**Date:** ${pitchDeck.metadata.date}\n\n`;
  markdown += `---\n\n`;

  pitchDeck.slides.forEach((slide: any) => {
    markdown += `## Slide ${slide.slideNumber}: ${slide.title}\n\n`;
    
    if (slide.content && slide.content.length > 0) {
      slide.content.forEach((point: string) => {
        markdown += `- ${point}\n`;
      });
    }
    
    markdown += `\n**Speaker Notes:**\n${slide.speakerNotes}\n\n`;
    markdown += `---\n\n`;
  });

  return markdown;
}

