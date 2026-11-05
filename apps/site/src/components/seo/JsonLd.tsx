/** Structured data as a JSON script tag. The content is our own, serialised here, never user input. */
export function JsonLd({ data }: { data: object }) {
  const html = { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
  return <script type="application/ld+json" dangerouslySetInnerHTML={html} />;
}
