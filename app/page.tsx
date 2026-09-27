export default function Home() {
  return (
    <main>
      <h1>PCC Network</h1>
      <p>Proof of Counterfactual Contribution</p>
      <p>Prove what changed. Prove who caused it. Settle the value.</p>
    </main>
  );
}
"use client";

import { useState } from "react";
import { calculatePCC } from "@/lib/counterfactual";

export default function Home() {
  const [baseline, setBaseline] = useState(100000);
  const [observed, setObserved] = useState(127000);
  const [counterfactual, setCounterfactual] = useState(108000);
  const [uncertainty, setUncertainty] = useState(3200);

  const result = calculatePCC({
    baseline,
    observed,
    counterfactual,
    uncertainty,
    contributorShares: [0.6, 0.25, 0.15],
  });

  return (
    <main className="dashboard">
      <section className="hero">
        <p className="eyebrow">PCC NETWORK v0.1</p>

        <h1>Proof of Counterfactual Contribution</h1>

        <p className="tagline">
          Prove what changed. Prove who caused it. Settle the value.
        </p>
      </section>

      <section className="status-bar">
        <span>● SYSTEM ONLINE</span>
        <span>PRE-COMMITMENT ENGINE</span>
        <span>COUNTERFACTUAL ENGINE</span>
        <span>RECEIPT ENGINE</span>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Counterfactual Contract</h2>

          <label>
            Baseline Outcome
            <input
              type="number"
              value={baseline}
              onChange={(e) => setBaseline(Number(e.target.value))}
            />
          </label>

          <label>
            Observed Outcome
            <input
              type="number"
              value={observed}
              onChange={(e) => setObserved(Number(e.target.value))}
            />
          </label>

          <label>
            Counterfactual Outcome
            <input
              type="number"
              value={counterfactual}
              onChange={(e) => setCounterfactual(Number(e.target.value))}
            />
          </label>

          <label>
            Uncertainty
            <input
              type="number"
              value={uncertainty}
              onChange={(e) => setUncertainty(Number(e.target.value))}
            />
          </label>

          <div className="locked">
            🔒 Measurement methodology locked before settlement
          </div>
        </div>

        <div className="panel result-panel">
          <p className="eyebrow">VERIFIED RESULT</p>

          <h2>Incremental Effect</h2>

          <div className="big-number">
            ${result.incrementalEffect.toLocaleString()}
          </div>

          <div className="range">
            <span>Lower Bound</span>
            <strong>${result.lowerBound.toLocaleString()}</strong>
          </div>

          <div className="range">
            <span>Upper Bound</span>
            <strong>${result.upperBound.toLocaleString()}</strong>
          </div>

          <div className="confidence">
            Confidence Range: {result.confidenceBand}
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">ATTRIBUTION</p>

        <h2>Contributor Allocation</h2>

        <div className="contributors">
          <div>
            <strong>Contributor A</strong>
            <span>60%</span>
            <b>${result.attributedValue[0].toLocaleString()}</b>
          </div>

          <div>
            <strong>Contributor B</strong>
            <span>25%</span>
            <b>${result.attributedValue[1].toLocaleString()}</b>
          </div>

          <div>
            <strong>Contributor C</strong>
            <span>15%</span>
            <b>${result.attributedValue[2].toLocaleString()}</b>
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">PROTOCOL CHAIN</p>

        <div className="chain">
          <span>BASELINE</span>
          <i>→</i>
          <span>INTERVENTION</span>
          <i>→</i>
          <span>EVIDENCE</span>
          <i>→</i>
          <span>COUNTERFACTUAL</span>
          <i>→</i>
          <span>INCREMENTAL EFFECT</span>
          <i>→</i>
          <span>ATTRIBUTION</span>
          <i>→</i>
          <span>SETTLEMENT</span>
        </div>
      </section>

      <section className="receipt">
        <p className="eyebrow">COUNTERFACTUAL CONTRIBUTION RECEIPT</p>

        <h2>PCC Receipt Ready</h2>

        <p>
          The current calculation can be converted into a tamper-evident
          Counterfactual Contribution Receipt after evidence verification.
        </p>

        <div className="receipt-hash">
          PCC-DEMO-{Math.abs(result.incrementalEffect).toString(16).toUpperCase()}
        </div>
      </section>
    </main>
  );
}