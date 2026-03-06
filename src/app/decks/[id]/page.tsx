import DeckPage from "./DeckPage";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <DeckPage params={params} />;
}
