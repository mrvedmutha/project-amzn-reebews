import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex-1 bg-background">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                <BookOpen className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
                <p className="text-muted-foreground text-lg">
                  Insights, tips, and updates from the Reebews team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-16 pb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/50 mb-8">
                  <Bell className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
                
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  We're working on creating valuable content about review management, 
                  e-commerce best practices, and platform updates. Stay tuned for 
                  insightful articles that will help grow your business.
                </p>

                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    In the meantime, explore our other resources:
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" asChild>
                      <Link href="/faq">Browse FAQ</Link>
                    </Button>
                    
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                  
                  <div className="pt-6">
                    <Button variant="ghost" asChild>
                      <Link href="/" className="inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}