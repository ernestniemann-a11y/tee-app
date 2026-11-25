import data from "../../data/opportunities.json";

export const TYPES = ["Career", "Volunteering", "Internship"] as const;
export type OpportunityType = (typeof TYPES)[number];

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  type: OpportunityType;
  /** "2027-03-15", or null for rolling. */
  deadline: string | null;
  grades: string;
  pay: string;
  location: string;
  url: string;
  sample: boolean;
}

export const opportunities = data as Opportunity[];

export function deadlineLabel(deadline: string | null): string {
  if (!deadline) return "Rolling";
  return new Date(`${deadline}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function findOpportunities(list: Opportunity[], type: OpportunityType | "All", query: string): Opportunity[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter((o) => {
    if (type !== "All" && o.type !== type) return false;
    const text = [o.title, o.org, o.type, o.grades, o.pay, o.location].join(" ").toLowerCase();
    return words.every((w) => text.includes(w));
  });
}
