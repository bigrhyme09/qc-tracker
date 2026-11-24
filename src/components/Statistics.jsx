import { useState } from "react";
import StatisticLine from "./StatisticLine";

export default function Statistics({
  styleName,
  approve,
  revision,
  reject,
  allStyles = [],
  allRecords = {},
}) {
  const [copied, setCopied] = useState(false);

  const total = approve + revision + reject;

  const inspectedStyles = allStyles.filter((style) => {
    const rec = allRecords[style];
    return rec && rec.approve + rec.revision + rec.reject > 0;
  });

  const visitTotals = inspectedStyles.reduce(
    (acc, style) => {
      const rec = allRecords[style];
      acc.approve += rec.approve;
      acc.revision += rec.revision;
      acc.reject += rec.reject;
      return acc;
    },
    { approve: 0, revision: 0, reject: 0 }
  );

  const visitTotalSamples =
    visitTotals.approve + visitTotals.revision + visitTotals.reject;

  const visitApprovalRate =
    visitTotalSamples > 0
      ? ((visitTotals.approve / visitTotalSamples) * 100).toFixed(1)
      : "0.0";

  const handleCopySummary = () => {
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const lines = [
      `HRM ATTIRES / EMSB — SHOWROOM & FACTORY QC VISIT SUMMARY (${dateStr})`,
      `Total Inspected: ${visitTotalSamples} | Approved: ${visitTotals.approve} \vert{} Revision:${visitTotals.revision} | Rejected: ${visitTotals.reject} \vert{} Overall Pass Rate:${visitApprovalRate}%`,
      `------------------------------------------------------------`,
      ...inspectedStyles.map((style) => {
        const r = allRecords[style];
        const sTotal = r.approve + r.revision + r.reject;
        const rate = ((r.approve / sTotal) * 100).toFixed(0);
        const status = Number(rate) >= 80 ? "BULK APPROVED" : "REVISION HOLD";
        return `• ${style}:${r.approve} Approved, ${r.revision} Revision,${r.reject} Reject (${rate}\% —${status})`;
      }),
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Style Reference",
      "Approved",
      "Needs Revision",
      "Rejected",
      "Total Inspected",
      "Approval Rate (%)",
      "Production Verdict",
    ];

    const rows = inspectedStyles.map((style) => {
      const r = allRecords[style];
      const sTotal = r.approve + r.revision + r.reject;
      const rate = ((r.approve / sTotal) * 100).toFixed(1);
      const verdict =
        Number(rate) >= 80 ? "Approved for Bulk" : "Tech Pack Revision Needed";
      return [`"${style}"`, r.approve, r.revision, r.reject, sTotal, rate, `"${verdict}"`].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `QC-Visit-Summary-${new Date().toISOString().slice(0, 10)}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); };  if (visitTotalSamples === 0) { return ( <div className="empty-state"> No data collected yet for <strong>{styleName}</strong>. Click a button above to log a sample. </div> ); }  const approvalRate = total > 0 ? ((approve / total) * 100).toFixed(1) : "0.0"; const batchVerdict = Number(approvalRate) >= 80 ? "Verdict: Approved for Bulk Production" : "Verdict: Hold — Tech Pack Revision Needed";  return ( <section className="stats-section"> {total === 0 ? ( <div className="empty-state" style={{ marginBottom: "1.5rem" }}> No samples logged yet for <strong>{styleName}</strong>. </div> ) : ( <> <h2>Active Style — {styleName}</h2> <table className="stats-table"> <tbody> <StatisticLine text="Approved" value={approve} /> <StatisticLine text="Needs Revision" value={revision} /> <StatisticLine text="Rejected" value={reject} /> <StatisticLine text="Total Samples Inspected" value={total} /> <StatisticLine text="Approval Rate" value={`${approvalRate}%`} />
            </tbody>
          </table>
          <div className="verdict-badge">{batchVerdict}</div>
        </>
      )}

      <div className="visit-rollup">
        <h3>
          Full Visit Rollup ({inspectedStyles.length}{" "}
          {inspectedStyles.length === 1 ? "Style" : "Styles"} / {visitTotalSamples} Samples — {visitApprovalRate}% Pass)
        </h3>

        <ul className="visit-list">
          {inspectedStyles.map((style) => {
            const r = allRecords[style];
            const sTotal = r.approve + r.revision + r.reject;
            const rate = Math.round((r.approve / sTotal) * 100);
            return (
              <li key={style}>
                <span>{style.split("—")[0].trim()}</span>
                <span>
                  {r.approve}A / {r.revision}Rev / {r.reject}Rej ({rate}%)
                </span>
              </li>
            );
          })}
        </ul>

        <div className="export-actions">
          <button type="button" onClick={handleCopySummary} className="btn-export">
            {copied ? "Copied to Clipboard!" : "Copy Visit Report"}
          </button>
          <button type="button" onClick={handleDownloadCSV} className="btn-export btn-csv">
            Download CSV
          </button>
        </div>
      </div>
    </section>
  );
}