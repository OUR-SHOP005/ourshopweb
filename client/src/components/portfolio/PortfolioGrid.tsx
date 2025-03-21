import { useState } from "react";
import { PORTFOLIO_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type CategoryFilter = "all" | "E-Commerce" | "Web Design" | "Web Application" | "Web Development";

const PortfolioGrid = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const filteredItems = activeFilter === "all" 
    ? PORTFOLIO_ITEMS 
    : PORTFOLIO_ITEMS.filter(item => item.category === activeFilter);

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
          variant={activeFilter === "E-Commerce" ? "default" : "outline"}
          onClick={() => setActiveFilter("E-Commerce")}
          className={activeFilter === "E-Commerce" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          E-Commerce
        </Button>
        <Button
          variant={activeFilter === "Web Design" ? "default" : "outline"}
          onClick={() => setActiveFilter("Web Design")}
          className={activeFilter === "Web Design" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          Web Design
        </Button>
        <Button
          variant={activeFilter === "Web Application" ? "default" : "outline"}
          onClick={() => setActiveFilter("Web Application")}
          className={activeFilter === "Web Application" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          Web Application
        </Button>
        <Button
          variant={activeFilter === "Web Development" ? "default" : "outline"}
          onClick={() => setActiveFilter("Web Development")}
          className={activeFilter === "Web Development" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}
        >
          Web Development
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-md bg-white border border-gray-200"
            data-category={item.category}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="text-xs text-primary font-semibold mb-1 capitalize">
                {item.category}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGrid;
