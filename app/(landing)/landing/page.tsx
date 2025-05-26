import MainLanding from "./main-landing";

export default async function LandingPage() {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return <MainLanding />;
}
