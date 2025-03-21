import Hero from "@/components/home/Hero";
import ServicesOverview from "@/components/home/ServicesOverview";
import FeaturedWork from "@/components/home/FeaturedWork";
import Testimonials from "@/components/home/Testimonials";

const HomePage = () => {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedWork />
      <Testimonials />
    </>
  );
};

export default HomePage;
