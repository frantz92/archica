import type { Metadata } from 'next';

import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { Hero } from '@/components/sections/hero';
import { Portfolio } from '@/components/sections/portfolio';
import { Services } from '@/components/sections/services';
import { createPageMetadata } from '@/lib/metadata';
import { resolveRoute } from '@/lib/route-locale';
import { getYearsOfPractice } from '@/lib/years';

// Rebuild daily so the years-of-practice figure does not go stale (BLUEPRINT §3.1).
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const {
    locale,
    dictionary: { meta },
  } = await resolveRoute(params);

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
  const { locale, dictionary } = await resolveRoute(params);

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
