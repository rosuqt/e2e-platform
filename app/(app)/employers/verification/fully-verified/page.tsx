import Image from "next/image"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VerificationTierCard } from "../components/verification-tier-card"

export default function FullyVerifiedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section - Gradient Blue/Purple for Fully Verified */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mb-4">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Fully Verified Account</h1>
            <p className="text-white/90 max-w-xl">
              Your account is fully verified. Enjoy maximum visibility and access to all premium features.
            </p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Fully verified features illustration"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Fully Verified Tier Features</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Highest Visibility Job Listings</h3>
                    <p className="text-sm text-muted-foreground">
                      Your job listings have maximum visibility in search results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Unlimited Job Postings</h3>
                    <p className="text-sm text-muted-foreground">
                      Post unlimited job listings with your fully verified account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">All Premium Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Full access to AI job writer, Messaging, Candidate Matches, and Invitations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Priority Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Get priority customer support for any issues or questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">You&apos;re All Set!</h2>
            <p className="text-muted-foreground mb-8">
              Your account is fully verified. Start posting jobs and connecting with top candidates.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Post a New Job
            </Button>
          </div>
        </div>
      </section>

      {/* Verification Tiers Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Verification Tiers</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <VerificationTierCard
              title="Unverified"
              description="Basic access with limited features"
              currentTier={false}
              color="gray"
              features={[
                { name: "Job Listings", value: "3 listings", included: true },
                { name: "Listing Visibility", value: "Invisible", included: false },
                { name: "AI Job Writer", value: "Locked", included: false },
                { name: "Messaging", value: "Locked", included: false },
                { name: "Candidate Matches", value: "Locked", included: false },
                { name: "Invitations", value: "Locked", included: false },
              ]}
              buttonText="Downgrade"
              buttonDisabled={true}
            />

            <VerificationTierCard
              title="Partially Verified"
              description="Enhanced access with more features"
              currentTier={false}
              color="purple"
              features={[
                { name: "Job Listings", value: "5 listings", included: true },
                { name: "Listing Visibility", value: "Low visibility", included: true },
                { name: "AI Job Writer", value: "Locked", included: false },
                { name: "Messaging", value: "Unlocked", included: true },
                { name: "Candidate Matches", value: "Unlocked", included: true },
                { name: "Invitations", value: "Locked", included: false },
              ]}
              buttonText="Downgrade"
              buttonDisabled={true}
            />

            <VerificationTierCard
              title="Fully Verified"
              description="Complete access to all features"
              currentTier={true}
              color="blue"
              features={[
                { name: "Job Listings", value: "Unlimited", included: true },
                { name: "Listing Visibility", value: "Highest visibility", included: true },
                { name: "AI Job Writer", value: "Unlocked", included: true },
                { name: "Messaging", value: "Unlocked", included: true },
                { name: "Candidate Matches", value: "Unlocked", included: true },
                { name: "Invitations", value: "Unlocked", included: true },
              ]}
              buttonText="Current Tier"
              buttonDisabled={true}
            />
          </div>
        </div>
      </section>

      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Job Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
