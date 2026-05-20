import CarDetailsView from "@/app/components/CarDetailsView";

const CarDetailsPage = async ({ params }) => {
  const { id } = await params;

  return <CarDetailsView carId={id} />;
};

export default CarDetailsPage;
