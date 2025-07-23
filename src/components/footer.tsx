"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/uploads/logo/reebews-logo-dark.svg" 
    : "/uploads/logo/reebews-logo-light.svg";

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Comparison", href: "#comparison" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Refund Policy", href: "/refund" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="w-full bg-background">
      <div className="w-full py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-1 sm:col-span-2">
              <Link href="/" className="flex items-center mb-4">
                {mounted && (
                  <Image
                    src={logoSrc}
                    alt="Reebews Logo"
                    width={240}
                    height={48}
                    priority
                  />
                )}
              </Link>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Empowering businesses to build trust and credibility through our smart funnel system, guaranteeing positive customer reviews and sustainable growth.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={link.name}
                  >
                    <link.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerLinks.map((group) => (
                <div key={group.title} className="space-y-4">
                  <h3 className="text-sm font-semibold">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Reebews. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="mailto:contact@reebews.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                <span>contact@reebews.com</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
