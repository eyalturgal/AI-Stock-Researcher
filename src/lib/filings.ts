// Turns the SEC's list of a company's filings into items the site can show.
//
// A "filing" is a document a company must hand to the SEC. These are the
// official record: the company is legally responsible for what they say,
// and anyone may copy and reuse them. In the site's news plan this is
// category A, "Official record".
//
// This file is pure logic. It never talks to the internet. Fetching lives
// in sec.ts.

// ---------- The shape of the SEC's data ----------

// The SEC sends each field as its own list. The first filing is position 0
// in every list, the second is position 1, and so on.
export type SecSubmissions = {
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      reportDate: string[];
      form: string[];
      items: string[];
      primaryDocument: string[];
    };
  };
};

// ---------- What this file produces ----------

export type FilingTopic =
  | "Financial report"
  | "Earnings"
  | "Leadership"
  | "Deals"
  | "Governance"
  | "Company update";

export type Filing = {
  id: string;
  form: string; // the SEC's own code, for example "10-Q"
  kind: string; // the same thing in plain words, for example "Quarterly report"
  topic: FilingTopic;
  title: string;
  filedOn: string; // YYYY-MM-DD
  url: string; // the document on sec.gov
};

// ---------- Plain-language names ----------

// The filing types worth showing as news, and what each one is.
// Others are left out for now, such as the many small forms that record
// share sales by company insiders.
const KINDS: Record<string, string> = {
  "10-K": "Annual report",
  "10-Q": "Quarterly report",
  "8-K": "Event notice",
  "DEF 14A": "Annual meeting notice",
};

// An event notice (8-K) lists numbered reasons for being filed. These are
// the SEC's standard numbers, put into plain words.
const EVENT_REASONS: Record<string, { text: string; topic: FilingTopic }> = {
  "1.01": { text: "Signed a major agreement", topic: "Deals" },
  "1.02": { text: "Ended a major agreement", topic: "Deals" },
  "1.03": { text: "Bankruptcy or receivership", topic: "Company update" },
  "1.05": { text: "Reported a cybersecurity incident", topic: "Company update" },
  "2.01": { text: "Completed an acquisition or sale", topic: "Deals" },
  "2.02": { text: "Announced earnings results", topic: "Earnings" },
  "2.03": { text: "Took on new debt or obligations", topic: "Company update" },
  "2.05": { text: "Announced restructuring costs", topic: "Company update" },
  "2.06": { text: "Wrote down the value of assets", topic: "Company update" },
  "3.01": { text: "Received a stock exchange listing notice", topic: "Company update" },
  "3.02": { text: "Sold shares privately", topic: "Company update" },
  "3.03": { text: "Changed shareholder rights", topic: "Governance" },
  "4.01": { text: "Changed its auditor", topic: "Governance" },
  "4.02": {
    text: "Said earlier financial statements should not be relied on",
    topic: "Company update",
  },
  "5.01": { text: "Change in who controls the company", topic: "Governance" },
  "5.02": { text: "Leadership or board change", topic: "Leadership" },
  "5.03": { text: "Changed its bylaws", topic: "Governance" },
  "5.07": { text: "Reported shareholder vote results", topic: "Governance" },
  "7.01": { text: "Shared information with investors", topic: "Company update" },
  "8.01": { text: "Reported another event", topic: "Company update" },
};

function longDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

// Work out a readable title and topic for one filing.
function describe(
  baseForm: string,
  reportDate: string,
  items: string,
): { title: string; topic: FilingTopic } {
  if (baseForm === "10-K") {
    return {
      title: reportDate
        ? `Annual report for the year ended ${longDate(reportDate)}`
        : "Annual report",
      topic: "Financial report",
    };
  }
  if (baseForm === "10-Q") {
    return {
      title: reportDate
        ? `Quarterly report for the quarter ended ${longDate(reportDate)}`
        : "Quarterly report",
      topic: "Financial report",
    };
  }
  if (baseForm === "DEF 14A") {
    return {
      title: "Notice of the annual shareholder meeting, with executive pay",
      topic: "Governance",
    };
  }

  // An event notice. Item 9.01 only means "documents are attached", so it
  // is skipped. The first real reason decides the topic.
  const reasons = items
    .split(",")
    .map((code) => EVENT_REASONS[code.trim()])
    .filter((reason) => reason !== undefined);
  if (reasons.length === 0) {
    return { title: "Event notice", topic: "Company update" };
  }
  return {
    title: reasons.map((reason) => reason.text).join(". "),
    topic: reasons[0].topic,
  };
}

// ---------- The main function ----------

// cik is the company's SEC number. limit is how many filings to return.
export function buildFilings(
  data: SecSubmissions,
  cik: string,
  limit: number,
): Filing[] {
  const recent = data.filings.recent;
  const filings: Filing[] = [];

  for (let i = 0; i < recent.form.length && filings.length < limit; i++) {
    const form = recent.form[i];
    // "10-K/A" is a corrected version of a 10-K. Treat it as the same type.
    const isAmendment = form.endsWith("/A");
    const baseForm = isAmendment ? form.slice(0, -2) : form;
    const kind = KINDS[baseForm];
    if (!kind) continue;

    const { title, topic } = describe(baseForm, recent.reportDate[i], recent.items[i]);
    const accession = recent.accessionNumber[i];

    filings.push({
      id: accession,
      form,
      kind: isAmendment ? `${kind} (corrected)` : kind,
      topic,
      title,
      filedOn: recent.filingDate[i],
      // Where the document lives on sec.gov: the company number, then the
      // filing number without its dashes, then the file name.
      url: `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession.replaceAll("-", "")}/${recent.primaryDocument[i]}`,
    });
  }

  return filings;
}
