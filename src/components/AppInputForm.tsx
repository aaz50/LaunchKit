'use client';

import { useState } from 'react';
import { AppInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Target, Palette, Rocket } from 'lucide-react';

interface AppInputFormProps {
  onSubmit: (input: AppInput) => void;
  loading?: boolean;
}

export function AppInputForm({ onSubmit, loading = false }: AppInputFormProps) {
  const [currentTab, setCurrentTab] = useState('basics');
  const [formData, setFormData] = useState<Partial<AppInput>>({
    appName: '',
    tagline: '',
    targetAudience: '',
    problemSolved: '',
    keyFeatures: ['', '', ''],
    brandColors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
    },
    stylePreference: 'modern',
    competitors: '',
    fundingStage: 'seed',
  });

  const updateField = (field: keyof AppInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.keyFeatures || ['', '', ''])];
    newFeatures[index] = value;
    updateField('keyFeatures', newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [...(formData.keyFeatures || []), ''];
    updateField('keyFeatures', newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.keyFeatures?.filter((_, i) => i !== index);
    updateField('keyFeatures', newFeatures);
  };

  const handleSubmit = () => {
    // Validate
    if (!formData.appName || !formData.tagline || !formData.targetAudience || !formData.problemSolved) {
      alert('Please fill in all required fields');
      return;
    }

    const features = formData.keyFeatures?.filter(f => f.trim() !== '') || [];
    if (features.length < 3) {
      alert('Please provide at least 3 key features');
      return;
    }

    onSubmit({
      ...formData,
      keyFeatures: features,
    } as AppInput);
  };

  const isBasicsComplete = formData.appName && formData.tagline && formData.targetAudience && formData.problemSolved;
  const isFeaturesComplete = (formData.keyFeatures?.filter(f => f.trim() !== '').length || 0) >= 3;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-slate-600 bg-slate-800">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Sparkles className="h-10 w-10 text-white" aria-hidden="true" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-white">App Launch Generator</CardTitle>
        <CardDescription className="text-lg font-medium text-slate-200">
          Tell us about your app and we'll create everything you need to launch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Basics</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2" disabled={!isBasicsComplete}>
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2" disabled={!isFeaturesComplete}>
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="extras" className="flex items-center gap-2" disabled={!isFeaturesComplete}>
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Extras</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="appName" className="text-base font-semibold text-white">App Name *</Label>
              <Input
                id="appName"
                placeholder="e.g., TaskFlow"
                value={formData.appName}
                onChange={(e) => updateField('appName', e.target.value)}
                className="text-base bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-base font-semibold text-white">Tagline *</Label>
              <Input
                id="tagline"
                placeholder="e.g., Project management that actually works"
                value={formData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                className="text-base bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-base font-semibold text-white">Target Audience *</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Small business owners and freelancers"
                value={formData.targetAudience}
                onChange={(e) => updateField('targetAudience', e.target.value)}
                className="text-base bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemSolved" className="text-base font-semibold text-white">Problem Being Solved *</Label>
              <Textarea
                id="problemSolved"
                placeholder="Describe the main problem your app solves..."
                value={formData.problemSolved}
                onChange={(e) => updateField('problemSolved', e.target.value)}
                rows={4}
                className="text-base bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                aria-required="true"
              />
            </div>

            <Button
              onClick={() => setCurrentTab('features')}
              disabled={!isBasicsComplete}
              className="w-full text-base font-semibold h-12"
              aria-label="Continue to features section"
            >
              Continue to Features
            </Button>
          </TabsContent>

          <TabsContent value="features" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold text-white">Key Features * (minimum 3)</Label>
              {formData.keyFeatures?.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="text-base bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                    aria-label={`Feature ${index + 1}`}
                  />
                  {formData.keyFeatures && formData.keyFeatures.length > 3 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      aria-label={`Remove feature ${index + 1}`}
                      className="shrink-0"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addFeature}
                className="w-full text-base font-semibold h-11"
                aria-label="Add another feature"
              >
                + Add Another Feature
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentTab('basics')}
                className="w-full text-base font-semibold h-12"
                aria-label="Go back to basics section"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentTab('branding')}
                disabled={!isFeaturesComplete}
                className="w-full text-base font-semibold h-12"
                aria-label="Continue to branding section"
              >
                Continue to Branding
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold text-white">Brand Colors</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className="text-sm font-medium text-slate-200">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.brandColors?.primary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, primary: e.target.value })}
                      className="w-16 h-11 cursor-pointer bg-slate-700 border-slate-600"
                      aria-label="Choose primary color"
                    />
                    <Input
                      value={formData.brandColors?.primary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, primary: e.target.value })}
                      className="text-base font-mono bg-slate-700 text-white border-slate-600"
                      aria-label="Primary color hex value"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor" className="text-sm font-medium text-slate-200">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.brandColors?.secondary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, secondary: e.target.value })}
                      className="w-16 h-11 cursor-pointer bg-slate-700 border-slate-600"
                      aria-label="Choose secondary color"
                    />
                    <Input
                      value={formData.brandColors?.secondary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, secondary: e.target.value })}
                      className="text-base font-mono bg-slate-700 text-white border-slate-600"
                      aria-label="Secondary color hex value"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor" className="text-sm font-medium text-slate-200">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.brandColors?.accent}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, accent: e.target.value })}
                      className="w-16 h-11 cursor-pointer bg-slate-700 border-slate-600"
                      aria-label="Choose accent color"
                    />
                    <Input
                      value={formData.brandColors?.accent}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, accent: e.target.value })}
                      className="text-base font-mono bg-slate-700 text-white border-slate-600"
                      aria-label="Accent color hex value"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stylePreference" className="text-base font-semibold text-white">Style Preference</Label>
              <Select
                value={formData.stylePreference}
                onValueChange={(value) => updateField('stylePreference', value)}
              >
                <SelectTrigger className="text-base" aria-label="Select style preference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern" className="text-base">Modern</SelectItem>
                  <SelectItem value="minimal" className="text-base">Minimal</SelectItem>
                  <SelectItem value="bold" className="text-base">Bold</SelectItem>
                  <SelectItem value="elegant" className="text-base">Elegant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentTab('features')}
                className="w-full text-base font-semibold h-12"
                aria-label="Go back to features section"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentTab('extras')}
                className="w-full text-base font-semibold h-12"
                aria-label="Continue to extras section"
              >
                Continue to Extras
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="extras" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="competitors" className="text-base font-semibold text-white">Competitors (Optional)</Label>
              <Textarea
                id="competitors"
                placeholder="List your main competitors..."
                value={formData.competitors}
                onChange={(e) => updateField('competitors', e.target.value)}
                rows={3}
                className="text-base bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingStage" className="text-base font-semibold text-white">Funding Stage</Label>
              <Select
                value={formData.fundingStage}
                onValueChange={(value) => updateField('fundingStage', value)}
              >
                <SelectTrigger className="text-base" aria-label="Select funding stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed" className="text-base">Pre-Seed</SelectItem>
                  <SelectItem value="seed" className="text-base">Seed</SelectItem>
                  <SelectItem value="series-a" className="text-base">Series A</SelectItem>
                  <SelectItem value="series-b" className="text-base">Series B</SelectItem>
                  <SelectItem value="bootstrapped" className="text-base">Bootstrapped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentTab('branding')}
                className="w-full text-base font-semibold h-12"
                aria-label="Go back to branding section"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-base font-semibold h-12 shadow-lg hover:shadow-xl transition-all"
                aria-label="Generate launch package"
              >
                {loading ? 'Generating...' : '✨ Generate Launch Package'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

