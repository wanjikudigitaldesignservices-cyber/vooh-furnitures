import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BranchShowcase from "@/components/home/BranchShowcase";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <BranchShowcase />
      <Testimonials />
      <Newsletter />
    </>
  );
}
