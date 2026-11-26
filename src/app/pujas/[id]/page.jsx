import PujaDetail from "./PujaDetail";

export default async function PujaDetailPage({ params }) {
  const { id } = await params;
  return <PujaDetail id={id} />;
}
