"use client";
import dynamic from 'next/dynamic';

const MainLanding = dynamic(() => import('./landing/main-landing'), { ssr: false });

export default function LandingPage() {
  return <MainLanding />;
}