import { useState } from "react";
import Button from "./components/Button";
import Statistics from "./components/Statistics";

const DEFAULT_STYLES = [
  "EMSB-REF0301 — 480GSM Heavyweight Fleece Hoodie",
  "EMSB-REF0401 — Straight-Leg Fleece Sweatpants",
  "EMSB-REF-1301 — 280GSM Boxy Heavyweight Tee",
  "BUR-REF-1702 — Brushed Cotton Twill Work Jacket",
  "BUR-REF-1704 — Relaxed French Terry Crewneck",
];

const emptyCounts = () => ({ approve: 0, revision: 0, reject: 0 });

export default function App() {
  const [styles, setStyles] = useState(DEFAULT_STYLES);
  const [selectedStyle, setSelectedStyle] = useState(DEFAULT_STYLES[0]);
  const [records, setRecords] = useState(() =>
    Object.fromEntries(DEFAULT_STYLES.map((s) => [s, emptyCounts()]))
  );
  const [newStyleInput, setNewStyleInput] = useState("");

  const currentStats = records[selectedStyle] || emptyCounts();

  const updateCount = (category) =>
    setRecords((prev) => ({
      ...prev,
      [selectedStyle]: {
        ...prev[selectedStyle],
        [category]: prev[selectedStyle][category] + 1,
      },
    }));

  const handleReset = () =>
    setRecords((prev) => ({ ...prev, [selectedStyle]: emptyCounts() }));

  const handleAddStyle = (e) => {
    e.preventDefault();
    const trimmed = newStyleInput.trim();
    if (!trimmed || styles.includes(trimmed)) return;
    setStyles((prev) => [...prev, trimmed]);
    setRecords((prev) => ({ ...prev, [trimmed]: emptyCounts() }));
    setSelectedStyle(trimmed);
    setNewStyleInput("");
  };

  const handleRemoveStyle = () => {
    if (styles.length <= 1) return;
    const updated = styles.filter((s) => s !== selectedStyle);
    const { [selectedStyle]: _, ...remaining } = records;
    setStyles(updated);
    setRecords(remaining);
    setSelectedStyle(updated[0]);
  };

  return (
    <>
      <div className="bg-stage" aria-hidden="true">
        <div className="ruler-top">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="ruler-tick-h">
              <span>{i}&quot;</span>
            </div>
          ))}
        </div>

        <div className="ruler-left">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="ruler-tick-v">
              <span>{i * 2.5}cm</span>
            </div>
          ))}
        </div>

        <div className="drafting-mark mark-1">✛ BIAS 45° / GRAINLINE</div>
        <div className="drafting-mark mark-2">✂ SEAM ALLOWANCE 1/2&quot;</div>
        <div className="drafting-mark mark-3">✛ CF / CB ALIGNMENT</div>
        <div className="swatch-orb orb-1" />
        <div className="swatch-orb orb-2" />
      </div>

      <main className="container">
        <header className="header">
          <span className="batch-tag">SHOWROOM &amp; FACTORY QC</span>
          <h1>Garment Sample Tracker</h1>
          <p>Select a style below and log each physical sample inspection</p>
        </header>

        <div className="style-selector">
          <label htmlFor="garment-select">Active Style Reference:</label>
          <div className="selector-row">
            <select
              id="garment-select"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
            >
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRemoveStyle}
              className="btn-remove"
              disabled={styles.length <= 1}
              title="Remove selected style"
            >
              Remove
            </button>
          </div>

          <form onSubmit={handleAddStyle} className="add-style-form">
            <input
              type="text"
              placeholder="Add new style (e.g. EMSB-REF-1805 — Zip Hoodie)"
              value={newStyleInput}
              onChange={(e) => setNewStyleInput(e.target.value)}
            />
            <button type="submit" className="btn-add">
              + Add Style
            </button>
          </form>
        </div>

        <div className="button-group">
          <Button handleClick={() => updateCount("approve")} text="Approve" />
          <Button handleClick={() => updateCount("revision")} text="Revision" />
          <Button handleClick={() => updateCount("reject")} text="Reject" />
          <Button handleClick={handleReset} text="Reset" variant="reset" />
        </div>

        <Statistics
          styleName={selectedStyle}
          approve={currentStats.approve}
          revision={currentStats.revision}
          reject={currentStats.reject}
          allStyles={styles}
          allRecords={records}
        />
      </main>
    </>
  );
}