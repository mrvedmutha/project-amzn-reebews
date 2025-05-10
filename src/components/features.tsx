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
                  Choose Your Campaign Strategy
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p className="mb-4">
                    With our highly customizable smart funnel, you can offer
                    your customers several promotional offers with their product
                    purchase.
                  </p>
                  <ul className="space-y-2">
                    <li>- Free Gift</li>
                    <li>- Physical Gift or Digital Card or Coupon</li>
                    <li>
                      - Downloadable Content such as instructions, eBook, or
                      Extended Warranty
                    </li>
                    <li>- Collect email address only</li>
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
                  Add Your Unique QR Code to Your Product Inserts
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p className="mb-4">
                    Supercharge your product inserts marketing effectiveness by
                    adding your unique promotion QR Code to lead your customers
                    into our smart funnel
                  </p>
                  <ul className="space-y-2">
                    <li>- Make your product inserts to do more for you</li>
                    <li>- Frictionless Call-to-Action for your customers</li>
                    <li>- QR Codes are automatically generated</li>
                    <li>- Easily download and print your QR Codes</li>
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
                  Your Customers Scan Your QR Code to Enter Your Smart Funnel
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p>
                    With our highly customizable smart funnel, you can offer
                    your customers several promotional offers with their product
                    purchase.
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
                  Collect Customer Feedback, Reviews and Emails
                </CardTitle>
                <CardDescription className="group-hover:text-black">
                  <p>
                    Based on your settings, our smart funnel will offer your
                    customers your free promotion while collecting their email
                    and product review, or if you choose not to offer a free
                    promotion, only collect their email and feedback
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
