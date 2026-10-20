import { PortfolioProject } from '../types';

// Demonstration assets generated for Asad Ali Awan's portfolio
import webDesignImg from '../assets/images/portfolio_web_design_1792506089045.jpg';
import aiVideoImg from '../assets/images/portfolio_ai_video_1792506088821.jpg';
import aiImageImg from '../assets/images/portfolio_ai_image_1792506089803.jpg';
import aiContentImg from '../assets/images/portfolio_ai_content_1792506090104.jpg';

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'project-web-1',
    title: 'Fintech & SaaS Marketing Platform',
    category: 'Websites',
    image: webDesignImg,
    shortDescription: 'High-converting responsive web platform with modern dark UI, interactive analytics preview, and optimized user acquisition funnel.',
    fullDescription: 'Architected and built a sleek, conversion-focused responsive web experience designed for tech startups. Features high-contrast dark theme aesthetics, custom typography scale, accessible interactive navigation, and ultra-fast page load times.',
    deliverables: [
      'Responsive React / Tailwind CSS codebase',
      'Mobile-first performance optimization',
      'Interactive service & feature showcases',
      'High-converting inquiry & lead capture funnel'
    ],
    toolsUsed: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'UI/UX Design'],
    externalLink: '#',
    isDemonstration: true
  },
  {
    id: 'project-video-1',
    title: 'Neo-Veridia: Cinematic Sci-Fi Brand Reel',
    category: 'AI Videos',
    image: aiVideoImg,
    shortDescription: 'Atmospheric AI-generated video concept featuring dynamic camera movements, cyberpunk architectural vistas, and synchronized audio-visual storytelling.',
    fullDescription: 'Produced a cinematic AI video concept showcasing atmospheric depth, photorealistic lighting, and seamless sequence transitions. Demonstrates creative storytelling and prompt engineering for commercial and promotional storytelling.',
    deliverables: [
      'Concept ideation & storyboard development',
      'High-resolution generative video renders',
      'Color grading & atmospheric lighting alignment',
      'Multi-format export (16:9 widescreen & 9:16 vertical)'
    ],
    toolsUsed: ['Generative Video AI', 'Prompt Crafting', 'Video Editing', 'Post-Production'],
    externalLink: '#',
    isDemonstration: true
  },
  {
    id: 'project-image-1',
    title: 'Biophilic Architectural Concept Art',
    category: 'AI Images',
    image: aiImageImg,
    shortDescription: 'Hyper-detailed conceptual architectural visual rendering organic travertine curves, twilight ambient illumination, and structural realism.',
    fullDescription: 'High-fidelity visual asset generated with generative imagery workflows. Created for architectural conceptualization, high-end pitch decks, and visual marketing campaigns with strict control over textures, reflections, and atmospheric balance.',
    deliverables: [
      'High-resolution 8K commercial rendering',
      'Custom prompt engineering & seed tuning',
      'Material & texture refinement',
      'Commercial-use digital asset licensing'
    ],
    toolsUsed: ['Advanced Generative AI', 'Concept Direction', 'Digital Inpainting'],
    externalLink: '#',
    isDemonstration: true
  },
  {
    id: 'project-content-1',
    title: 'Aurora Lumina: Luxury Brand Creative Kit',
    category: 'AI Content',
    image: aiContentImg,
    shortDescription: 'Complete digital marketing visual package with 3D-styled cosmetic product renders, minimal typography, and social media advertising assets.',
    fullDescription: 'A multi-channel visual content campaign tailored for premium consumer brands. Combines photorealistic studio staging, modern typography hierarchy, and cohesive social campaign collateral designed to maximize click-through rate.',
    deliverables: [
      'Cohesive campaign visual identity',
      'Product showcase promotional graphics',
      'Multi-platform social media ad creatives',
      'Editorial banner & e-commerce asset suite'
    ],
    toolsUsed: ['AI Content Strategy', 'Studio Lighting AI', 'Brand Layout Design'],
    externalLink: '#',
    isDemonstration: true
  }
];
