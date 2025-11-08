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
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-slate-600">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-white">
                <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10" aria-hidden="true" />
                Launch Package Ready!
              </CardTitle>
              <CardDescription className="text-slate-100 text-base md:text-lg mt-2 font-medium">
                Your complete app launch materials have been generated
              </CardDescription>
            </div>
            <Button 
              onClick={onReset} 
              variant="secondary" 
              className="h-11 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Create another launch package"
            >
              Create Another
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={() => onDownload('landing-page')}
          className="h-auto py-6 flex-col gap-3 text-base font-semibold border-2 border-slate-600 bg-slate-800 text-white hover:border-blue-500 hover:bg-slate-700 transition-all"
          variant="outline"
          aria-label="Download landing page"
        >
          <Globe className="h-7 w-7" aria-hidden="true" />
          <span>Download Landing Page</span>
        </Button>
        <Button
          onClick={() => onDownload('pitch-deck')}
          className="h-auto py-6 flex-col gap-3 text-base font-semibold border-2 border-slate-600 bg-slate-800 text-white hover:border-purple-500 hover:bg-slate-700 transition-all"
          variant="outline"
          aria-label="Download pitch deck"
        >
          <FileText className="h-7 w-7" aria-hidden="true" />
          <span>Download Pitch Deck</span>
        </Button>
        <Button
          onClick={() => onDownload('marketing')}
          className="h-auto py-6 flex-col gap-3 text-base font-semibold border-2 border-slate-600 bg-slate-800 text-white hover:border-indigo-500 hover:bg-slate-700 transition-all"
          variant="outline"
          aria-label="Download marketing materials"
        >
          <Megaphone className="h-7 w-7" aria-hidden="true" />
          <span>Download Marketing</span>
        </Button>
        <Button
          onClick={() => onDownload('all')}
          className="h-auto py-6 flex-col gap-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
          aria-label="Download all materials"
        >
          <Download className="h-7 w-7" aria-hidden="true" />
          <span>Download All</span>
        </Button>
      </div>

      {/* Content Preview */}
      <Tabs defaultValue="landing-page" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-slate-700 border border-slate-600">
          <TabsTrigger value="landing-page" className="text-base font-semibold py-3 text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-md">
            Landing Page
          </TabsTrigger>
          <TabsTrigger value="pitch-deck" className="text-base font-semibold py-3 text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400 data-[state=active]:shadow-md">
            Pitch Deck
          </TabsTrigger>
          <TabsTrigger value="marketing" className="text-base font-semibold py-3 text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-400 data-[state=active]:shadow-md">
            Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="landing-page" className="space-y-4 mt-6">
          {result.landingPage ? (
            <>
              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-3 text-white">{result.landingPage.hero.headline}</h3>
                    <p className="text-lg font-medium text-slate-200 mb-4">{result.landingPage.hero.subheadline}</p>
                    <Button className="mt-4 text-base font-semibold h-11" aria-label={result.landingPage.hero.cta}>
                      {result.landingPage.hero.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.landingPage.features.map((feature, idx) => (
                      <div key={idx} className="p-5 border-2 border-slate-600 rounded-xl bg-slate-700 hover:border-blue-500 transition-colors">
                        <h4 className="font-bold text-base mb-2 text-white">{feature.title}</h4>
                        <p className="text-sm font-medium text-slate-200">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {result.landingPage.howItWorks.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base mb-1 text-white">{step.title}</h4>
                          <p className="text-sm font-medium text-slate-200">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-white">React Component Code</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.landingPage.reactCode, 'react')}
                      className="font-semibold gap-2 border-slate-600 text-white hover:bg-slate-700"
                      aria-label={copiedSection === 'react' ? 'Copied to clipboard' : 'Copy code to clipboard'}
                    >
                      {copiedSection === 'react' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 text-slate-100 p-5 rounded-xl overflow-x-auto text-sm border-2 border-slate-700">
                    <code className="font-mono">{result.landingPage.reactCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-md border-slate-600 bg-slate-800">
              <CardContent className="py-12 text-center">
                <p className="text-base font-semibold text-red-400">Landing page generation failed. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pitch-deck" className="space-y-4 mt-6">
          {result.pitchDeck ? (
            <>
              <Card className="shadow-md border-slate-600 bg-gradient-to-br from-purple-900/40 to-blue-900/40">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white">{result.pitchDeck.metadata.title}</CardTitle>
                  <CardDescription className="text-lg font-medium text-slate-200">{result.pitchDeck.metadata.subtitle}</CardDescription>
                </CardHeader>
              </Card>

              {result.pitchDeck.slides.map((slide, idx) => (
                <Card key={idx} className="shadow-md border-slate-600 bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                      Slide {slide.slideNumber}: {slide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <ul className="list-disc list-inside space-y-3 ml-2">
                      {slide.content.map((point, pointIdx) => (
                        <li key={pointIdx} className="text-base font-medium text-slate-200">{point}</li>
                      ))}
                    </ul>
                    <Separator className="my-4 bg-slate-600" />
                    <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                      <p className="text-sm font-bold text-slate-200 mb-2">Speaker Notes:</p>
                      <p className="text-base font-medium text-slate-200">{slide.speakerNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Card className="shadow-md border-slate-600 bg-slate-800">
              <CardContent className="py-12 text-center">
                <p className="text-base font-semibold text-red-400">Pitch deck generation failed. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4 mt-6">
          {result.marketing ? (
            <>
              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Instagram Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.marketing.instagram.posts.map((post, idx) => (
                    <div key={idx} className="p-5 border-2 border-slate-600 rounded-xl space-y-3 bg-slate-700">
                      <p className="text-base font-medium text-white">{post.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag, tagIdx) => (
                          <span key={tagIdx} className="text-sm font-semibold bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full border border-blue-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {post.imagePrompt && (
                        <p className="text-sm font-medium text-slate-200 italic bg-slate-600 p-3 rounded-lg border border-slate-500">
                          Image: {post.imagePrompt}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(post.content, `ig-${idx}`)}
                        className="font-semibold gap-2 text-white hover:bg-slate-600"
                        aria-label={copiedSection === `ig-${idx}` ? 'Copied' : 'Copy post'}
                      >
                        {copiedSection === `ig-${idx}` ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Twitter/X Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.marketing.twitter.posts.map((post, idx) => (
                    <div key={idx} className="p-5 border-2 border-slate-600 rounded-xl space-y-3 bg-slate-700">
                      <p className="text-base font-medium text-white">{post.content}</p>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex flex-wrap gap-2">
                          {post.hashtags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="text-sm font-semibold bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full border border-blue-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(post.content, `tw-${idx}`)}
                          className="font-semibold gap-2 text-white hover:bg-slate-600"
                          aria-label={copiedSection === `tw-${idx}` ? 'Copied' : 'Copy post'}
                        >
                          {copiedSection === `tw-${idx}` ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" aria-hidden="true" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm font-semibold text-slate-200 bg-slate-600 px-3 py-1 rounded-full inline-block border border-slate-500">
                        {post.characterCount || post.content.length} characters
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Google Ads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.marketing.googleAds.map((ad, idx) => (
                    <div key={idx} className="p-5 border-2 border-slate-600 rounded-xl space-y-4 bg-slate-700">
                      <div className="space-y-2">
                        <p className="text-base font-bold text-white">Headlines:</p>
                        <p className="text-base font-medium text-slate-200">1. {ad.headline1}</p>
                        <p className="text-base font-medium text-slate-200">2. {ad.headline2}</p>
                        <p className="text-base font-medium text-slate-200">3. {ad.headline3}</p>
                      </div>
                      <Separator className="my-3 bg-slate-600" />
                      <div className="space-y-2">
                        <p className="text-base font-bold text-white">Descriptions:</p>
                        <p className="text-base font-medium text-slate-200">1. {ad.description1}</p>
                        <p className="text-base font-medium text-slate-200">2. {ad.description2}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-md border-slate-600 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Email Launch Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <p className="text-base font-bold mb-2 text-white">Subject:</p>
                    <p className="text-base font-medium p-4 bg-slate-700 rounded-xl border border-slate-600 text-white">
                      {result.marketing.emailTemplate.subject}
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold mb-2 text-white">Preheader:</p>
                    <p className="text-base font-medium p-4 bg-slate-700 rounded-xl border border-slate-600 text-white">
                      {result.marketing.emailTemplate.preheader}
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold mb-2 text-white">Body:</p>
                    <div 
                      className="text-base font-medium p-5 bg-slate-700 rounded-xl border border-slate-600 text-white" 
                      dangerouslySetInnerHTML={{ __html: result.marketing.emailTemplate.body }} 
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(result.marketing.emailTemplate.body, 'email')}
                    className="font-semibold text-base h-11 gap-2 border-slate-600 text-white hover:bg-slate-700"
                    aria-label={copiedSection === 'email' ? 'Email template copied' : 'Copy email template'}
                  >
                    {copiedSection === 'email' ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        <span>Copied Email Template!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" aria-hidden="true" />
                        <span>Copy Email Template</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-md border-slate-600 bg-slate-800">
              <CardContent className="py-12 text-center">
                <p className="text-base font-semibold text-red-400">Marketing content generation failed. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

