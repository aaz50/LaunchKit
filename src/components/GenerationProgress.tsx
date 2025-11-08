'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Globe, FileText, Megaphone, Loader2 } from 'lucide-react';
import { GenerationStatus } from '@/types';

interface GenerationProgressProps {
  status: GenerationStatus;
}

export function GenerationProgress({ status }: GenerationProgressProps) {
  const agents = [
    { id: 'landing-page', name: 'Landing Page', icon: Globe, description: 'Creating your stunning landing page' },
    { id: 'pitch-deck', name: 'Pitch Deck', icon: FileText, description: 'Building investor-ready pitch deck' },
    { id: 'marketing', name: 'Marketing', icon: Megaphone, description: 'Generating social media content' },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-slate-600 bg-slate-800">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse shadow-xl">
            <Loader2 className="h-12 w-12 text-white animate-spin" aria-hidden="true" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-white">Generating Your Launch Package</CardTitle>
        <CardDescription className="text-base font-medium text-slate-200">
          Our AI agents are working hard to create your materials...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-white">Overall Progress</span>
            <span className="text-blue-400">{Math.round(status.progress)}%</span>
          </div>
          <Progress value={status.progress} className="h-3" aria-label={`${Math.round(status.progress)}% complete`} />
        </div>

        <div className="space-y-3">
          {agents.map((agent) => {
            const isActive = status.currentAgent === agent.id;
            const isComplete = status.progress > (agents.findIndex(a => a.id === agent.id) + 1) * 33;
            const Icon = agent.icon;

            return (
              <div
                key={agent.id}
                className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'border-blue-500 bg-blue-900/40 shadow-lg' 
                    : 'border-slate-600 bg-slate-700'
                } ${isComplete ? 'opacity-60' : ''}`}
                role="status"
                aria-live="polite"
                aria-label={`${agent.name} ${isActive ? 'in progress' : isComplete ? 'complete' : 'pending'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md' 
                      : 'bg-slate-600 text-slate-200'
                  }`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base text-white">{agent.name}</h4>
                    <p className="text-sm font-medium text-slate-200">{agent.description}</p>
                  </div>
                  {isActive && <Loader2 className="h-6 w-6 animate-spin text-blue-400" aria-hidden="true" />}
                  {isComplete && <span className="text-green-400 text-2xl" aria-label="Complete">✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        {status.message && (
          <p className="text-center text-base font-medium text-slate-200">{status.message}</p>
        )}

        {status.error && (
          <div className="p-4 bg-red-900/40 border-2 border-red-600 rounded-xl" role="alert">
            <p className="text-base font-semibold text-red-200">{status.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

