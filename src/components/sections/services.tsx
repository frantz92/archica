import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { sectionIds } from '@/i18n/config';

import type { SectionProps } from './section-props';

export function Services({ dictionary }: SectionProps) {
  const { services } = dictionary;

  return (
    <Section id={sectionIds.services} labelledBy="services-title">
      <Container>
        <div className="grid-page gap-y-6">
          <h2 id="services-title" className="col-span-4 type-h2 md:col-span-12 lg:col-span-5">
            {services.title}
          </h2>
          <p className="col-span-4 type-lead text-fg-muted md:col-span-12 lg:col-span-6 lg:col-start-7">
            {services.lead}
          </p>
        </div>

        {/* 2 × 2 matrix: lines are the 1 px gap over the line-coloured background. */}
        <ul className="mt-16 grid gap-px border-y border-line bg-line md:grid-cols-2 lg:mt-24">
          {services.items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-4 bg-bg p-[clamp(1.5rem,3vw,3rem)] md:min-h-72"
            >
              <h3 className="type-h3">{item.title}</h3>
              <p className="type-body max-w-[42ch]">{item.description}</p>
              <p className="mt-auto pt-8 type-small text-fg-muted">
                {services.audienceLabel}: {item.audience}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
