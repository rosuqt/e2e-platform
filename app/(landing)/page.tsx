import dynamic from 'next/dynamic';

const MainLanding = dynamic(() => import('./landing/main-landing'), { ssr: false });

export default async function LandingPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <MainLanding />;
}
