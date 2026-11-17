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

// The title given to an attachment whose own title could not be read.
export const UNTITLED_ATTACHMENT = "Attached document";

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

// ---------- Friendlier titles ----------

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";

// Short words that stay lowercase inside a title, and short forms that stay
// in capitals.
const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "with",
]);
const KEEP_CAPITALS = [
  "AI", "GPU", "CPU", "CEO", "CFO", "CTO", "US", "U.S.", "UK", "EU", "SEC", "AGM", "HBM",
  "EUV", "IPO", "ETF", "R&D", "Q1", "Q2", "Q3", "Q4", "FY", "N.V.", "PLC",
];

// True when a title is written in capitals only, like a shout.
function isAllCapitals(text: string): boolean {
  const letters = text.replace(/[^A-Za-z]/g, "");
  return letters.length >= 8 && letters === letters.toUpperCase();
}

// "AMD'S THIRD-QUARTER AI RESULTS" -> "AMD's Third-Quarter AI Results"
function toTitleCase(text: string, keep: Set<string>): string {
  const capitalize = (part: string) => {
    const bare = part.replace(/['’]s$/i, "").replace(/[^a-z0-9&.]/gi, "").toUpperCase();
    if (keep.has(bare)) return part.toUpperCase().replace(/(['’])S$/, "$1s");
    return part.replace(/^([^a-z0-9]*)([a-z])/, (_, before: string, letter: string) => before + letter.toUpperCase());
  };
  return text
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index > 0 && SMALL_WORDS.has(word.replace(/[^a-z]/g, ""))
        ? word
        : word.split("-").map(capitalize).join("-"),
    )
    .join(" ");
}

// Make a company's title easier to read, without changing what it says.
// It runs when a title is shown, so improving these rules also improves
// titles that were stored earlier. keepCapitals lists extra words that stay
// in capitals, such as company names like AMD. What these rules cannot fix,
// the AI step in Phase 5 can.
export function friendlyTitle(raw: string, keepCapitals: readonly string[] = []): string {
  let title = raw.replace(/\s+/g, " ").trim();

  // "English Translation of X Originally Issued in Chinese" -> "X (English translation)"
  title = title.replace(/^English translation of (.+?) originally issued in \w+\.?$/i, "$1 (English translation)");

  // Legal tails such as "pursuant to Rule 13a-16".
  title = title.replace(/\s+pursuant to\b.*$/i, "");

  // Long financial statement titles, such as "Consolidated Financial
  // Statements for the Nine Months Ended September 30, 2026 and 2025 and
  // Independent Auditors' Review Report": keep what they are and the period.
  const period = title.match(
    new RegExp(
      `financial statements (?:as of and )?for the (three months|six months|nine months|twelve months|years?) ended (${MONTHS}) (\\d{1,2}, \\d{4})`,
      "i",
    ),
  );
  if (period) {
    const span = period[1].toLowerCase().replace("years", "year");
    const month = period[2].charAt(0).toUpperCase() + period[2].slice(1).toLowerCase();
    return `Financial statements for the ${span} ended ${month} ${period[3]}`;
  }

  // A date at the end usually repeats the date shown next to the title. It
  // stays when the title needs it, as in "quarter ended March 31, 2026".
  title = title.replace(
    new RegExp(
      `(?<!\\b(?:ended|ending|of|on|to|through|until|from|by|dated|at))\\s+(?:${MONTHS}) \\d{1,2}, \\d{4}$`,
      "i",
    ),
    "",
  );

  if (isAllCapitals(title)) {
    const keep = new Set([...KEEP_CAPITALS, ...keepCapitals.map((word) => word.toUpperCase())]);
    title = toTitleCase(title, keep);
  }
  return title;
}
