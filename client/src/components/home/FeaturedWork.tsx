import { useState } from "react";
import { Link } from "wouter";
import { portfolioItems } from "@/lib/data";
import { 
  Card, 
  CardContent, 
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Take only the first 3 items for the featured section
const featuredPortfolioItems = portfolioItems.slice(0, 3);

const FeaturedWork = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Featured Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPortfolioItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg overflow-hidden shadow-md bg-white"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="text-xs text-primary font-semibold mb-1 capitalize">
                  {item.category.replace("-", " ")}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
              <div className="absolute inset-0 bg-primary bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href="#"
                  className="text-white bg-transparent border-2 border-white hover:bg-white hover:text-primary px-4 py-2 rounded-md transition-all"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            asChild
            className="inline-flex items-center px-5 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <Link href="/portfolio">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
