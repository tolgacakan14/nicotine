import type { Metadata } from "next";
import ClubView from "@/components/club/ClubView";

export const metadata: Metadata = {
  title: "NICOTINE CLUB",
  description:
    "The NICOTINE membership programme. Free to join, three tiers, one point per euro — early drop access, free shipping and a piece held for you each drop.",
};

export default function ClubPage() {
  return <ClubView />;
}
