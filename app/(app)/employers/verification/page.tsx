import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">TEst Seekr</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold">Verification Tiers</h1>
          <p className="text-xl text-muted-foreground">Choose a verification tier to view its details and benefits</p>
          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <Link href="/employers/verification/unverified" className="block">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">Unverified</h2>
                <p className="text-muted-foreground">Basic access with limited features</p>
              </div>
            </Link>
            <Link href="/employers/verification/partially-verified" className="block">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">Partially Verified</h2>
                <p className="text-muted-foreground">Enhanced access with more features</p>
              </div>
            </Link>
            <Link href="/employers/verification/fully-verified" className="block">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">Fully Verified</h2>
                <p className="text-muted-foreground">Complete access to all features</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Seekr. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
