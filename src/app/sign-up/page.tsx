import EmployerSignup from "./components/EmployerSignup";

export default function EmployerSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl h-[600px] flex items-center bg-white p-6 rounded-lg shadow-md">
        <EmployerSignup />
      </div>
    </div>
  );
}
