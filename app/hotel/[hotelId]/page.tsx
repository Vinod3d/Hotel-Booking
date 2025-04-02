import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs/server";

interface HotelPageProps {
  params: {
    hotelId: string;
  };
}

const Hotel = async ({ params }: HotelPageProps) => {
  const {hotelId} = await params;
  const { userId } = await auth();
  if (!userId) return <div>Not authenticated...</div>;

  const hotel = await getHotelById(hotelId);

  // if (!hotel) return <div>Hotel not found...</div>;
  if (hotel && hotel.userId !== userId) return <div>Access denied...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Edit Hotel</h2>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default Hotel;
