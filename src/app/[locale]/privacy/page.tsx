import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PrivacyDocumentView } from '@/components/sections/privacy-document';
import { TextLink } from '@/components/ui/text-link';
import { getPrivacyDocument } from '@/content/privacy';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { createPageMetadata } from '@/lib/metadata';

// Rebuild daily so the copyright year in the footer does not go stale.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { meta } = getDictionary(locale);

  return createPageMetadata({
    locale,
    path: '/privacy',
    title: meta.privacyTitle,
    socialTitle: `${meta.privacyTitle} — Archica`,
    description: meta.privacyDescription,
    imageAlt: meta.ogImageAlt,
  });
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const document = getPrivacyDocument(locale);

  return (
    <article className="container-page grid-page pt-[calc(var(--header-h)+clamp(3rem,8vw,6rem))] pb-[clamp(4rem,10vw,8rem)]">
      <div className="col-span-4 md:col-span-12 lg:col-span-8">
        <h1 className="type-h2">{dictionary.meta.privacyTitle}</h1>
        <p className="mt-4 type-small text-fg-muted">
          {dictionary.privacy.updatedLabel}:{' '}
          <time dateTime={document.updatedIso}>{document.updated}</time>
        </p>
        <div className="mt-12 max-w-[68ch]">
          <PrivacyDocumentView
            document={document}
            placeholderLabel={dictionary.common.placeholder}
          />
        </div>
        <div className="mt-16">
          <TextLink href={`/${locale}`}>{dictionary.privacy.backToHome}</TextLink>
        </div>
      </div>
    </article>
  );
}
