/** Serializes a JSON-LD object for embedding via dangerouslySetInnerHTML.
 *  Plain JSON.stringify() does not escape "<", so any string field inside
 *  the object — including data pulled from external feeds (YouTube titles,
 *  Naver Blog RSS) rather than authored by us — could contain the literal
 *  sequence "</script>" and break out of the script tag into live HTML/JS.
 *  Escaping "<" to its unicode form neutralizes that while staying valid,
 *  semantically identical JSON. Use this everywhere a JSON-LD block is
 *  rendered instead of calling JSON.stringify() directly. */
export function toSafeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
