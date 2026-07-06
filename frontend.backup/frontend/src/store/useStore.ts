import { create } from 'zustand';

export type DemoSlug = 'home' | 'restaurant' | 'electronics' | 'hotel' | 'generic';
export type TransitionState = 'idle' | 'exiting' | 'entering';

interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface DemoTheme {
  particleColor: string;
  wireColor: string;
  wireOpacity: number;
  particleOpacity: number;
  particleSpeed: number;
  rotationSpeed: { x: number; y: number };
  floatIntensity: number;
  geometryDetail: number;
  particleSize: number;
  overlayGradient: string;
  accentGlow: string;
}

const CAMERA_TARGETS: Record<DemoSlug, CameraTarget> = {
  home:        { position: [0, 0, 5],    lookAt: [0, 0, 0] },
  restaurant:  { position: [2, 1, 3.5],  lookAt: [-1, 0.5, 0] },
  electronics: { position: [-2, -0.5, 4], lookAt: [1, -0.5, 0] },
  hotel:       { position: [1.5, 2, 3.5], lookAt: [0, 1, 0] },
  generic:     { position: [0, 0.5, 4.5], lookAt: [0, 0, 0] },
};

const DEMO_THEMES: Record<DemoSlug, DemoTheme> = {
  home: {
    particleColor: '#FBC2D1',
    wireColor: '#FBC2D1',
    wireOpacity: 0.12,
    particleOpacity: 0.6,
    particleSpeed: 1,
    rotationSpeed: { x: 0.05, y: 0.08 },
    floatIntensity: 0.5,
    geometryDetail: 1,
    particleSize: 0.015,
    overlayGradient: 'radial-gradient(ellipse at 50% 50%, rgba(251,194,209,0.04) 0%, transparent 70%)',
    accentGlow: 'rgba(251,194,209,0.08)',
  },
  restaurant: {
    particleColor: '#FBC2D1',
    wireColor: '#F4A0B0',
    wireOpacity: 0.15,
    particleOpacity: 0.5,
    particleSpeed: 0.5,
    rotationSpeed: { x: 0.03, y: 0.05 },
    floatIntensity: 0.7,
    geometryDetail: 2,
    particleSize: 0.012,
    overlayGradient: 'radial-gradient(ellipse at 30% 40%, rgba(251,194,209,0.07) 0%, rgba(244,160,176,0.03) 40%, transparent 70%)',
    accentGlow: 'rgba(244,160,176,0.1)',
  },
  electronics: {
    particleColor: '#22d3ee',
    wireColor: '#06b6d4',
    wireOpacity: 0.2,
    particleOpacity: 0.7,
    particleSpeed: 2.0,
    rotationSpeed: { x: 0.1, y: 0.15 },
    floatIntensity: 0.3,
    geometryDetail: 0,
    particleSize: 0.01,
    overlayGradient: 'radial-gradient(ellipse at 70% 30%, rgba(34,211,238,0.06) 0%, rgba(6,182,212,0.02) 40%, transparent 70%)',
    accentGlow: 'rgba(34,211,238,0.08)',
  },
  hotel: {
    particleColor: '#fbbf24',
    wireColor: '#f59e0b',
    wireOpacity: 0.12,
    particleOpacity: 0.5,
    particleSpeed: 0.4,
    rotationSpeed: { x: 0.02, y: 0.03 },
    floatIntensity: 0.8,
    geometryDetail: 1,
    particleSize: 0.018,
    overlayGradient: 'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.06) 0%, rgba(245,158,11,0.03) 40%, transparent 70%)',
    accentGlow: 'rgba(251,191,36,0.1)',
  },
  generic: {
    particleColor: '#c084fc',
    wireColor: '#a855f7',
    wireOpacity: 0.15,
    particleOpacity: 0.55,
    particleSpeed: 0.8,
    rotationSpeed: { x: 0.06, y: 0.09 },
    floatIntensity: 0.6,
    geometryDetail: 2,
    particleSize: 0.014,
    overlayGradient: 'radial-gradient(ellipse at 60% 50%, rgba(192,132,252,0.06) 0%, rgba(168,85,247,0.02) 40%, transparent 70%)',
    accentGlow: 'rgba(192,132,252,0.08)',
  },
};

interface AppStore {
  currentView: DemoSlug;
  previousView: DemoSlug;
  transitionState: TransitionState;
  isTransitioning: boolean;
  scrollY: number;
  theme: DemoTheme;

  navigateTo: (slug: DemoSlug) => void;
  goHome: () => void;
  setTransitionState: (state: TransitionState) => void;
  getCameraTarget: (slug: DemoSlug) => CameraTarget;
  getTheme: (slug: DemoSlug) => DemoTheme;
  setScrollY: (y: number) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  currentView: 'home',
  previousView: 'home',
  transitionState: 'idle',
  isTransitioning: false,
  scrollY: 0,
  theme: DEMO_THEMES.home,

  navigateTo: (slug) => {
    const current = get().currentView;
    if (current === slug) return;
    set({
      previousView: current,
      currentView: slug,
      transitionState: 'entering',
      isTransitioning: true,
      theme: DEMO_THEMES[slug],
    });
    setTimeout(() => {
      set({ transitionState: 'idle', isTransitioning: false });
    }, 800);
  },

  goHome: () => {
    get().navigateTo('home');
  },

  setTransitionState: (state) => set({ transitionState: state }),
  getCameraTarget: (slug) => CAMERA_TARGETS[slug],
  getTheme: (slug) => DEMO_THEMES[slug],
  setScrollY: (y) => set({ scrollY: y }),
}));

export const DEMO_CATEGORIES = [
  {
    slug: 'restaurant' as DemoSlug,
    title: 'Restaurant',
    subtitle: 'Fine Dining & Culinary',
    description: 'Elegant menus, reservations & gallery',
    gradient: 'from-rose-900/40 to-orange-900/20',
    icon: 'UtensilsCrossed',
  },
  {
    slug: 'electronics' as DemoSlug,
    title: 'Electronics',
    subtitle: 'Tech & Gadgets',
    description: 'Product showcases, specs & checkout',
    gradient: 'from-cyan-900/40 to-blue-900/20',
    icon: 'Cpu',
  },
  {
    slug: 'hotel' as DemoSlug,
    title: 'Hotel',
    subtitle: 'Hospitality & Luxury',
    description: 'Rooms, amenities & booking',
    gradient: 'from-amber-900/40 to-yellow-900/20',
    icon: 'Building2',
  },
  {
    slug: 'generic' as DemoSlug,
    title: 'Generic',
    subtitle: 'Custom Template',
    description: 'A versatile template for any business',
    gradient: 'from-purple-900/40 to-pink-900/20',
    icon: 'LayoutTemplate',
  },
];