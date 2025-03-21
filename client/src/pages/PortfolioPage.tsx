import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

const PortfolioPage = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Our Portfolio
        </h1>
        
        <PortfolioGrid />
      </div>
    </section>
  );
};

export default PortfolioPage;
