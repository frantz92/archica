import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { CountUp } from '@/components/ui/count-up';
import { FramedMedia } from '@/components/ui/framed-media';
import { TextLink } from '@/components/ui/text-link';
import { TitleBlock, type TitleBlockItem } from '@/components/ui/title-block';
import { site } from '@/content/site';
import { sectionIds } from '@/i18n/config';
import { sectionHref } from '@/lib/navigation';

import type { SectionProps } from './section-props';

interface HeroProps extends SectionProps {
  /** Years of practice, computed on the server. */
  years: number;
}

const HERO_SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 46vw, 68vw';

export function Hero({ dictionary, locale, years }: HeroProps) {
  const { hero, common } = dictionary;
  const statItems: TitleBlockItem[] = [
    {
      id: 'years',
      label: hero.stats.yearsLabel(years),
      value: <CountUp value={years} delayMs={700} />,
    },
    {
      id: 'projects',
      label: hero.stats.projectsLabel,
      value: <CountUp value={site.stats.projects} delayMs={800} />,
    },
    {
      id: 'tenders',
      label: hero.stats.tendersLabel,
      value: <CountUp value={site.stats.tendersWon} delayMs={900} />,
    },
    {
      id: 'municipalities',
      label: hero.stats.municipalitiesLabel,
      value: <CountUp value={site.stats.municipalities} delayMs={1000} />,
    },
  ];

  return (
    <section
      id={sectionIds.top}
      aria-labelledby="hero-title"
      className="flex flex-col bg-bg pt-(--header-h) text-fg md:min-h-svh"
    >
      <Container className="flex flex-1 flex-col">
        <div className="grid-page flex-1 items-end gap-y-10 py-10 md:py-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-6">
            <p className="type-label text-accent-text">{hero.eyebrow}</p>
            <h1 id="hero-title" className="mt-6 max-w-[18ch] type-display">
              {hero.title}
            </h1>
            <p className="mt-6 type-lead">{hero.lead}</p>
            <div className="mt-8 flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:items-center">
              <ButtonLink href={sectionHref(locale, 'contact')} className="w-full sm:w-auto">
                {hero.primaryCta}
              </ButtonLink>
              <TextLink href={sectionHref(locale, 'portfolio')}>{hero.secondaryCta}</TextLink>
            </div>
          </div>

          <div className="col-span-4 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-7">
            {/* Frame: a square with a 4:5 photo in the opening, echoing the emblem. */}
            <FramedMedia
              image="hero"
              alt={hero.imageAlt}
              sizes={HERO_SIZES}
              placeholderLabel={common.placeholder}
              frameClassName="mx-auto aspect-square w-full max-w-[68svh]"
              insetX={16}
              insetY={8}
              motion="load"
              preload
              quality={85}
            />
          </div>
        </div>

        <TitleBlock
          items={statItems}
          valueStyle="stat"
          className="hero-stats mb-10 grid-cols-2 md:grid-cols-4"
        />
      </Container>
    </section>
  );
}
