// Reads SEC documents: the list of attachments in a filing, and a readable
// title from the first lines of a document.
//
// Why this is needed: the SEC's filing list only says what kind of filing
// something is. The useful part is often an attachment, like the press
// release a company files along with its earnings, and its title is only
// written inside the document itself.
//
// This file is pure logic. It never talks to the internet, so it can be
// tested with saved copies of documents. Fetching lives in sec.ts.

import { decodeHTML } from "entities";

// ---------- HTML to plain text ----------

// Turn an HTML document into its lines of visible text. The <head> part
// (page title, styles) is skipped because it is not shown to readers.
export function htmlToLines(html: string): string[] {
  const text = html
    .replace(/<head\b[\s\S]*?<\/head>/gi, " ")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/?(br|p|div|tr|li|h[1-6]|table|font|center)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeHTML(text)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);
}

// Keep titles to a readable length, cutting at a space.
function shorten(text: string, max = 140): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  // Cut at a space and drop trailing punctuation, so it never ends in ".…".
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s.,;:]+$/, "")}…`;
}

// Lines in SEC documents that are labels, not titles: "EX-99.1",
// "Exhibit 99.1", "Exhibit Number", a number like "2" or "99.1", a file
// name, "Document".
const LABEL =
  /^(ex-\d+(\.\d+)?|exhibits?( (\d+(\.\d+)?|index|number|description))?|\d+(\.\d+)?|document|[\w.-]+\.htm|6-k|8-k)$/i;

// Headlines have at least four words. Shorter lines near the top are
// usually labels ("NEWS RELEASE"), company names or contact names. Lines
// that start with a number or end with a US ZIP code are usually parts of
// an address, and lines with an "@" are email addresses.
function isTitleLike(line: string): boolean {
  return (
    !LABEL.test(line) &&
    line.length >= 12 &&
    line.split(" ").length >= 4 &&
    !/^\d/.test(line) &&
    !/\b\d{5}(-\d{4})?$/.test(line) &&
    !line.includes("@") &&
    !/^for immediate release/i.test(line)
  );
}

// Some documents put "Exhibit 99.2" on the same line as the title.
function withoutExhibitLabel(line: string): string {
  return line.replace(/^exhibit\s+\d+(\.\d+)?\s*[:.-]?\s*/i, "");
}

// ---------- What the site keeps about a filing ----------

export type FilingDetails = {
  // For foreign company reports: the subject, read from the document.
  subject: string | null;
  // Attached press releases and similar documents, with their own titles.
  attachments: { title: string; url: string }[];
};

// ---------- The attachments in a filing ----------

export type AttachmentRef = {
  type: string; // the SEC's code, for example "EX-99.1"
  document: string; // the file name
};

// Every filing has an index page on sec.gov with a table of its documents.
// Pick out the "EX-99" attachments: press releases, presentations and
// similar material written for investors. Contracts and data files are
// left out.
export function parseAttachmentTable(indexHtml: string): AttachmentRef[] {
  const table = indexHtml.match(
    /<table class="tableFile" summary="Document Format Files">([\s\S]*?)<\/table>/,
  );
  if (!table) return [];

  const attachments: AttachmentRef[] = [];
  for (const row of table[1].match(/<tr[^>]*>[\s\S]*?<\/tr>/g) ?? []) {
    // The columns are: number, description, document, type, size.
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((cell) =>
      decodeHTML(cell[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim(),
    );
    if (cells.length < 4) continue;
    const type = cells[3];
    const document = cells[2].split(" ")[0];
    if (/^EX-99/i.test(type) && document) {
      attachments.push({ type, document });
    }
  }
  return attachments;
}

// ---------- Titles ----------

// The title of an attachment is its first line of real text, after the
// labels the SEC puts at the top.
export function titleFromAttachment(html: string): string | null {
  const title = htmlToLines(html).slice(0, 40).map(withoutExhibitLabel).find(isTitleLike);
  return title ? shorten(title) : null;
}

// Foreign companies file "6-K" reports. These start with a standard cover
// page and a signature, and the real subject comes right after the
// signature: the line with "/s/" holds the signer's name, then the name may
// repeat, then comes their job title, then the subject.
export function subjectFromForeignReport(html: string): string | null {
  const lines = htmlToLines(html);
  const signedAt = lines.findIndex((line) => line.includes("/s/"));
  if (signedAt === -1) return null;

  const signer = lines[signedAt].split("/s/")[1]?.trim();
  let next = signedAt + 1;
  if (signer && lines[next] === signer) next++;
  next++; // the signer's job title

  const subject = lines
    .slice(next, next + 6)
    .find((line) => isTitleLike(line) && !/^(date|by)\b/i.test(line));
  return subject ? shorten(subject) : null;
}
