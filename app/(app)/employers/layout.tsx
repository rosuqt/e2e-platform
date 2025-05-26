import { redirect } from "next/navigation";

async function getUser() {
  return { isAuthenticated: true, role: "employer" };
}

export default async function EmployersLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user.isAuthenticated) {
    redirect("/sign-in");
  }
  if (user.role !== "employer") {
    redirect("/not-authorized");
  }

  return <>{children}</>;
}
