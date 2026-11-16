// NOTE: this text is a draft that requires legal review before publication (BLUEPRINT §6.8).
// Do not state this on the page.
import { site } from '@/content/site';
import { nonBreaking } from '@/lib/text';

import type { PrivacyDocument } from './types';

export const privacyFr: PrivacyDocument = {
  updated: '14 novembre 2026',
  updatedIso: '2026-11-14',
  sections: [
    {
      id: 'controller',
      heading: 'Responsable du traitement',
      blocks: [
        {
          type: 'paragraph',
          text: `Le responsable du traitement des données personnelles traitées dans le cadre du site ${site.hostname} est ${site.fullName}, dont le siège est à Stargard (Pologne), ${site.address.line}, NIP ${site.taxId}.`,
        },
        {
          type: 'paragraph',
          text: `Pour toute question relative aux données personnelles, vous pouvez nous écrire à ${site.email} ou nous appeler au ${nonBreaking(site.phones[0].display)} ou au ${nonBreaking(site.phones[1].display)}.`,
        },
      ],
    },
    {
      id: 'scope',
      heading: 'Données traitées et finalités',
      blocks: [
        {
          type: 'paragraph',
          text: 'Le site est purement informatif. Il ne comporte ni formulaire de contact, ni compte utilisateur, ni boutique. Nous traitons\u00A0:',
        },
        {
          type: 'list',
          items: [
            'des données techniques liées à la visite du site (par exemple l’adresse IP, le type de navigateur, les pages consultées, la date et l’heure), traitées par l’hébergeur afin de fournir le site et d’en assurer la sécurité\u00A0;',
            'les données que vous nous communiquez par téléphone ou par e-mail (par exemple nom, adresse e-mail, numéro de téléphone, contenu du message), traitées afin de répondre à votre demande et d’échanger sur votre projet.',
          ],
        },
      ],
    },
    {
      id: 'legal-basis',
      heading: 'Base juridique',
      blocks: [
        {
          type: 'paragraph',
          text: 'Nous traitons les données sur le fondement de l’article 6, paragraphe 1, point f) du RGPD (intérêt légitime du responsable du traitement\u00A0: exploitation et sécurisation du site, réponse aux demandes) et de l’article 6, paragraphe 1, point b) du RGPD lorsque le contact concerne des mesures précontractuelles prises à la demande de la personne concernée.',
        },
      ],
    },
    {
      id: 'hosting',
      heading: 'Hébergement',
      blocks: [
        {
          type: 'paragraph',
          text: 'Le site est fourni par l’hébergeur SeoHost sp. z o.o., ul. Obornicka 330, 60-689 Poznań, Pologne. Les serveurs sont situés en Pologne (dans des centres de données polonais). Le site n’utilise aucun outil d’analyse ni aucun script tiers.',
        },
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies et stockage du navigateur',
      blocks: [
        {
          type: 'paragraph',
          text: 'Le site n’utilise pas de cookies propres ni d’outils publicitaires. Dans le stockage du navigateur (localStorage), nous enregistrons uniquement le thème de couleurs que vous choisissez (clair ou sombre), afin de le retrouver lors de vos prochaines visites. Cette information n’est transmise ni à nous ni à des tiers.',
        },
      ],
    },
    {
      id: 'recipients',
      heading: 'Destinataires des données',
      blocks: [
        {
          type: 'paragraph',
          text: 'Les destinataires des données peuvent être des prestataires de services informatiques (hébergement, messagerie) agissant pour notre compte.',
        },
      ],
    },
    {
      id: 'retention',
      heading: 'Durée de conservation',
      blocks: [
        // PLACEHOLDER: replace both retention periods with the periods confirmed by the client and legal review.
        {
          type: 'paragraph',
          text: 'Nous conservons la correspondance pendant\u00A0: [à compléter].',
          placeholder: true,
        },
        {
          type: 'paragraph',
          text: 'Les données techniques sont conservées pendant la durée fixée par l’hébergeur\u00A0: [à compléter].',
          placeholder: true,
        },
      ],
    },
    {
      id: 'rights',
      heading: 'Vos droits',
      blocks: [
        {
          type: 'paragraph',
          text: `Vous disposez d’un droit d’accès à vos données, de rectification, d’effacement, de limitation du traitement et de portabilité, ainsi que d’un droit d’opposition au traitement fondé sur l’intérêt légitime. Pour exercer ces droits, écrivez à ${site.email} ou appelez-nous.`,
        },
      ],
    },
    {
      id: 'complaint',
      heading: 'Réclamation auprès d’une autorité de contrôle',
      blocks: [
        {
          type: 'paragraph',
          text: 'Si vous estimez que vos données sont traitées de manière illicite, vous pouvez introduire une réclamation auprès du Président de l’Office polonais de protection des données personnelles (UODO).',
        },
      ],
    },
    {
      id: 'changes',
      heading: 'Modification de la politique',
      blocks: [
        {
          type: 'paragraph',
          text: 'Cette politique peut être mise à jour. La version en vigueur est toujours disponible sur cette page, et la date de la dernière modification figure en haut de page.',
        },
      ],
    },
  ],
};
