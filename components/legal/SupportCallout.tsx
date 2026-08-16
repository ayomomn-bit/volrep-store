import type { ReactNode } from "react";

type SupportCalloutProps = {
  children: ReactNode;
};

// Reused at the bottom of every legal page as the "still have questions"
// handoff to support — same rounded/bg-muted card language as the footer's
// trust-badges panel.
export function SupportCallout({ children }: SupportCalloutProps) {
  return (
    <div className="rounded-2xl bg-muted px-6 py-7 sm:px-8 sm:py-8">
      <p className="text-[15px] leading-relaxed text-foreground sm:text-base">
        {children}{" "}
        <a
          href="mailto:support@volrep.com"
          className="font-semibold text-foreground underline decoration-volt decoration-2 underline-offset-4 transition-colors duration-300 ease-out hover:text-volt"
        >
          support@volrep.com
        </a>
      </p>
    </div>
  );
}
