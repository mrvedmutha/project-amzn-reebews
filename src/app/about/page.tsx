import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { About } from "@/components/about";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <About />
      <Footer />
    </main>
  );
}