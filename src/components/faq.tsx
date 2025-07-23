"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Search, ChevronDown, ChevronRight, HelpCircle } from "lucide-react"

// FAQ data
const faqData = {
  faq: {
    title: "Frequently Asked Questions",
    description: "Everything you need to know about our post-purchase customer engagement and review funnel platform",
    lastUpdated: "2025-07-23",
    categories: [
      {
        id: "getting-started",
        title: "Getting Started",
        icon: "🚀",
        description: "Platform introduction and setup basics",
        questions: [
          {
            id: "what-is-platform",
            question: "What is your platform and who is it for?",
            answer:
              "We're a post-purchase customer engagement and review funnel platform designed specifically for e-commerce brands. Our platform combines email/SMS automation, review generation, and survey logic builders to help Amazon sellers, Shopify stores, WooCommerce sites, and DTC brands optimize their post-purchase customer experience and generate more authentic reviews.",
            tags: ["platform", "overview", "target-audience"],
          },
          {
            id: "supported-platforms",
            question: "Which e-commerce platforms do you support?",
            answer:
              "We primarily support Amazon sellers, Shopify stores, WooCommerce sites, and direct-to-consumer (DTC) brands. Our platform is designed with small to mid-sized e-commerce sellers in mind, though we also serve agencies managing multiple seller accounts and some enterprise brands.",
            tags: ["platforms", "compatibility", "integrations"],
          },
          {
            id: "getting-started-quickly",
            question: "How quickly can I get started?",
            answer:
              "You can get started for free with Reebews. Our free plan offers enough features for you to begin your review funnel journey. The basic setup takes just a few minutes - simply create your account, import your customer data, and choose between our Smart Funnels or Compliant Funnels. Enterprise plan users receive 1-on-1 onboarding support to ensure optimal setup.",
            tags: ["setup", "onboarding", "trial"],
          },
          {
            id: "technical-knowledge",
            question: "Do I need technical knowledge to use your platform?",
            answer:
              "No technical knowledge is required. Our platform is designed to be user-friendly with intuitive funnel builders and pre-built templates. However, if you want to use our REST API for advanced integrations, some technical knowledge would be helpful.",
            tags: ["ease-of-use", "technical", "api"],
          },
          {
            id: "smart-vs-compliant",
            question: "What's the difference between Smart Funnels and Compliant Funnels?",
            answer:
              "Smart Funnels use conditional logic and customer rating filtering (showing review links only to customers who rate 4-5 stars), while Compliant Funnels are Amazon-safe standard flows without gating or incentives. Choose Smart Funnels for non-Amazon platforms and Compliant Funnels for Amazon compliance.",
            tags: ["smart-funnels", "compliant-funnels", "amazon", "compliance"],
          },
        ],
      },
      {
        id: "features-functionality",
        title: "Features & Functionality",
        icon: "🛠️",
        description: "Detailed information about platform features and capabilities",
        questions: [
          {
            id: "smart-funnels-work",
            question: "How do Smart Funnels work?",
            answer:
              "Smart Funnels use conditional logic to filter customers based on their satisfaction ratings. For example, customers who rate their experience 4-5 stars are directed to leave public reviews, while those with lower ratings are routed to private feedback forms. This helps maintain higher public review ratings while capturing improvement opportunities.",
            tags: ["smart-funnels", "conditional-logic", "ratings"],
          },
          {
            id: "customize-email-templates",
            question: "Can I customize email templates?",
            answer:
              "Our Pro plan includes a feature called 'Branding Template' which handles white labeling through a form that incorporates your email customization based on the branding inputs you provide. For direct template customization, this feature is not available in our current plans.",
            tags: ["customization", "templates", "branding", "white-labeling"],
          },
          {
            id: "incentive-logic",
            question: "How does the incentive logic work?",
            answer:
              "Our incentive system allows you to offer coupons, discounts, or other rewards for completing surveys or specific actions. This feature is available for both Amazon and non-Amazon campaigns, however it's important that sellers use this feature wisely when creating Amazon-related campaigns. We recommend carefully choosing your review strategy and following marketplace guidelines when setting up campaigns.",
            tags: ["incentives", "rewards", "compliance", "non-amazon"],
          },
          {
            id: "qr-insert-tracking",
            question: "What is QR/Insert tracking?",
            answer:
              "We generate unique QR codes that you can include in product packaging inserts. When customers scan these codes, they're directed to your review funnel, and you can track which orders came through physical inserts versus email campaigns, providing valuable attribution data.",
            tags: ["qr-codes", "inserts", "tracking", "attribution"],
          },
          {
            id: "analytics-dashboard",
            question: "How detailed is the analytics dashboard?",
            answer:
              "Currently we provide basic analytics data across all our plans, including review performance, campaign performance, marketplace distribution, and reward redemption analysis. While we have promised advanced analytics features for our paid plans, these are still in development at the time this FAQ was written.",
            tags: ["analytics", "dashboard", "reporting", "insights"],
          },
          {
            id: "different-funnels-products",
            question: "Can I create different funnels for different products?",
            answer:
              "Yes, you can create different funnels for different products, but this is subject to tier limitations. Please view our pricing page to learn about the specific limitations for each plan.",
            tags: ["funnels", "products", "segmentation", "customization"],
          },
        ],
      },
      {
        id: "amazon-compliance",
        title: "Amazon Compliance",
        icon: "🛡️",
        description: "Understanding Amazon's review policies and staying compliant",
        questions: [
          {
            id: "ensure-amazon-compliance",
            question: "How do you ensure Amazon compliance?",
            answer:
              "We offer dedicated Compliant Mode funnels that strictly adhere to Amazon's review policies. These funnels don't use rating gates, incentives, or any tactics that could violate Amazon's Terms of Service. We stay updated on Amazon's policy changes and adjust our platform accordingly. As long as you follow our guidelines, you should be fine. However, if you choose to experiment with settings on your own, we cannot be held responsible for any outcomes. While we implement best practices, please note that in the unlikely event your account faces suspension issues during the normal use of our recommended practices, we cannot be held liable for such circumstances.",
            tags: ["amazon", "compliance", "policies", "compliant-mode"],
          },
          {
            id: "amazon-compliant-funnel",
            question: 'What makes a funnel "Amazon compliant"?',
            answer:
              "Amazon-compliant funnels request reviews from all customers equally, don't offer incentives for reviews, don't gate review requests based on ratings, and use neutral language that doesn't bias customer responses. Our Compliant Mode automatically enforces these rules.",
            tags: ["amazon", "compliance", "neutral-language", "equal-treatment"],
          },
          {
            id: "incentives-amazon",
            question: "Can I use incentives for Amazon customers?",
            answer:
              "No, offering incentives in exchange for reviews is against Amazon's policies. However, the feature is technically available in our platform, but it's entirely your choice and responsibility to use it at your own risk when dealing with Amazon campaigns.",
            tags: ["incentives", "amazon", "policies", "restrictions"],
          },
          {
            id: "amazon-suspension-risk",
            question: "Will using your platform get my Amazon account suspended?",
            answer:
              "When using our Compliant Mode, the risk is minimal as we strictly follow Amazon's review policies. However, Amazon's policies can change, and ultimately sellers are responsible for ensuring their practices comply with current Amazon Terms of Service.",
            tags: ["amazon", "suspension", "risk", "responsibility"],
          },
        ],
      },
      {
        id: "pricing-plans",
        title: "Pricing & Plans",
        icon: "💰",
        description: "Information about pricing tiers and plan features",
        questions: [
          {
            id: "pricing-plans-offered",
            question: "What pricing plans do you offer?",
            answer:
              "We offer four tiers: Free Plan (limited reviews & products), Basic Plan (unlimited reviews, free), Pro Plan (includes white-labeling and custom templates), and Enterprise (adds custom domain and 1-on-1 onboarding).",
            tags: ["pricing", "plans", "tiers", "features"],
          },
          {
            id: "free-plan",
            question: "Is there really a free plan?",
            answer:
              "Yes, our free plan is free to use forever, but comes with limits on adding marketplaces, products, promotions, and campaigns. Additional credits for reviews and products are available for purchase through our admin dashboard.",
            tags: ["free-plan", "basic-plan", "unlimited", "accessibility"],
          },
          {
            id: "white-labeling-included",
            question: "What's included in white-labeling?",
            answer:
              "For our Pro plan, we offer a feature called 'Branding Template' that controls how your customers view and interact with forms. Based on the branding details you provide, we apply the same template to our automated emails when sending incentives to buyers, ensuring consistent brand experience.",
            tags: ["white-labeling", "branding", "customization", "pro-plan"],
          },
        ],
      },
      {
        id: "technical-integrations",
        title: "Technical & Integrations",
        icon: "⚙️",
        description: "API access, data handling, and technical specifications",
        questions: [
          {
            id: "api-access",
            question: "Do you offer API access?",
            answer:
              "Yes, we provide a REST API for order synchronization, funnel data retrieval, and webhook notifications. This allows for custom integrations and automated workflows with your existing e-commerce stack.",
            tags: ["api", "rest", "integrations", "webhooks"],
          },
          {
            id: "import-customer-data",
            question: "How do I import customer data?",
            answer:
              "You can import customer data through CSV uploads, our API, or manual entry. We support standard e-commerce data formats and provide templates to ensure proper data mapping and import success.",
            tags: ["data-import", "csv", "api", "templates"],
          },
          {
            id: "webhooks-work",
            question: "How do webhooks work?",
            answer:
              "Currently we are not offering webhooks as they are still in beta testing. This feature will be made available in future updates to our platform.",
            tags: ["webhooks", "real-time", "notifications", "crm"],
          },
        ],
      },
      {
        id: "security-privacy",
        title: "Security & Privacy",
        icon: "🔒",
        description: "Data protection, compliance, and security measures",
        questions: [
          {
            id: "protect-customer-data",
            question: "How do you protect customer data?",
            answer:
              "All data is encrypted in transit using TLS and at rest using AES-256 encryption. We use secure third-party authentication through Clerk and never store sensitive information like Amazon credentials or payment data.",
            tags: ["data-protection", "encryption", "authentication", "security"],
          },
          {
            id: "gdpr-compliant",
            question: "Are you GDPR compliant?",
            answer:
              "Yes, we fully comply with GDPR requirements including data handling transparency, right to erasure, data portability, and consent management. European customers have full control over their personal data through our platform.",
            tags: ["gdpr", "compliance", "data-rights", "privacy"],
          },
        ],
      },
    ],
  },
}

