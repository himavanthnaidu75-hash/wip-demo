'use client';

import { useEffect, useSyncExternalStore, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/store/useStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/cursor/CustomCursor';
import NoiseOverlay from '@/components/effects/NoiseOverlay';
import HomePage from '@/components/demo/HomePage';
import RestaurantDemo from '@/components/demo/RestaurantDemo';
import ElectronicsDemo from '@/components/demo/ElectronicsDemo';
import HotelDemo from '@/components/demo/HotelDemo';
import GenericDemo from '@/components/demo/GenericDemo';

const Background3D = dynamic(
  () => import('@/components/three/Background3D'),
  { ssr: false }
);

const DEMO_MAP = {
  home: HomePage,
  restaurant: RestaurantDemo,
  electronics: ElectronicsDemo,
  hotel: HotelDemo,
  generic: GenericDemo,
};

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function useScrollSync() {
  const setScrollY = useAppStore((s) => s.setScrollY);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, [setScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-cinematic-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-rose/30 border-t-rose rounded-full animate-spin" />
        <span className="text-xs tracking-[0.3em] uppercase text-white/30">
          Loading experience...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const currentView = useAppStore((s) => s.currentView);
  const hydrated = useHydrated();
  useScrollSync();

  const canvasOpacity = currentView === 'home' ? 1 : 0.35;

  if (!hydrated) {
    return <LoadingScreen />;
  }

  const CurrentDemo = DEMO_MAP[currentView];

  return (
    <>
      <CustomCursor />
      <NoiseOverlay />
      <Background3D opacity={canvasOpacity} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <CurrentDemo key={currentView} />
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  );
}