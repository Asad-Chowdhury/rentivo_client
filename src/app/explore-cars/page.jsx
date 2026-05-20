import ExploreCarsClient from "@/app/components/ExploreCarsClient";
import { carTypes, demoCars } from "@/lib/demo-cars";

const ExploreCars = () => {
  return <ExploreCarsClient cars={demoCars} carTypes={carTypes} />;
};

export default ExploreCars;
