import MainLanding from "./landing/main-landing";

export default async function LandingPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <MainLanding />;
}
