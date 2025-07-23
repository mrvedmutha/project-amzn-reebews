import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FAQ } from "@/components/faq";

export default function FAQPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <FAQ />
      <Footer />
    </main>
  );
}