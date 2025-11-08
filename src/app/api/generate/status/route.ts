import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for generation status (for MVP)
// In production, use Redis or a database
const statusStore = new Map<string, any>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json(
      { error: 'projectId is required' },
      { status: 400 }
    );
  }

  const status = statusStore.get(projectId);

  if (!status) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  const { projectId, status, progress, currentAgent, message } = await req.json();

  if (!projectId) {
    return NextResponse.json(
      { error: 'projectId is required' },
      { status: 400 }
    );
  }

  statusStore.set(projectId, {
    status,
    progress,
    currentAgent,
    message,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

