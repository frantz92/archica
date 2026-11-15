import { Container } from '@/components/ui/container';
import { FramedMedia } from '@/components/ui/framed-media';
import { Section } from '@/components/ui/section';
import { SectionMark } from '@/components/ui/section-mark';
import { sectionIds } from '@/i18n/config';

import type { SectionProps } from './section-props';

const ABOUT_SIZES = '(min-width: 1024px) 38vw, 100vw';

export function About({ dictionary }: SectionProps) {
  const { about, common } = dictionary;

  return (
    <Section id={sectionIds.about} labelledBy="about-title" tone="band">
      <Container>
        {/* Mobile: heading, photo, text. Desktop: photo left (cols 1–5), text right (cols 7–12). */}
        <div className="grid-page gap-y-10 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="reveal col-span-4 grid gap-6 md:col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <SectionMark />
            <h2 id="about-title" className="type-h2">
              {about.title}
            </h2>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
            <FramedMedia
              image="about"
              alt={about.imageAlt}
              sizes={ABOUT_SIZES}
              placeholderLabel={common.placeholder}
              frameClassName="aspect-[4/5] w-full"
              insetX={10}
              insetY={10}
              motion="scroll"
            />
          </div>

          <div className="col-span-4 flex flex-col gap-8 md:col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-2">
            <figure className="reveal grid gap-6">
              <blockquote>
                <p className="type-quote">{about.quote}</p>
              </blockquote>
              <figcaption className="type-small text-fg-muted">{about.quoteAuthor}</figcaption>
            </figure>
            <div className="reveal grid gap-4">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="type-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
