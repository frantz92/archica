import { NotFoundContent } from '@/components/layout/not-found-content';
import { getDictionary } from '@/i18n/get-dictionary';

export default function NotFound() {
  const pl = getDictionary('pl');
  const en = getDictionary('en');
  const fr = getDictionary('fr');

  return (
    <NotFoundContent
      strings={{ pl: pl.notFound, en: en.notFound, fr: fr.notFound }}
      logoName={pl.a11y.logoName}
    />
  );
}
