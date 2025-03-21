import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceItem } from "@/lib/data";

interface ServiceCardProps {
  service: ServiceItem;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card id={service.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <CardContent className="p-0">
        <div className="flex items-start mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
            {service.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {service.title}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            What's Included:
          </h4>
          <ul className="space-y-2">
            {service.includedItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-gray-800 font-semibold mb-6">
          Starting from ${service.startingPrice.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
