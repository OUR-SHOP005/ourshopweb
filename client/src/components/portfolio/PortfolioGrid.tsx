import { useState } from "react";
import { portfolioItems } from "@/lib/data";
import { Button } from "@/components/ui/button";

type CategoryFilter = "all" | "e-commerce" | "web-design" | "web-application" | "web-development";

const PortfolioGrid = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <div>
      {/* Portfolio Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          className={activeFilter === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "e-commerce" ? "default" : "outline"}
          onClick={() => setActiveFilter("e-commerce")}
          className={activeFilter === "e-commerce" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          E-Commerce
        </Button>
        <Button
          variant={activeFilter === "web-design" ? "default" : "outline"}
          onClick={() => setActiveFilter("web-design")}
          className={activeFilter === "web-design" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          Web Design
        </Button>
        <Button
          variant={activeFilter === "web-application" ? "default" : "outline"}
          onClick={() => setActiveFilter("web-application")}
          className={activeFilter === "web-application" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          Web Application
        </Button>
        <Button
          variant={activeFilter === "web-development" ? "default" : "outline"}
          onClick={() => setActiveFilter("web-development")}
          className={activeFilter === "web-development" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          Web Development
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-lg overflow-hidden shadow-md bg-white"
            data-category={item.category}
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
    </div>
  );
};

export default PortfolioGrid;
