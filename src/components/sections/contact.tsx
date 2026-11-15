import { Container } from '@/components/ui/container';
import { EmailLink, PhoneLinks } from '@/components/ui/contact-links';
import { CopyButton } from '@/components/ui/copy-button';
import { PostalAddress } from '@/components/ui/postal-address';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
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
          <PhoneLinks compact />
        </div>
      ),
    },
    {
      id: 'email',
      label: contact.labels.email,
      value: (
        <div className="grid justify-items-start">
          <EmailLink compact className="break-all" />
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
          <PostalAddress />
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
    <Section id={sectionIds.contact} labelledBy="contact-title" className="border-t border-line">
      <Container>
        <SectionHeader id="contact-title" title={contact.title} lead={contact.lead} />
        <TitleBlock items={items} reveal className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
      </Container>
    </Section>
  );
}
