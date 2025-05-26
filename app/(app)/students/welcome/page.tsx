import WelcomeFlow from "./welcome-flow/ftue-page";

export default async function LandingPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <WelcomeFlow />;
}
