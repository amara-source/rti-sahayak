import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { buildApplicationPdf } from "../application-pdf";

const input = {
  authorityName: "Department of Pension and Pensioners' Welfare",
  officer: "Central Public Information Officer",
  ministry: "Ministry of Personnel, Public Grievances and Pensions",
  body: "Please provide certified copies of the file notings, movement record and current status of the pending pension application.",
  registrationNumber: "DOPTR/E/2026/04417",
  date: "25 August 2026",
  simulated: true,
};

describe("application PDF", () => {
  it("produces a real PDF document", async () => {
    const bytes = await buildApplicationPdf(input);
    expect(bytes.byteLength).toBeGreaterThan(1000);
    // %PDF- magic number
    expect(Array.from(bytes.slice(0, 5))).toEqual([37, 80, 68, 70, 45]);
  });

  it("reloads as a valid one page document with the right title", async () => {
    // Content streams are compressed, so read the document back rather than
    // scraping bytes for glyphs.
    const bytes = await buildApplicationPdf(input);
    const reloaded = await PDFDocument.load(bytes);
    expect(reloaded.getPageCount()).toBe(1);
    expect(reloaded.getTitle()).toBe(
      "Application under the Right to Information Act 2005",
    );
    const page = reloaded.getPage(0);
    expect(Math.round(page.getWidth())).toBe(595);
    expect(Math.round(page.getHeight())).toBe(842);
  });

  it("wraps long text onto more than one line without throwing", async () => {
    const long = { ...input, body: "word ".repeat(600).trim() };
    const bytes = await buildApplicationPdf(long);
    expect(bytes.byteLength).toBeGreaterThan(2000);
  });

  it("works without the optional fields", async () => {
    const minimal = {
      authorityName: "The public authority concerned",
      officer: "Central Public Information Officer",
      body: "Provide the file notings.",
      date: "25 August 2026",
      simulated: true,
    };
    await expect(buildApplicationPdf(minimal)).resolves.toBeInstanceOf(Uint8Array);
  });
});
