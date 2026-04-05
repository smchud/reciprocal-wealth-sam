import HeaderB from "@/components/concept-b/HeaderB";
import FooterB from "@/components/concept-b/FooterB";

export default function ConceptBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderB />
      <main className="flex-1">{children}</main>
      <FooterB />
    </>
  );
}
