import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { FeaturedProject } from "@/components/portfolio/featured-project";
import { EnvironmentGallery } from "@/components/portfolio/environment-gallery";
import { LevelDesign } from "@/components/portfolio/level-design";
import { Skills } from "@/components/portfolio/skills";
import { About } from "@/components/portfolio/about";
import { Journal } from "@/components/portfolio/journal";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <Hero />
        <FeaturedProject />
        <EnvironmentGallery />
        <LevelDesign />
        <Skills />
        <About />
        <Journal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
