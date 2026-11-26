import BookingDetails from "./BookingDetails";

export default async function BookingDetailsPage({ params }) {
  const { id } = await params;
  return <BookingDetails id={id} />;

}