import JobPostingForm from "./components/job-posting-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EBF2FA]">
      <div className="container mx-auto py-4">
        <JobPostingForm />
      </div>
    </main>
  )
}
