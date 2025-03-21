import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS } from "../lib/constants";
import ServiceCard from "../components/shared/ServiceCard";
import PortfolioGrid from "../components/shared/PortfolioGrid";
import TestimonialCarousel from "../components/shared/TestimonialCarousel";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              We Create Digital Experiences That Matter
            </h1>
            <p className="text-xl text-muted-foreground mt-6">
              Award-winning web design agency helping businesses succeed in the
              digital world through innovative design and development solutions.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="/contact">
                <Button size="lg" asChild>
                  <a>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" asChild>
                  <a>View Our Work</a>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Work</h2>
          <PortfolioGrid items={PORTFOLIO_ITEMS.slice(0, 3)} />
          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button size="lg" variant="outline" asChild>
                <a>View All Projects</a>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Clients Say
          </h2>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>
    </div>
  );
}