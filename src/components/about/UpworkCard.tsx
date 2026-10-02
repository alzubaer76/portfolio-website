import { ArrowUpRight, Award } from "lucide-react";
import { site } from "@/content/site";
import { UpworkIcon } from "@/components/ui/BrandIcons";

export function UpworkCard() {
  const { upwork } = site.about;
  const stats = [
    { label: "Job Success", value: upwork.jobSuccess },
    { label: "Total jobs", value: upwork.totalJobs },
    { label: "Hours worked", value: upwork.hoursWorked },
  ];
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-semibold">
          <UpworkIcon className="size-5 text-success" />
          Upwork profile
        </p>
        <p className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-sm font-medium text-success">
          <Award aria-hidden="true" className="size-4" />
          {upwork.badge}
        </p>
      </div>
      <dl className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <dt className="text-xs text-text-muted sm:text-sm">{s.label}</dt>
            <dd className="text-metric order-first text-2xl sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>
      <a
        href={upwork.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-text underline-offset-4 hover:underline"
      >
        View Upwork profile <ArrowUpRight aria-hidden="true" className="size-4" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
