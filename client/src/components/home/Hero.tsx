import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            We Create Digital Experiences That Matter
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Award-winning web design agency helping businesses succeed in the digital world
            through innovative design and development solutions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="inline-flex items-center px-5 py-3 shadow-sm"
            >
              <Link href="/services">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="inline-flex items-center px-5 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <Link href="/portfolio">
                View Our Work
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