// Minimal highlight function
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-accent text-accent-foreground px-0.5 rounded-sm">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return faqData.faq.categories
    }

    const searchLower = searchTerm.toLowerCase()

    return faqData.faq.categories
      .map((category) => ({
        ...category,
        questions: category.questions.filter((question) => {
          const questionMatch = question.question.toLowerCase().includes(searchLower)
          const answerMatch = question.answer.toLowerCase().includes(searchLower)
          const tagMatch = question.tags.some((tag) => tag.toLowerCase().includes(searchLower))

          return questionMatch || answerMatch || tagMatch
        }),
      }))
      .filter((category) => category.questions.length > 0)
  }, [searchTerm])

  // Auto-expand categories and questions when searching
  useMemo(() => {
    if (searchTerm.trim()) {
      const categoryIds = filteredData.map((cat) => cat.id)
      const questionIds = filteredData.flatMap((cat) => cat.questions.map((q) => q.id))

      setOpenCategories(categoryIds)
      setOpenQuestions(questionIds)
    } else {
      setOpenCategories([])
      setOpenQuestions([])
    }
  }, [searchTerm, filteredData])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  const totalResults = filteredData.reduce((sum, category) => sum + category.questions.length, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              <HelpCircle className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">{faqData.faq.title}</h1>
              <p className="text-muted-foreground text-lg">{faqData.faq.description}</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {searchTerm && (
              <p className="text-sm text-muted-foreground">
                {totalResults} result{totalResults !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {filteredData.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">Try searching with different keywords or browse our categories.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredData.map((category, categoryIndex) => (
                <div key={category.id}>
                  <Collapsible
                    open={openCategories.includes(category.id)}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/50 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <div>
                          <h2 className="font-medium">{highlightText(category.title, searchTerm)}</h2>
                          <p className="text-sm text-muted-foreground">
                            {highlightText(category.description, searchTerm)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {category.questions.length}
                        </Badge>
                        {openCategories.includes(category.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        )}
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="px-4 pb-4">
                      <div className="space-y-3 mt-3">
                        {category.questions.map((question, questionIndex) => (
                          <div key={question.id}>
                            <Collapsible
                              open={openQuestions.includes(question.id)}
                              onOpenChange={() => toggleQuestion(question.id)}
                            >
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/30 rounded-md transition-colors group">
                                <h3 className="font-medium text-sm pr-4">
                                  {highlightText(question.question, searchTerm)}
                                </h3>
                                {openQuestions.includes(question.id) ? (
                                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                                )}
                              </CollapsibleTrigger>

                              <CollapsibleContent className="px-3 pb-3">
                                <div className="pt-2 space-y-3">
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {highlightText(question.answer, searchTerm)}
                                  </p>

                                  {question.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {question.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs h-5 px-2">
                                          {highlightText(tag, searchTerm)}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            {questionIndex < category.questions.length - 1 && <Separator className="my-3 ml-3" />}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {categoryIndex < filteredData.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}