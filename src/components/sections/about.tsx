import { Container } from '@/components/ui/container';
import { Media } from '@/components/ui/media';
import { Section } from '@/components/ui/section';
import { TitleBlock, type TitleBlockItem } from '@/components/ui/title-block';
import { site } from '@/content/site';
import { sectionIds } from '@/i18n/config';

import type { SectionProps } from './section-props';

const ABOUT_SIZES = '(min-width: 1024px) 38vw, 100vw';

export function About({ dictionary }: SectionProps) {
  const { about, common } = dictionary;

  const tableItems: TitleBlockItem[] = [
    { id: 'founded', label: about.table.foundedLabel, value: site.foundedYear },
    { id: 'seat', label: about.table.seatLabel, value: site.address.city },
    { id: 'leader', label: about.table.leaderLabel, value: site.founder },
  ];

  return (
    <Section id={sectionIds.about} labelledBy="about-title" band>
      <Container>
        {/* Mobile: heading, photo, text. Desktop: photo left (cols 1–5), text right (cols 7–12). */}
        <div className="grid-page gap-y-10 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <h2
            id="about-title"
            className="col-span-4 type-h2 md:col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-1"
          >
            {about.title}
          </h2>

          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
            <Media
              image="about"
              alt={about.imageAlt}
              sizes={ABOUT_SIZES}
              aspectClassName="aspect-[4/5]"
              placeholderLabel={common.placeholder}
            />
          </div>

          <div className="col-span-4 flex flex-col gap-8 md:col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-2">
            <figure className="grid gap-6">
              <blockquote>
                <p className="type-quote">{about.quote}</p>
              </blockquote>
              <figcaption className="type-small text-fg-muted">{about.quoteAuthor}</figcaption>
            </figure>
            <div className="grid gap-4">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="type-body">
                  {paragraph}
                </p>
              ))}
            </div>
            <TitleBlock items={tableItems} className="mt-auto grid-cols-1 lg:mt-8" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
