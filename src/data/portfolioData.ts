import { PortfolioProject } from '../types';

import webDesignImg from '../assets/images/portfolio_web_design_1792506089045.jpg';
import aiVideoImg from '../assets/images/portfolio_ai_video_1792506088821.jpg';
import aiImageImg from '../assets/images/portfolio_ai_image_1792506089803.jpg';
import aiContentImg from '../assets/images/portfolio_ai_content_1792506090104.jpg';

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'project-web-1',
    title: 'Fintech & SaaS High-Conversion Platform',
    category: 'Websites',
    image: webDesignImg,
    badge: 'Live Platform',
    shortDescription: 'High-converting responsive web platform with dark mode UI, interactive analytics preview, and optimized user acquisition funnel.',
    fullDescription: 'Architected and engineered a sleek, conversion-focused responsive web experience designed for tech startups and financial platforms. Features high-contrast dark theme aesthetics, custom typography scale, accessible interactive navigation, and sub-second page load times with Core Web Vitals perfection.',
    deliverables: [
      'Responsive React, TypeScript & Tailwind CSS codebase',
      'Mobile-first responsive design across all viewports',
      'Interactive pricing calculator & service showcases',
      'High-converting inquiry & lead capture funnel with instant WhatsApp dispatch'
    ],
    toolsUsed: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'UI/UX Design', 'Express'],
    liveDemoUrl: 'https://asadaliawan.netlify.app/',
    isDemonstration: true
  },
  {
    id: 'project-web-2',
    title: 'AuraCraft: Luxury E-Commerce & Product Showcase',
    category: 'Websites',
    image: aiContentImg,
    badge: 'E-commerce Demo',
    shortDescription: 'Modern minimalist e-commerce storefront with fluid catalog exploration, high-res visual zoom, and fast order checkout.',
    fullDescription: 'Designed an elegant luxury e-commerce experience crafted for premium lifestyle brands. Features frictionless shopping navigation, multi-angle visual galleries, instant cart drawer, and optimized mobile-first checkout flows for maximum conversion rates.',
    deliverables: [
      'High-performance product catalog with interactive category filters',
      'Slide-over shopping cart drawer & multi-currency price previews',
      'Order inquiry automation via verified server email and WhatsApp',
      'SEO structured data for Google Rich Product snippets'
    ],
    toolsUsed: ['React', 'TypeScript', 'Tailwind CSS', 'Responsive UI', 'E-commerce CRO'],
    liveDemoUrl: 'https://asadaliawan.netlify.app/',
    isDemonstration: true
  },
  {
    id: 'project-bot-1',
    title: 'OmniVoice: Gemini AI Business Support Assistant',
    category: 'AI Chatbots',
    image: webDesignImg,
    badge: 'Live Voice & Text AI',
    shortDescription: 'Intelligent Gemini-powered assistant with speech-to-text voice recognition, natural audio responses, and lead capture.',
    fullDescription: 'Developed a production-ready conversational AI assistant integrated directly into business websites. Equipped with multi-modal capabilities: speech-to-text microphone transcription, voice response audio synthesis, bilingual support (English & Urdu), real-time company service knowledge, and automatic project lead qualification.',
    deliverables: [
      'Google Gemini API backend integration with server-side proxy security',
      'Microphone voice input with real-time speech recognition (STT)',
      'Natural audio speech synthesis (TTS) with play/pause and stop controls',
      'Interactive suggestion prompts and fallback recovery mechanics'
    ],
    toolsUsed: ['Google Gemini API', 'Speech Recognition', 'Speech Synthesis', 'TypeScript', 'Node.js'],
    liveDemoUrl: '#open-chatbot',
    isDemonstration: true
  },
  {
    id: 'project-video-1',
    title: 'Neo-Veridia: Cinematic Sci-Fi Brand Reel',
    category: 'AI Videos',
    image: aiVideoImg,
    badge: 'Cinematic Reel',
    shortDescription: 'Atmospheric AI-generated video concept featuring dynamic camera movements, cyberpunk architectural vistas, and synchronized audio-visual storytelling.',
    fullDescription: 'Produced a cinematic AI video concept showcasing atmospheric depth, photorealistic lighting, and seamless sequence transitions. Demonstrates creative storytelling and prompt engineering for commercial and promotional storytelling.',
    deliverables: [
      'Concept ideation & storyboard development',
      'High-resolution generative video renders with cinematic camera moves',
      'Color grading & atmospheric lighting alignment',
      'Multi-format export (16:9 widescreen & 9:16 vertical for social)'
    ],
    toolsUsed: ['Generative Video AI', 'Prompt Crafting', 'Cinematic Composition', 'Post-Production'],
    liveDemoUrl: 'https://wa.me/923164227321?text=Hi%20Asad,%20I%20would%20like%20to%20see%20more%20of%20your%20AI%20video%20reels',
    isDemonstration: true
  },
  {
    id: 'project-image-1',
    title: 'Biophilic Architectural Concept Art',
    category: 'AI Images',
    image: aiImageImg,
    badge: 'Commercial 8K',
    shortDescription: 'Hyper-detailed conceptual architectural visual rendering organic travertine curves, twilight ambient illumination, and structural realism.',
    fullDescription: 'High-fidelity visual asset generated with generative imagery workflows. Created for architectural conceptualization, high-end pitch decks, and visual marketing campaigns with strict control over textures, reflections, and atmospheric balance.',
    deliverables: [
      'High-resolution commercial rendering with photorealistic textures',
      'Custom prompt engineering & seed tuning for repeatable aesthetics',
      'Material & specular reflection refinement',
      'Commercial-use digital asset licensing package'
    ],
    toolsUsed: ['Advanced Generative AI', 'Prompt Crafting', 'Digital Inpainting', 'Color Grading'],
    liveDemoUrl: 'https://wa.me/923164227321?text=Hi%20Asad,%20I%20would%20like%20to%20see%20more%20AI%20imagery%20samples',
    isDemonstration: true
  },
  {
    id: 'project-auto-1',
    title: 'AutoLead Sync: Autonomous Multi-Channel Workflow',
    category: 'AI Tools & Automation',
    image: aiContentImg,
    badge: 'Automated Pipeline',
    shortDescription: 'Autonomous business lead routing system that connects website inquiries to CRM, instant email dispatch, and WhatsApp notifications.',
    fullDescription: 'Architected an automated lead generation and client communication pipeline. When a client submits a project inquiry, the system parses the requirements with AI, formats structured proposals, triggers instant email alerts via Resend, and creates direct WhatsApp deep-links so response times drop under 5 minutes.',
    deliverables: [
      'Zero-latency webhook ingestion & lead validation pipeline',
      'Automatic Resend email notifications with spam honeypot filters',
      'Instant WhatsApp deep-link generation with pre-populated project scopes',
      'Admin lead vault dashboard with real-time status tracking'
    ],
    toolsUsed: ['Node.js', 'Express', 'Resend API', 'Webhooks', 'Process Automation'],
    liveDemoUrl: 'https://asadaliawan.netlify.app/',
    isDemonstration: true
  }
];
