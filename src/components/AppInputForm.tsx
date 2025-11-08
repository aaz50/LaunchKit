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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">App Launch Generator</CardTitle>
        <CardDescription className="text-lg">
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
              <Label htmlFor="appName">App Name *</Label>
              <Input
                id="appName"
                placeholder="e.g., TaskFlow"
                value={formData.appName}
                onChange={(e) => updateField('appName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                placeholder="e.g., Project management that actually works"
                value={formData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Small business owners and freelancers"
                value={formData.targetAudience}
                onChange={(e) => updateField('targetAudience', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemSolved">Problem Being Solved *</Label>
              <Textarea
                id="problemSolved"
                placeholder="Describe the main problem your app solves..."
                value={formData.problemSolved}
                onChange={(e) => updateField('problemSolved', e.target.value)}
                rows={4}
              />
            </div>

            <Button
              onClick={() => setCurrentTab('features')}
              disabled={!isBasicsComplete}
              className="w-full"
            >
              Continue to Features
            </Button>
          </TabsContent>

          <TabsContent value="features" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Label>Key Features * (minimum 3)</Label>
              {formData.keyFeatures?.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                  />
                  {formData.keyFeatures && formData.keyFeatures.length > 3 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addFeature}
                className="w-full"
              >
                + Add Another Feature
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentTab('basics')}
                className="w-full"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentTab('branding')}
                disabled={!isFeaturesComplete}
                className="w-full"
              >
                Continue to Branding
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Label>Brand Colors</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className="text-sm">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.brandColors?.primary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, primary: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.brandColors?.primary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, primary: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor" className="text-sm">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.brandColors?.secondary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, secondary: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.brandColors?.secondary}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, secondary: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor" className="text-sm">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.brandColors?.accent}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, accent: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.brandColors?.accent}
                      onChange={(e) => updateField('brandColors', { ...formData.brandColors, accent: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stylePreference">Style Preference</Label>
              <Select
                value={formData.stylePreference}
                onValueChange={(value) => updateField('stylePreference', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentTab('features')}
                className="w-full"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentTab('extras')}
                className="w-full"
              >
                Continue to Extras
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="extras" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="competitors">Competitors (Optional)</Label>
              <Textarea
                id="competitors"
                placeholder="List your main competitors..."
                value={formData.competitors}
                onChange={(e) => updateField('competitors', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingStage">Funding Stage</Label>
              <Select
                value={formData.fundingStage}
                onValueChange={(value) => updateField('fundingStage', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentTab('branding')}
                className="w-full"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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

