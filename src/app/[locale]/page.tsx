import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { Hero } from '@/components/sections/hero';
import { Portfolio } from '@/components/sections/portfolio';
import { Services } from '@/components/sections/services';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { createPageMetadata } from '@/lib/metadata';
import { getYearsOfPractice } from '@/lib/years';

// Rebuild daily so the years-of-practice figure does not go stale (BLUEPRINT §3.1).
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { meta } = getDictionary(locale);

  return createPageMetadata({
    locale,
    path: '',
    title: { absolute: meta.title },
    socialTitle: meta.title,
    description: meta.description,
    imageAlt: meta.ogImageAlt,
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dictionary={dictionary} years={getYearsOfPractice()} />
      <Services locale={locale} dictionary={dictionary} />
      <About locale={locale} dictionary={dictionary} />
      <Portfolio locale={locale} dictionary={dictionary} />
      <Contact locale={locale} dictionary={dictionary} />
    </>
  );
}
