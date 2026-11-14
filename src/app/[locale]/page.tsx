import { notFound } from 'next/navigation';

import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { CloseIcon, CopyIcon, MenuIcon, MoonIcon, SunIcon } from '@/components/ui/icons';
import { Logo } from '@/components/ui/logo';
import { Media } from '@/components/ui/media';
import { PlaceholderBadge } from '@/components/ui/placeholder-badge';
import { Section } from '@/components/ui/section';
import { TextLink } from '@/components/ui/text-link';
import { TitleBlock } from '@/components/ui/title-block';
import { projects, stats } from '@/content/projects';
import { site } from '@/content/site';
import { isLocale, sectionIds } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { getYearsOfPractice } from '@/lib/years';

// Rebuild daily so the years-of-practice figure does not go stale (BLUEPRINT §3.1).
export const revalidate = 86400;

/** Token names are technical identifiers, not user-facing copy. */
const brandSwatches = ['moss', 'chalk', 'amber', 'sand', 'sage'] as const;
const semanticSwatches = [
  'bg-bg',
  'bg-fg',
  'bg-fg-muted',
  'bg-accent',
  'bg-accent-text',
  'bg-line-strong',
] as const;

/** Temporary Stage 1 page: tokens, typography and logo in both themes (replaced in Stage 3). */
export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const years = getYearsOfPractice();
  const logoName = dictionary.a11y.logoName;

  const statItems = [
    { id: 'years', label: dictionary.hero.stats.yearsLabel, value: years },
    { id: 'projects', label: dictionary.hero.stats.projectsLabel, value: stats.projects.value },
    { id: 'awards', label: dictionary.hero.stats.awardsLabel, value: stats.awards.value },
    {
      id: 'location',
      label: dictionary.hero.stats.locationLabel,
      value: dictionary.hero.stats.locationValue,
    },
  ];

  const themePanels = [
    { id: 'dark', className: 'dark' },
    { id: 'light', className: 'light' },
  ] as const;

  return (
    <>
      <Section id={sectionIds.top} labelledBy="stage1-title">
        <Container>
          <p className="type-label text-accent-text">{dictionary.hero.eyebrow}</p>
          <h1 id="stage1-title" className="mt-6 max-w-[16ch] type-display">
            {dictionary.hero.title}
          </h1>
          <p className="mt-8 type-lead text-fg-muted">{dictionary.hero.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2">
            <ButtonLink href={`/${locale}#${sectionIds.contact}`}>
              {dictionary.hero.primaryCta}
            </ButtonLink>
            <TextLink href={`/${locale}#${sectionIds.portfolio}`}>
              {dictionary.hero.secondaryCta}
            </TextLink>
          </div>
          <TitleBlock
            items={statItems}
            valueStyle="stat"
            className="mt-16 grid-cols-2 md:grid-cols-4"
          />
        </Container>
      </Section>

      {themePanels.map((panel) => (
        <div key={panel.id} className={`${panel.className} bg-bg text-fg`}>
          <Container className="grid gap-12 py-16">
            <div className="flex flex-wrap items-center gap-10">
              <Logo variant="horizontal" title={logoName} className="h-8 w-auto lg:h-10" />
              <Logo variant="stacked" title={logoName} className="h-20 w-auto" />
              <Logo variant="mark" title={logoName} className="size-12" />
              <div className="flex items-center gap-4 text-fg">
                <MenuIcon />
                <CloseIcon />
                <SunIcon />
                <MoonIcon />
                <CopyIcon />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {brandSwatches.map((name) => (
                <span
                  key={name}
                  className="size-12 border border-line"
                  style={{ backgroundColor: `var(--${name})` }}
                />
              ))}
              {semanticSwatches.map((cls) => (
                <span key={cls} className={`${cls} size-12 border border-line`} />
              ))}
            </div>

            <div className="grid gap-4">
              <p className="type-display">{dictionary.hero.title}</p>
              <h2 className="type-h2">{dictionary.services.title}</h2>
              <h3 className="type-h3">{dictionary.services.items[0].title}</h3>
              <p className="type-quote">{dictionary.about.quote}</p>
              <p className="type-lead">{dictionary.services.lead}</p>
              <p className="type-body">{dictionary.about.paragraphs[0]}</p>
              <p className="type-small text-fg-muted">{dictionary.about.quoteAuthor}</p>
              <p className="type-label text-accent-text">{dictionary.contact.labels.phone}</p>
              <p className="type-value">{site.phones[0].display}</p>
            </div>
          </Container>
        </div>
      ))}

      <Section id={sectionIds.about} labelledBy="stage1-band-title" band>
        <Container className="grid-page">
          <h2 id="stage1-band-title" className="col-span-4 type-h2 md:col-span-6">
            {dictionary.about.title}
          </h2>
          <p className="col-span-4 mt-6 type-body md:col-span-6 md:col-start-7 md:mt-0">
            {dictionary.about.paragraphs[1]}
          </p>
        </Container>
      </Section>

      <Section id={sectionIds.portfolio} labelledBy="stage1-media-title">
        <Container className="grid gap-8">
          <h2 id="stage1-media-title" className="type-h2">
            {dictionary.portfolio.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Media
              image="hero"
              alt={dictionary.hero.imageAlt}
              aspect="4 / 5"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 46vw, 68vw"
              preload
              quality={85}
            />
            <div className="grid content-start gap-4">
              {projects.map((project) => (
                <p key={project.id} className="type-small text-fg-muted">
                  {project.title}, {dictionary.portfolio.projects[project.id].category}{' '}
                  <PlaceholderBadge label={dictionary.common.placeholder} />
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
