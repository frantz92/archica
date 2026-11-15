import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { ServiceIcon } from '@/components/ui/service-icons';
import { sectionIds } from '@/i18n/config';

import type { SectionProps } from './section-props';

export function Services({ dictionary }: SectionProps) {
  const { services } = dictionary;

  return (
    <Section id={sectionIds.services} labelledBy="services-title" tone="surface">
      <Container>
        <SectionHeader id="services-title" title={services.title} />

        {/* 2 × 2 matrix: lines are the 1 px gap over the line-coloured background. */}
        <ul className="rule-draw rule-y grid gap-px bg-line md:grid-cols-2">
          {services.items.map((item) => (
            <li
              key={item.id}
              className="reveal service-cell cell-hover flex flex-col gap-4 bg-bg p-[clamp(1.5rem,3vw,3rem)] md:min-h-72"
            >
              <ServiceIcon id={item.id} className="mb-2" />
              <h3 className="type-h3">{item.title}</h3>
              <p className="type-body max-w-[42ch]">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
