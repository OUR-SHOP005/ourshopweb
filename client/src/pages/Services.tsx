
import { SERVICES } from "@/lib/constants";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <div className="container py-24">
      <h1 className="text-4xl font-bold mb-4">Our Services</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        We offer comprehensive web design and development solutions tailored to
        your business needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {SERVICES.map((service) => (
          <div key={service.title} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
            <p className="text-muted-foreground mb-4">{service.description}</p>
            <ul className="list-disc list-inside mb-6 space-y-2 text-muted-foreground">
              {service.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
            <p className="text-lg font-semibold text-primary">{service.pricing}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/contact">
          <Button size="lg" asChild>
            <a>
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Link>
      </div>
    </div>
  );
}
