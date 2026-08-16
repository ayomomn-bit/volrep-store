import { Container } from "@/components/layout/Container";

// Deliberate exception to "blue is a restrained accent everywhere else" —
// this bar, directly above the (black) Header, is one of the storefront's
// intentional full-strength brand-blue moments: a solid VOLREP Blue fill
// with white text, no dot/black treatment. See app/globals.css's brand-
// token comment for the fuller "where blue is allowed to be a fill vs. an
// accent" rationale.
export function PromoBar() {
  return (
    <div className="bg-volt">
      <Container>
        <p className="flex h-9 items-center justify-center text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white">
          Premium Daily Recovery
        </p>
      </Container>
    </div>
  );
}
