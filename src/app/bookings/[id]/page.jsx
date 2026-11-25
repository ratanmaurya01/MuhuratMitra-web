
import BookingDetails from "./BookingDetails";

export const dynamic = "force-dynamic";

export default async function BookingDetailsPage({ params }) {
  const { id } = await params;

 
  return <BookingDetails id={id} />;
}