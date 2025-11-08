'use client';

import { useState } from 'react';
import { AppInputForm } from '@/components/AppInputForm';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { GenerationProgress } from '@/components/GenerationProgress';
import { AppInput, GenerationResult, GenerationStatus } from '@/types';
import { Rocket } from 'lucide-react';

export default function Home() {
  const [stage, setStage] = useState<'input' | 'generating' | 'results'>('input');
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: 'idle',
    progress: 0,
  });
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleGenerate = async (input: AppInput) => {
    setStage('generating');
    setGenerationStatus({
      status: 'generating',
      progress: 0,
      currentAgent: 'landing-page',
      message: 'Starting generation...',
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationStatus(prev => {
          const newProgress = Math.min(prev.progress + 5, 95);
          let currentAgent = prev.currentAgent;
          
          if (newProgress < 33) {
            currentAgent = 'landing-page';
          } else if (newProgress < 66) {
            currentAgent = 'pitch-deck';
          } else {
            currentAgent = 'marketing';
          }

          return {
            ...prev,
            progress: newProgress,
            currentAgent,
          };
        });
      }, 1000);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data: GenerationResult = await response.json();

      setGenerationStatus({
        status: 'completed',
        progress: 100,
        message: 'Generation complete!',
      });

      setResult(data);
      setStage('results');

    } catch (error: any) {
      console.error('Generation error:', error);
      setGenerationStatus({
        status: 'error',
        progress: 0,
        error: error.message || 'Something went wrong. Please try again.',
      });

      // Reset to input after showing error
      setTimeout(() => {
        setStage('input');
      }, 3000);
    }
  };

  const handleDownload = async (type: 'landing-page' | 'pitch-deck' | 'marketing' | 'all') => {
    if (!result) return;

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data: result }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download. Please try again.');
    }
  };

  const handleReset = () => {
    setStage('input');
    setResult(null);
    setGenerationStatus({
      status: 'idle',
      progress: 0,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-600 bg-slate-800/90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Rocket className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                LaunchKit
              </h1>
              <p className="text-sm font-medium text-slate-200">AI-Powered Launch Package Generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {stage === 'input' && (
          <div className="animate-in fade-in duration-500">
            <AppInputForm onSubmit={handleGenerate} loading={false} />
          </div>
        )}

        {stage === 'generating' && (
          <div className="animate-in fade-in duration-500">
            <GenerationProgress status={generationStatus} />
          </div>
        )}

        {stage === 'results' && result && (
          <div className="animate-in fade-in duration-500">
            <ResultsDashboard
              result={result}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-600 bg-slate-800/90 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-200">Built with Next.js, OpenAI, and OpenRouter</p>
            <p className="mt-2 text-sm text-slate-300">Generate complete launch packages in minutes</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
