import HomeAvailableCars from "@/app/components/HomeAvailableCars";
import HomeFeatureGrid from "@/app/components/HomeFeatureGrid";
import HomeHero from "@/app/components/HomeHero";
import HomeWorkflow from "@/app/components/HomeWorkflow";
import { demoCars } from "@/lib/demo-cars";

export default function Home() {
  return (
    <div className="bg-base-100 text-base-content">
      <HomeHero />
      <HomeAvailableCars cars={demoCars} />
      <HomeFeatureGrid />
      <HomeWorkflow />
    </div>
  );
}
