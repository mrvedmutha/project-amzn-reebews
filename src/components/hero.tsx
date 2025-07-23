"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Hero() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which image to use based on theme
  const getHeroImage = () => {
    if (!mounted) return "/uploads/images/hero-image-light.png"; // Default fallback
    
    const currentTheme = resolvedTheme || theme;
    return currentTheme === "dark" 
      ? "/uploads/images/hero-image-dark.png" 
      : "/uploads/images/hero-image-light.png";
  };

  return (
    <div className="w-full py-12 md:py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold">
                Smart
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-yellow-500">Review Funnels</span>
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold">
                Smart Sellers
              </h1>
            </div>
            <p className="text-lg max-w-md mx-auto md:mx-0">
              Reebews empowers small businesses to gather honest reviews, 
              reward real customers, and boost visibility across 
              Amazon, Shopify, and more — all while staying platform-compliant.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link href="#pricing">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative h-72 md:h-96 mt-8 md:mt-0">
            {mounted ? (
              <Image
                src={getHeroImage()}
                alt="Reebews Platform"
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  document.getElementById("image-fallback")!.style.display = "block";
                }}
              />
            ) : (
              <Skeleton className="w-full h-full rounded-lg" />
            )}
            <div
              id="image-fallback"
              style={{ display: "none" }}
              className="w-full h-full"
            >
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
