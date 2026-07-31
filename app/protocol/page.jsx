import Protocol from "../../components/Protocol";

export const metadata = {
  title: "Protocol — Build an evidence-graded supplement stack | TNiC",
  description:
    "Answer nine questions and get a niche, safety-screened supplement stack, with every recommendation graded by how strong the human evidence really is.",
  alternates: { canonical: "/protocol" },
  openGraph: {
    title: "TNiC Protocol — an evidence-graded supplement stack",
    description:
      "Nine questions. A stack you can actually defend. Evidence-graded and screened against your medications.",
    url: "/protocol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TNiC Protocol — an evidence-graded supplement stack",
    description: "Nine questions. A stack you can actually defend.",
  },
};

export default function ProtocolPage() {
  return <Protocol />;
}
