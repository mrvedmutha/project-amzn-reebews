"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { QrCode, Gift, UserCheck, MessageCircle, Truck } from "lucide-react";

export function Features() {
  return (
    <div id="features" className="w-full py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-3xl font-bold text-center uppercase">
            <span className="text-yellow-500">Engage</span> Smarter,{" "}
            <span className="text-yellow-500">Review</span> Better
          </h1>
          <h2 className="text-center text-lg">
            Turn Every Package into a Review-Generating Opportunity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="group hover:bg-yellow-500 hover:text-black transition-colors">
            <CardHeader className="flex flex-row items-start gap-4">
              <QrCode className="h-8 w-8 group-hover:text-black" />
              <div className="space-y-4">
                <CardTitle className="group-hover:text-black">
                  Step 1: Set Up a Review or Feedback Campaign
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p className="mb-4">
                    Craft a campaign that fits your brand and goals. 
                    Whether you're collecting feedback, offering product support, or delivering bonuses,
                    Reebews gives you full control. 
                  </p>
                  <p className="mb-4">
                    What you can offer:
                  </p>
                  <ul className="space-y-2">
                    <li>- Helpful extras like extended warranties or how-to guides</li>
                    <li>- Bonus content like eBooks or downloadable resources</li>
                    <li>
                      - Discount codes or store credit
                    </li>
                    <li>- Feedback-only options to collect emails and insights</li>
                  </ul>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="group hover:bg-yellow-500 hover:text-black transition-colors">
            <CardHeader className="flex flex-row items-start gap-4">
              <Gift className="h-8 w-8 group-hover:text-black" />
              <div className="space-y-4">
                <CardTitle className="group-hover:text-black">
                  Step 2: Add a QR Code to Your Product Inserts
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p className="mb-4">
                    Make every package a touchpoint. 
                    Automatically generate a unique QR code for each campaign to include 
                    on your packaging, inserts, or thank-you cards.
                  </p>
                  <p className="mb-4">
                    Highlights:
                  </p>
                  <ul className="space-y-2">
                    <li>- Frictionless Call-to-Action for your customers</li>
                    <li>- Printable, high-resolution QR code files</li>
                    <li>- Boost post-purchase engagement</li>
                  </ul>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="group hover:bg-yellow-500 hover:text-black transition-colors">
            <CardHeader className="flex flex-row items-start gap-4">
              <UserCheck className="h-8 w-8 group-hover:text-black" />
              <div className="space-y-4">
                <CardTitle className="group-hover:text-black">
                  Step 3: Your Customers Scan & Enter the Funnel
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p>
                    When customers scan the QR code, 
                    they&apos;re guided through a branded experience where they can leave feedback 
                    and receive your offer (if provided).
                  </p>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="group hover:bg-yellow-500 hover:text-black transition-colors">
            <CardHeader className="flex flex-row items-start gap-4">
              <MessageCircle className="h-8 w-8 group-hover:text-black" />
              <div className="space-y-4">
                <CardTitle className="group-hover:text-black">
                  Step 4: Collect Feedback, Reviews & Insights
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p>
                    Based on your campaign setup, you&apos;ll capture honest reviews on Amazon, Shopify, or your platform, customer feedback and insights, and email addresses for future marketing.
                  </p>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="group hover:bg-yellow-500 hover:text-black transition-colors">
            <CardHeader className="flex flex-row items-start gap-4">
              <Truck className="h-8 w-8 group-hover:text-black" />
              <div className="space-y-4">
                <CardTitle className="group-hover:text-black">
                  Deliver Your Promotion to Your Customers
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p>
                    You can choose to have our smart funnel automatically
                    deliver your digital promotions to your customer as soon as
                    they complete the funnel or you can manually verify,
                    approve, and deliver your promotion.
                  </p>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
