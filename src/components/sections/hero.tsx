import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { Media } from '@/components/ui/media';
import { PlaceholderBadge } from '@/components/ui/placeholder-badge';
import { TextLink } from '@/components/ui/text-link';
import { TitleBlock, type TitleBlockItem } from '@/components/ui/title-block';
import { stats } from '@/content/projects';
import { sectionIds } from '@/i18n/config';

import type { SectionProps } from './section-props';

interface HeroProps extends SectionProps {
  /** Years of practice, computed on the server. */
  years: number;
}

const HERO_SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 46vw, 68vw';

/**
 * Corner lines of the frame: each connects a frame corner to the matching corner of the image
 * (image inset: 16% horizontally, 8% vertically).
 */
const FRAME_LINES: readonly (readonly [number, number, number, number])[] = [
  [0, 0, 16, 8],
  [100, 0, 84, 8],
  [0, 100, 16, 92],
  [100, 100, 84, 92],
];

export function Hero({ dictionary, locale, years }: HeroProps) {
  const { hero, common } = dictionary;
  const badge = <PlaceholderBadge label={common.placeholder} className="ml-2 align-middle" />;

  const statItems: TitleBlockItem[] = [
    { id: 'years', label: hero.stats.yearsLabel, value: years },
    {
      id: 'projects',
      label: (
        <>
          {hero.stats.projectsLabel}
          {stats.projects.placeholder ? badge : null}
        </>
      ),
      value: stats.projects.value,
    },
    {
      id: 'awards',
      label: (
        <>
          {hero.stats.awardsLabel}
          {stats.awards.placeholder ? badge : null}
        </>
      ),
      value: stats.awards.value,
    },
    {
      id: 'location',
      label: hero.stats.locationLabel,
      value: hero.stats.locationValue,
      // A word, not a number: the stat size does not fit "Stargard" in a narrow cell.
      valueStyle: 'value',
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
            <h1 id="hero-title" className="mt-6 max-w-[14ch] type-display">
              {hero.title}
            </h1>
            <p className="mt-6 type-lead text-fg-muted">{hero.lead}</p>
            <div className="mt-8 flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:items-center">
              <ButtonLink href={`/${locale}#${sectionIds.contact}`} className="w-full sm:w-auto">
                {hero.primaryCta}
              </ButtonLink>
              <TextLink href={`/${locale}#${sectionIds.portfolio}`}>{hero.secondaryCta}</TextLink>
            </div>
          </div>

          <div className="col-span-4 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-7">
            {/* Frame: a square with a 4:5 image in the opening, echoing the emblem. */}
            <div className="relative mx-auto aspect-square w-full max-w-[68svh] border border-line">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
                className="absolute inset-0 size-full stroke-line"
              >
                {FRAME_LINES.map(([x1, y1, x2, y2]) => (
                  <line
                    key={`${x1}-${y1}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    className="hero-line"
                    style={{ transformOrigin: `${x1}px ${y1}px` }}
                  />
                ))}
              </svg>
              <div className="hero-reveal absolute inset-x-[16%] inset-y-[8%]">
                <Media
                  image="hero"
                  alt={hero.imageAlt}
                  sizes={HERO_SIZES}
                  placeholderLabel={common.placeholder}
                  preload
                  quality={85}
                />
              </div>
            </div>
          </div>
        </div>

        <TitleBlock
          items={statItems}
          valueStyle="stat"
          className="mb-10 grid-cols-2 md:grid-cols-4"
        />
      </Container>
    </section>
  );
}
