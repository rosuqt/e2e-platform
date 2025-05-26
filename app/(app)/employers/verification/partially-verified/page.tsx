"use client"

import { useState } from "react"
import Image from "next/image"
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VerificationTierCard } from "../components/verification-tier-card"
import { CompanyVerificationModal } from "../components/company-verification-modal"

export default function PartiallyVerifiedPage() {
  const [showCompanyModal, setShowCompanyModal] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section - Pale Purple for Partially Verified */}
      <header className="bg-purple-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-200 p-3 rounded-full mb-4">
              <ShieldCheck className="h-10 w-10 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Partially Verified Account</h1>
            <p className="text-purple-700 max-w-xl">
              Your email has been verified. Complete the company verification process to unlock all premium features.
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
                alt="Partially verified features illustration"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Partially Verified Tier Features</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-purple-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Low Visibility Job Listings</h3>
                    <p className="text-sm text-muted-foreground">
                      Your job listings have improved but limited visibility in search results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Expanded Job Postings</h3>
                    <p className="text-sm text-muted-foreground">
                      Post up to 5 job listings with your partially verified account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Unlocked Features</h3>
                    <p className="text-sm text-muted-foreground">Access to Candidate Matches and Messaging features.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Lock className="h-5 w-5 text-purple-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Still Locked Features</h3>
                    <p className="text-sm text-muted-foreground">AI job writer and Invitations remain locked.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Unlock More With Full Verification</h2>
            <p className="text-muted-foreground mb-8">
              Complete your company verification to maximize your visibility, post unlimited jobs, and access all
              premium features.
            </p>
            <Button
              size="lg"
              onClick={() => setShowCompanyModal(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Complete Verification
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
              currentTier={true}
              color="purple"
              features={[
                { name: "Job Listings", value: "5 listings", included: true },
                { name: "Listing Visibility", value: "Low visibility", included: true },
                { name: "AI Job Writer", value: "Locked", included: false },
                { name: "Messaging", value: "Unlocked", included: true },
                { name: "Candidate Matches", value: "Unlocked", included: true },
                { name: "Invitations", value: "Locked", included: false },
              ]}
              buttonText="Current Tier"
              buttonDisabled={true}
            />

            <VerificationTierCard
              title="Fully Verified"
              description="Complete access to all features"
              currentTier={false}
              color="blue"
              features={[
                { name: "Job Listings", value: "Unlimited", included: true },
                { name: "Listing Visibility", value: "Highest visibility", included: true },
                { name: "AI Job Writer", value: "Unlocked", included: true },
                { name: "Messaging", value: "Unlocked", included: true },
                { name: "Candidate Matches", value: "Unlocked", included: true },
                { name: "Invitations", value: "Unlocked", included: true },
              ]}
              buttonText="Complete Verification"
              buttonAction={() => setShowCompanyModal(true)}
            />
          </div>
        </div>
      </section>

      {/* Company Verification Modal */}
      <CompanyVerificationModal open={showCompanyModal} onOpenChange={setShowCompanyModal} />

      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Job Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
