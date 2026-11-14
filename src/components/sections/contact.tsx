import { Container } from '@/components/ui/container';
import { CopyButton } from '@/components/ui/copy-button';
import { Section } from '@/components/ui/section';
import { TextLink } from '@/components/ui/text-link';
import { TitleBlock, type TitleBlockItem } from '@/components/ui/title-block';
import { site } from '@/content/site';
import { sectionIds } from '@/i18n/config';

import type { SectionProps } from './section-props';

export function Contact({ dictionary }: SectionProps) {
  const { contact, common } = dictionary;

  const items: TitleBlockItem[] = [
    {
      id: 'phone',
      label: contact.labels.phone,
      value: (
        <div className="grid">
          {site.phones.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className="inline-block min-h-11 link-underline-draw py-1.5"
            >
              {phone.display}
            </a>
          ))}
        </div>
      ),
    },
    {
      id: 'email',
      label: contact.labels.email,
      value: (
        <div className="grid justify-items-start">
          <a
            href={`mailto:${site.email}`}
            className="inline-block min-h-11 link-underline-draw py-1.5 break-all"
          >
            {site.email}
          </a>
          <CopyButton
            text={site.email}
            label={contact.copyEmail}
            copiedLabel={contact.copiedEmail}
          />
        </div>
      ),
    },
    {
      id: 'address',
      label: contact.labels.address,
      value: (
        <div className="grid justify-items-start gap-2">
          <address className="not-italic">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <TextLink
            href={site.mapUrl}
            external
            externalHint={common.opensInNewTab}
            className="type-small"
          >
            {contact.showOnMap}
          </TextLink>
        </div>
      ),
    },
    {
      id: 'hours',
      label: contact.labels.hours,
      value: (
        <p>
          {contact.hoursDays}
          <br />
          {contact.hoursTime}
        </p>
      ),
    },
  ];

  return (
    <Section id={sectionIds.contact} labelledBy="contact-title">
      <Container>
        <div className="grid-page gap-y-6">
          <h2 id="contact-title" className="col-span-4 type-h2 md:col-span-12 lg:col-span-8">
            {contact.title}
          </h2>
          <p className="col-span-4 type-lead text-fg-muted md:col-span-12 lg:col-span-8">
            {contact.lead}
          </p>
        </div>
        <TitleBlock
          items={items}
          className="mt-16 grid-cols-1 md:grid-cols-2 lg:mt-24 lg:grid-cols-4"
        />
      </Container>
    </Section>
  );
}
