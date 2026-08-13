import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { HeroProductVisual } from "@/components/home/HeroProductVisual";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <Container className="grid grid-cols-1 items-start gap-y-6 pt-8 pb-12 sm:gap-y-12 sm:pt-14 sm:pb-20 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0 lg:pt-16 lg:pb-24">
        <div className="lg:col-start-7 lg:row-start-1 lg:col-span-6">
          <HeroProductVisual />
        </div>

        <div className="lg:col-start-1 lg:row-start-1 lg:col-span-5">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-volt" />
            VOLREP<span aria-hidden="true">™</span> Recovery
          </p>

          <h1
            id="hero-heading"
            className="mt-4 text-5xl leading-[1.05] text-foreground lg:text-6xl"
          >
            Recover Every Day.
          </h1>

          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground sm:max-w-md sm:text-lg">
            VOLREP<span aria-hidden="true">™</span> creates premium recovery tools built around your
            everyday routine — starting with VOLREP PRM<span aria-hidden="true">™</span>, our
            percussive recovery massager.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-8">
            <ButtonLink href="/products/volrep-prm" size="lg" className="h-[52px] w-full sm:w-auto lg:h-12">
              Shop Recovery
            </ButtonLink>
            <Link
              href="/products/volrep-prm"
              className="rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Discover VOLREP PRM<span aria-hidden="true">™</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
