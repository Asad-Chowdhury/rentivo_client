import CarDetailsView from "@/app/components/CarDetailsView";
import { demoCars } from "@/lib/demo-cars";

const CarDetailsPage = async ({ params }) => {
  const { id } = await params;
  const car = demoCars.find((item) => item.id === id);

  return <CarDetailsView car={car} />;
};

export default CarDetailsPage;
