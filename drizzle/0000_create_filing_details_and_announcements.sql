CREATE TABLE "announcements" (
	"url" text PRIMARY KEY NOT NULL,
	"cik" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "filing_details" (
	"accession" text PRIMARY KEY NOT NULL,
	"cik" text NOT NULL,
	"subject" text,
	"attachments" jsonb NOT NULL,
	"read_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "announcements_by_company_and_date" ON "announcements" USING btree ("cik","published_at");