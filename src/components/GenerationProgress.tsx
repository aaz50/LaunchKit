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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-linear-to-br from-blue-500 to-purple-600 rounded-full animate-pulse">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>
        <CardTitle className="text-2xl">Generating Your Launch Package</CardTitle>
        <CardDescription>
          Our AI agents are working hard to create your materials...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(status.progress)}%</span>
          </div>
          <Progress value={status.progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {agents.map((agent) => {
            const isActive = status.currentAgent === agent.id;
            const isComplete = status.progress > (agents.findIndex(a => a.id === agent.id) + 1) * 33;
            const Icon = agent.icon;

            return (
              <div
                key={agent.id}
                className={`p-4 border rounded-lg transition-all ${
                  isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                } ${isComplete ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-muted'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{agent.name}</h4>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                  {isActive && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                  {isComplete && <span className="text-green-500">✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        {status.message && (
          <p className="text-center text-sm text-muted-foreground">{status.message}</p>
        )}

        {status.error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{status.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

