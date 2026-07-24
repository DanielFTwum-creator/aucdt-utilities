// Renders a JSON-LD structured-data block. Per the Next 16 JSON-LD guide, a
// native <script> tag is correct here (JSON-LD is data, not executable code),
// and `<` is escaped to < to prevent XSS via the serialized payload.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
