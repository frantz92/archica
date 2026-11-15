import { Container } from '@/components/ui/container';
import { FramedMedia } from '@/components/ui/framed-media';
import { Media } from '@/components/ui/media';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { projects, type Project, type ProjectSlot } from '@/content/projects';
import { sectionIds } from '@/i18n/config';

import type { SectionProps } from './section-props';

interface SlotLayout {
  /** Grid placement on desktop (12 columns) and the optional downward offset. */
  readonly placement: string;
  /** Aspect ratio per breakpoint: slot ratio on mobile, 4:5 on tablet, slot ratio on desktop. */
  readonly aspect: string;
  readonly sizes: string;
  /** Photo sits in an amber-lined frame (used for one slot only, to keep the layout asymmetric). */
  readonly framed?: boolean;
}

const WIDE_SIZES = '(min-width: 1024px) 56vw, (min-width: 768px) 50vw, 100vw';
const NARROW_SIZES = '(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw';

/** Asymmetric desktop layout (BLUEPRINT §6.5). Class names are literal so Tailwind can see them. */
const SLOTS: Record<ProjectSlot, SlotLayout> = {
  A: {
    placement: 'lg:col-span-7 lg:col-start-1',
    aspect: 'aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/3]',
    sizes: WIDE_SIZES,
  },
  B: {
    placement: 'lg:col-span-4 lg:col-start-9 lg:mt-24',
    aspect: 'aspect-[4/5]',
    sizes: NARROW_SIZES,
    framed: true,
  },
  C: {
    placement: 'lg:col-span-4 lg:col-start-1',
    aspect: 'aspect-[4/5]',
    sizes: NARROW_SIZES,
  },
  D: {
    placement: 'lg:col-span-7 lg:col-start-6 lg:mt-24',
    aspect: 'aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/3]',
    sizes: WIDE_SIZES,
  },
};

function captionDetails(project: Project, category: string): string {
  return [category, project.location, project.year].filter(Boolean).join(', ');
}

export function Portfolio({ dictionary }: SectionProps) {
  const { portfolio, common } = dictionary;

  return (
    <Section id={sectionIds.portfolio} labelledBy="portfolio-title">
      <Container>
        <SectionHeader id="portfolio-title" title={portfolio.title} />

        <div className="grid-page gap-y-12 lg:items-start lg:gap-y-24">
          {projects.map((project) => {
            const layout = SLOTS[project.slot];
            const text = portfolio.projects[project.id];
            return (
              <figure
                key={project.id}
                className={`project-figure col-span-4 md:col-span-6 ${layout.placement}`}
              >
                {layout.framed ? (
                  <FramedMedia
                    image={project.image}
                    alt={text.imageAlt}
                    sizes={layout.sizes}
                    placeholderLabel={common.placeholder}
                    frameClassName={`${layout.aspect} w-full`}
                    insetX={12}
                    insetY={12}
                    motion="scroll"
                  />
                ) : (
                  <Media
                    image={project.image}
                    alt={text.imageAlt}
                    sizes={layout.sizes}
                    aspectClassName={layout.aspect}
                    className="reveal-media"
                    placeholderLabel={common.placeholder}
                  />
                )}
                <figcaption className="reveal mt-4 grid gap-1">
                  <h3 className="type-h3">{text.title}</h3>
                  <p className="type-small text-fg-muted">
                    {captionDetails(project, text.category)}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
