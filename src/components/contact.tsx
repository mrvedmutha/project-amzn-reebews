"use client"

import type React from "react"
import { useState, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react"
import { IContactFormData, IContactFormErrors, IContactSubmissionRequest, IContactSubmissionResponse } from "@/types/contact/contact.types"

export function Contact() {
  const [formData, setFormData] = useState<IContactFormData>({
    fullName: "",
    email: "",
    userType: "",
    query: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<IContactFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const updateFormData = (field: keyof IContactFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: IContactFormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = "Full name must be less than 100 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.userType) {
      newErrors.userType = "Please select if you're a buyer or seller"
    }

    if (!formData.query.trim()) {
      newErrors.query = "Please enter your query"
    } else if (formData.query.trim().length < 10) {
      newErrors.query = "Query must be at least 10 characters long"
    } else if (formData.query.length > 500) {
      newErrors.query = "Query must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Get reCAPTCHA token
    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setSubmitError("Please complete the reCAPTCHA verification")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const submissionData: IContactSubmissionRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        userType: formData.userType as "buyer" | "seller",
        query: formData.query.trim(),
        recaptchaToken,
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_REEBEWS_API_KEY || "",
        },
        body: JSON.stringify(submissionData),
      })

      const result: IContactSubmissionResponse = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        // Reset reCAPTCHA
        recaptchaRef.current?.reset()
      } else {
        setSubmitError(result.message || "Failed to submit contact form. Please try again.")
        // Reset reCAPTCHA on error
        recaptchaRef.current?.reset()
      }
    } catch (error) {
      console.error("Error submitting contact form:", error)
      setSubmitError("An error occurred while submitting your message. Please try again.")
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      userType: "",
      query: "",
    })
    setErrors({})
    setIsSubmitted(false)
    setSubmitError(null)
    recaptchaRef.current?.reset()
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-16 pb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/50 mb-8">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-semibold mb-4">Message Sent Successfully!</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Thank you for contacting us. We've received your message and will get back to you within 24 hours.
                </p>
                <div className="space-y-3">
                  <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto bg-transparent">
                    Send Another Message
                  </Button>
                  <div className="text-center">
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/faq">Browse FAQ instead</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              <Mail className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
              <p className="text-muted-foreground text-lg">Have a question or need help? We're here to assist you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-destructive" : ""}
                    maxLength={100}
                  />
                  {errors.fullName && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* User Type */}
                <div className="space-y-3">
                  <Label>
                    I am a <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value) => updateFormData("userType", value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buyer" id="buyer" />
                      <Label htmlFor="buyer" className="font-normal">
                        Buyer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seller" id="seller" />
                      <Label htmlFor="seller" className="font-normal">
                        Seller
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.userType && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {errors.userType}
                    </div>
                  )}
                </div>

                {/* Query */}
                <div className="space-y-2">
                  <Label htmlFor="query">
                    Your Query <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="query"
                    value={formData.query}
                    onChange={(e) => updateFormData("query", e.target.value)}
                    placeholder="Please describe your question or issue in detail..."
                    rows={5}
                    maxLength={500}
                    className={errors.query ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between items-center text-xs">
                    {errors.query ? (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        {errors.query}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Minimum 10 characters</span>
                    )}
                    <span className="text-muted-foreground">{formData.query.length}/500</span>
                  </div>
                </div>

                {/* reCAPTCHA */}
                <div className="space-y-2">
                  <Label>Security Verification <span className="text-destructive">*</span></Label>
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V2_SITE || ""}
                      theme="light"
                    />
                  </div>
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                    Site Managed By
                  </h3>
                  <p className="font-medium">The Cybershop India</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                    Response Time
                  </h3>
                  <p className="text-sm">Within 24 hours</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">Address</h3>
                <address className="text-sm text-muted-foreground not-italic leading-relaxed">
                  No: 4/7, Venkataryan Lane,
                  <br />
                  ParkTown, Chennai - 600 017
                  <br />
                  (Tamil Nadu), India
                </address>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/50">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Need immediate help?</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Check our FAQ section for instant answers to common questions.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/faq">Browse FAQ →</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}