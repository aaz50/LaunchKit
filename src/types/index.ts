export interface AppInput {
  appName: string;
  tagline: string;
  targetAudience: string;
  problemSolved: string;
  keyFeatures: string[];
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  stylePreference: 'modern' | 'minimal' | 'bold' | 'elegant';
  competitors?: string;
  fundingStage?: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'bootstrapped';
}

export interface LandingPageOutput {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  howItWorks: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    avatar: string;
  }>;
  cta: {
    headline: string;
    description: string;
    buttonText: string;
  };
  footer: {
    links: Array<{
      category: string;
      items: string[];
    }>;
  };
  reactCode: string;
  htmlCode: string;
}

export interface PitchDeckSlide {
  slideNumber: number;
  title: string;
  content: string[];
  speakerNotes: string;
  layout: 'title' | 'bullets' | 'two-column' | 'image-text' | 'chart';
}

export interface PitchDeckOutput {
  slides: PitchDeckSlide[];
  metadata: {
    title: string;
    subtitle: string;
    author: string;
    date: string;
  };
}

export interface MarketingContent {
  platform: string;
  posts: Array<{
    content: string;
    hashtags: string[];
    imagePrompt?: string;
    characterCount?: number;
  }>;
}

export interface MarketingOutput {
  instagram: MarketingContent;
  twitter: MarketingContent;
  facebook: MarketingContent;
  linkedin: MarketingContent;
  googleAds: Array<{
    headline1: string;
    headline2: string;
    headline3: string;
    description1: string;
    description2: string;
  }>;
  emailTemplate: {
    subject: string;
    preheader: string;
    body: string;
  };
}

export interface GenerationResult {
  projectId: string;
  landingPage: LandingPageOutput;
  pitchDeck: PitchDeckOutput;
  marketing: MarketingOutput;
  createdAt: string;
}

export interface GenerationStatus {
  status: 'idle' | 'generating' | 'completed' | 'error';
  progress: number;
  currentAgent?: 'landing-page' | 'pitch-deck' | 'marketing';
  message?: string;
  error?: string;
}

