"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  User,
  Target,
  Lightbulb,
  Code,
  Users,
  ArrowRight,
  Star,
  ShoppingCart,
  Zap,
  Shield,
  QrCode,
  Gift,
} from "lucide-react"

export function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                About Reebews
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">From Seller Struggles to SaaS Solutions</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Hi, I'm <span className="font-semibold text-foreground">Shreyans Jain</span>, and like many of you
                reading this, I've been in the trenches of e-commerce for over 4 years. I've experienced firsthand the
                frustration that every seller knows too well: watching competitors rack up hundreds of reviews while
                struggling to get even one review per month on my own products.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* The Problem Section - Fixed alignment */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20">
                <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-3xl font-semibold">The Problem I Lived Every Day</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed mb-6">
                    During my e-commerce journey, I discovered that reviews aren't just nice-to-have social
                    proof—they're the <strong>lifeblood of product visibility and conversion rates</strong>. Without
                    them, even great products get buried in search results.
                  </p>

                  <p className="mb-6">
                    I tried everything to collect customer feedback: Microsoft Forms, Google Forms, manual outreach—you
                    name it. While these tools technically worked, they came with major problems:
                  </p>

                  {/* Fixed alignment - Single column with proper bullet alignment */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0"></div>
                      <p className="text-sm">Irrelevant data that didn't help improve my products</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0"></div>
                      <p className="text-sm">Incorrect customer details that made follow-up impossible</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0"></div>
                      <p className="text-sm">Generic feedback that wasn't specific to purchased products</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0"></div>
                      <p className="text-sm">Low response rates due to disconnected buying experience</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      The reality hit me hard: Unless you incentivize buyers, most won't make the effort to write
                      reviews—unless your product is truly exceptional or they're naturally inclined to help others
                      through their feedback.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* The Gap Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/20">
                <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-3xl font-semibold">The Gap That Inspired Everything</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">I noticed a massive disconnect in the e-commerce ecosystem:</p>

                  <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-l-primary">
                    <p className="font-medium">
                      Small businesses struggle to get even 1 review per month, while competitors somehow generate
                      hundreds.
                    </p>
                  </div>

                  <p>
                    When you're selling primarily on marketplaces rather than your own website, you're at a huge
                    disadvantage. These platforms provide limited resources for sellers to gather feedback and connect
                    meaningfully with their customers.
                  </p>

                  <p>
                    For entrepreneurs testing new products or just starting out, this creates an almost impossible
                    barrier:
                    <strong>
                      {" "}
                      How do you reach your potential customers when the platform controls the relationship?
                    </strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Solution Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/20">
                <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-semibold">From Problem to Solution</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    A few months ago, I decided to take control of my situation. I dove into learning full-stack
                    development with one clear mission: <strong>solve the review generation problem</strong> that had
                    been holding back my business and countless others.
                  </p>

                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full">
                      <Star className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">That's how Reebews was born</span>
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      My first SaaS product, built by a seller, for sellers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* What Makes Different Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-semibold">What Makes Reebews Different</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    Reebews isn't just another review collection tool built by developers who've never sold a product
                    online. It's built from <strong>4+ years of real selling experience</strong> and understanding
                    exactly what doesn't work with traditional solutions.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <ShoppingCart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">Direct Customer Connection</p>
                          <p className="text-xs text-muted-foreground">
                            Connect with customers even on third-party platforms
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">Marketplace Compliant</p>
                          <p className="text-xs text-muted-foreground">
                            Stay compliant while maximizing review potential
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">Smart Conditional Funnels</p>
                          <p className="text-xs text-muted-foreground">
                            Effortless review writing through intelligent flows
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">Product-Specific Feedback</p>
                          <p className="text-xs text-muted-foreground">
                            Meaningful feedback loops beyond generic forms
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* One Person Mission */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/20">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-3xl font-semibold">The One-Person Mission</h2>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    Right now, I'm a one-person team, which means{" "}
                    <strong>every feature you see was built with the direct experience</strong> of someone who has faced
                    the same challenges you're dealing with.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">No corporate bureaucracy—just a fellow seller</span>
                  </div>

                  <p className="text-muted-foreground">
                    There's no corporate bureaucracy here—just a fellow seller who understands your struggles because
                    I've lived them.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Why I Built This */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-semibold">Why I Built This for You</h2>
              <p className="text-muted-foreground">
                Every feature in Reebews comes from a real frustration I faced as a seller:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Smart Funnels</h3>
                      <p className="text-sm text-muted-foreground">
                        Because I was tired of negative reviews going public before I could address issues
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Compliance Modes</h3>
                      <p className="text-sm text-muted-foreground">
                        Because I learned the hard way about marketplace policy violations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">QR Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Because I wanted to know which outreach methods actually worked
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Incentive Logic</h3>
                      <p className="text-sm text-muted-foreground">
                        Because I discovered customers need that extra push to leave feedback
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Call to Action - Updated buttons */}
          <section className="text-center space-y-8 py-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Ready to Bridge the Review Gap?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                This isn't just software—it's a solution built by someone who has walked in your shoes. Join me on this
                journey, and let's turn your review struggles into review success.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="https://reebews.com/checkout?plan=free">
                  Start Your Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="https://reebews.com/#features">
                  Learn About Features
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">No credit card required • Built by a seller, for sellers</p>
          </section>
        </div>
      </div>
    </div>
  )
}