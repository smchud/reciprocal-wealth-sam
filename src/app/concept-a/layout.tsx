import HeaderA from "@/components/concept-a/HeaderA";
import FooterA from "@/components/concept-a/FooterA";

export default function ConceptALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderA />
      <main className="flex-1">{children}</main>
      <FooterA />
    </>
  );
}
