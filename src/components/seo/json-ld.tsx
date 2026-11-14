interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders structured data. "<" is escaped so the payload cannot close the script tag (Next.js guide). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
