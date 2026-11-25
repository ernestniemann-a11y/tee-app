import { useState } from "react";
import { Chip, darkButton, PageTitle } from "../../components/ui";
import { deadlineLabel, findOpportunities, opportunities, TYPES, type Opportunity, type OpportunityType } from "./opportunities";

export function ExplorePage() {
  const [type, setType] = useState<OpportunityType | "All">("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(opportunities[0]?.id ?? null);
  const found = findOpportunities(opportunities, type, query);

  return (
    <main className="flex flex-1 flex-col gap-5 px-6 pt-5 pb-10 md:px-10">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
        <PageTitle tab="Explore">Explore</PageTitle>
        <input
          type="search"
          aria-label="Search opportunities"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="h-[54px] min-w-0 flex-[1_1_240px] rounded-lg border-2 border-edge bg-panel px-4 text-[19px] font-bold"
        />
        <div role="group" aria-label="Type" className="flex flex-wrap gap-2.5">
          {(["All", ...TYPES] as const).map((t) => (
            <Chip key={t} on={t === type} onClick={() => setType(t)} className="min-h-[54px] text-lg">
              {t}
            </Chip>
          ))}
        </div>
      </div>
      <p role="status" className={found.length ? "sr-only" : "py-5 text-[22px] font-bold"}>
        {found.length ? `${found.length} found` : "No matches. Try another word."}
      </p>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-start gap-3.5">
        {found.map((o) => (
          <Card key={o.id} item={o} open={o.id === open} onToggle={() => setOpen(o.id === open ? null : o.id)} />
        ))}
      </ul>
    </main>
  );
}

function Card({ item, open, onToggle }: { item: Opportunity; open: boolean; onToggle: () => void }) {
  return (
    <li className={`rounded-[14px] border-2 ${open ? "lit border-lamp bg-lamp text-ground" : "border-edge bg-panel hover:border-white"}`}>
      <button type="button" aria-expanded={open} onClick={onToggle} className="flex min-h-[88px] w-full items-center justify-between gap-4 rounded-[14px] px-6 py-3.5 text-left text-[17px]">
        <span className="flex flex-col gap-1">
          <span className="text-[23px] leading-tight font-bold">{item.title}</span>
          <span>{item.org}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[19px] font-bold">{deadlineLabel(item.deadline)}</span>
          <span>
            {item.type}
            {item.sample && ", sample"}
          </span>
        </span>
      </button>
      {open && (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5 px-6 pb-6">
          <p className="flex-[1_1_200px] text-[19px]">
            {item.grades}, {item.pay.toLowerCase()}, {item.location.toLowerCase()}
          </p>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={`${darkButton} min-h-[58px] text-xl`}>
            Learn more
            <span className="sr-only"> about {item.title} (opens in a new tab)</span>
          </a>
        </div>
      )}
    </li>
  );
}
