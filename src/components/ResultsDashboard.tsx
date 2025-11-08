'use client';

import { GenerationResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Globe, FileText, Megaphone, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ResultsDashboardProps {
  result: GenerationResult;
  onDownload: (type: 'landing-page' | 'pitch-deck' | 'marketing' | 'all') => void;
  onReset: () => void;
}

export function ResultsDashboard({ result, onDownload, onReset }: ResultsDashboardProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-linear-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8" />
                Launch Package Ready!
              </CardTitle>
              <CardDescription className="text-white/90 text-lg mt-2">
                Your complete app launch materials have been generated
              </CardDescription>
            </div>
            <Button onClick={onReset} variant="secondary">
              Create Another
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          onClick={() => onDownload('landing-page')}
          className="h-auto py-4 flex-col gap-2"
          variant="outline"
        >
          <Globe className="h-6 w-6" />
          <span>Download Landing Page</span>
        </Button>
        <Button
          onClick={() => onDownload('pitch-deck')}
          className="h-auto py-4 flex-col gap-2"
          variant="outline"
        >
          <FileText className="h-6 w-6" />
          <span>Download Pitch Deck</span>
        </Button>
        <Button
          onClick={() => onDownload('marketing')}
          className="h-auto py-4 flex-col gap-2"
          variant="outline"
        >
          <Megaphone className="h-6 w-6" />
          <span>Download Marketing</span>
        </Button>
        <Button
          onClick={() => onDownload('all')}
          className="h-auto py-4 flex-col gap-2 bg-linear-to-r from-blue-500 to-purple-600"
        >
          <Download className="h-6 w-6" />
          <span>Download All</span>
        </Button>
      </div>

      {/* Content Preview */}
      <Tabs defaultValue="landing-page" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
          <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="landing-page" className="space-y-4 mt-6">
          {result.landingPage ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{result.landingPage.hero.headline}</h3>
                    <p className="text-muted-foreground">{result.landingPage.hero.subheadline}</p>
                    <Button className="mt-4">{result.landingPage.hero.cta}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.landingPage.features.map((feature, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.landingPage.howItWorks.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>React Component Code</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.landingPage.reactCode, 'react')}
                    >
                      {copiedSection === 'react' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{result.landingPage.reactCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Landing page generation failed. Please try again.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pitch-deck" className="space-y-4 mt-6">
          {result.pitchDeck ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{result.pitchDeck.metadata.title}</CardTitle>
                  <CardDescription>{result.pitchDeck.metadata.subtitle}</CardDescription>
                </CardHeader>
              </Card>

              {result.pitchDeck.slides.map((slide, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>Slide {slide.slideNumber}: {slide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc list-inside space-y-2">
                      {slide.content.map((point, pointIdx) => (
                        <li key={pointIdx} className="text-sm">{point}</li>
                      ))}
                    </ul>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Speaker Notes:</p>
                      <p className="text-sm">{slide.speakerNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Pitch deck generation failed. Please try again.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4 mt-6">
          {result.marketing ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Instagram Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.marketing.instagram.posts.map((post, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-2">
                      <p className="text-sm">{post.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.map((tag, tagIdx) => (
                          <span key={tagIdx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {post.imagePrompt && (
                        <p className="text-xs text-muted-foreground italic">Image: {post.imagePrompt}</p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(post.content, `ig-${idx}`)}
                      >
                        {copiedSection === `ig-${idx}` ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Twitter/X Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.marketing.twitter.posts.map((post, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-2">
                      <p className="text-sm">{post.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(post.content, `tw-${idx}`)}
                        >
                          {copiedSection === `tw-${idx}` ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{post.characterCount || post.content.length} characters</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Google Ads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.marketing.googleAds.map((ad, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-2">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Headlines:</p>
                        <p className="text-sm">1. {ad.headline1}</p>
                        <p className="text-sm">2. {ad.headline2}</p>
                        <p className="text-sm">3. {ad.headline3}</p>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Descriptions:</p>
                        <p className="text-sm">1. {ad.description1}</p>
                        <p className="text-sm">2. {ad.description2}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Launch Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">Subject:</p>
                    <p className="text-sm p-2 bg-muted rounded">{result.marketing.emailTemplate.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Preheader:</p>
                    <p className="text-sm p-2 bg-muted rounded">{result.marketing.emailTemplate.preheader}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Body:</p>
                    <div className="text-sm p-4 bg-muted rounded" dangerouslySetInnerHTML={{ __html: result.marketing.emailTemplate.body }} />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(result.marketing.emailTemplate.body, 'email')}
                  >
                    {copiedSection === 'email' ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Email Template
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Marketing content generation failed. Please try again.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

