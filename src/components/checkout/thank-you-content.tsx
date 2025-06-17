"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThankYouContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-8 bg-card rounded-lg border shadow-lg text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-3">
          Thank You for Your Purchase!
        </h1>

        <p className="text-muted-foreground mb-6">
          We have received your order and are processing it now. You will
          receive an email with instructions to complete your signup process.
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">What's Next?</h3>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">1.</span>
                <span>Check your email for signup instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">2.</span>
                <span>Set up your first review campaign</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">3.</span>
                <span>Generate and download your QR codes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">4.</span>
                <span>Start collecting authentic reviews!</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
