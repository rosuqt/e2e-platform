export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second delay
  return <div>Dashboard Loaded</div>;
}
