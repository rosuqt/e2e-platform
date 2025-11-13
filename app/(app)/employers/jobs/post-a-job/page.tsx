import JobPostingForm from "./components/job-posting-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EBF2FA] flex justify-center items-start">
      <div className="w-full max-w-[1800px] px-2 sm:px-6 md:px-8 py-2">
        <JobPostingForm />
      </div>
    </main>
  )
}
