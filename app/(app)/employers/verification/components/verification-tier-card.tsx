"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, X } from "lucide-react"

interface VerificationTierFeature {
  name: string
  value: string
  included: boolean
}

interface VerificationTierCardProps {
  title: string
  description: string
  currentTier: boolean
  color: "gray" | "purple" | "blue"
  features: VerificationTierFeature[]
  buttonText: string
  buttonAction?: () => void
  buttonDisabled?: boolean
}

export function VerificationTierCard({
  title,
  description,
  currentTier,
  color,
  features,
  buttonText,
  buttonAction,
  buttonDisabled = false,
}: VerificationTierCardProps) {
  // Define color classes based on the color prop
  const colorClasses = {
    header: {
      gray: "bg-gray-100 border-gray-200",
      purple: "bg-purple-100 border-purple-200",
      blue: "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200",
    },
    title: {
      gray: "text-gray-900",
      purple: "text-purple-900",
      blue: "text-blue-900",
    },
    icon: {
      gray: "text-gray-500",
      purple: "text-purple-500",
      blue: "text-blue-500",
    },
    button: {
      gray: "bg-gray-600 hover:bg-gray-700",
      purple: "bg-purple-600 hover:bg-purple-700",
      blue: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
    },
  }

  return (
    <Card
      className={`border ${currentTier ? "ring-2 ring-offset-2 " + (color === "blue" ? "ring-blue-500" : color === "purple" ? "ring-purple-500" : "ring-gray-500") : ""}`}
    >
      <CardHeader className={`${colorClasses.header[color]} border-b`}>
        <CardTitle className={`${colorClasses.title[color]}`}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {currentTier && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
            Current Tier
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <CheckCircle2 className={`h-5 w-5 ${colorClasses.icon[color]} mt-0.5 mr-2 flex-shrink-0`} />
              ) : (
                <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{feature.name}</p>
                <p className={`text-sm ${feature.included ? "text-muted-foreground" : "text-gray-400"}`}>
                  {feature.value}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${colorClasses.button[color]}`} onClick={buttonAction} disabled={buttonDisabled}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
