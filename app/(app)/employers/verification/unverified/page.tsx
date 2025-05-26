"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Shield, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VerificationTierCard } from "../components/verification-tier-card"
import { EmailVerificationModal } from "../components/email-verification-modal"

export default function UnverifiedPage() {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const tiersRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section - Gray for Unverified */}
      <header className="bg-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-300 p-3 rounded-full mb-4">
              <Shield className="h-10 w-10 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Unverified Account</h1>
            <p className="text-gray-600 max-w-xl">
              Your account is currently unverified. Verify your account to unlock more features and increase your
              visibility.
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
                alt="Unverified features illustration"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Unverified Tier Features</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Invisible Job Listings</h3>
                    <p className="text-sm text-muted-foreground">
                      Your job listings have limited visibility in search results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Limited Job Postings</h3>
                    <p className="text-sm text-muted-foreground">
                      Post up to 3 job listings with your unverified account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Lock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Locked Premium Features</h3>
                    <p className="text-sm text-muted-foreground">
                      AI job writer, Messaging, Candidate Matches, and Invitations are locked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Unlock More With Verification</h2>
            <p className="text-muted-foreground mb-8">
              Verify your account to increase your visibility, post more jobs, and access premium features.
            </p>
            <Button
              size="lg"
              onClick={() => {
                tiersRef.current?.scrollIntoView({ behavior: "smooth" })
              }}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
            >
              Verify now!
            </Button>
          </div>
        </div>
      </section>

      {/* Verification Tiers Comparison */}
      <section ref={tiersRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Verification Tiers</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <VerificationTierCard
              title="Unverified"
              description="Basic access with limited features"
              currentTier={true}
              color="gray"
              features={[
                { name: "Job Listings", value: "3 listings", included: true },
                { name: "Listing Visibility", value: "Invisible", included: false },
                { name: "AI Job Writer", value: "Locked", included: false },
                { name: "Messaging", value: "Locked", included: false },
                { name: "Candidate Matches", value: "Locked", included: false },
                { name: "Invitations", value: "Locked", included: false },
              ]}
              buttonText="Current Tier"
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
              buttonText="Verify Email"
              buttonAction={() => setShowEmailModal(true)}
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
              buttonAction={() => setShowEmailModal(true)}
            />
          </div>
        </div>
      </section>

      {/* Email Verification Modal */}
      <EmailVerificationModal open={showEmailModal} onOpenChange={setShowEmailModal} />

      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Job Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
