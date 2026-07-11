/** Renders JSON-LD structured data scripts for SEO */
export function StructuredData({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape `<` so no field value can break out of the script tag
          // (e.g. a `</script><script>` sequence in authored copy).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  );
}