"use client";

import { useMemo, useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import { calculatePCC } from "@/lib/counterfactual";
import { createCommitmentHash } from "@/lib/commitment";
import { getPCCContract } from "@/lib/web3";

export default function Home() {
  const [contractName, setContractName] = useState(
    "PCC Demonstration Contract"
  );
  const [baseline, setBaseline] = useState(100000);
  const [observed, setObserved] = useState(127000);
  const [counterfactual, setCounterfactual] = useState(108000);
  const [uncertainty, setUncertainty] = useState(3200);

  const [locked, setLocked] = useState(false);
  const [commitmentHash, setCommitmentHash] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [hashing, setHashing] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(
    () =>
      calculatePCC({
        baseline,
        observed,
        counterfactual,
        uncertainty,
        contributorShares: [0.6, 0.25, 0.15],
      }),
    [baseline, observed, counterfactual, uncertainty]
  );

  const methodology =
    "Observed minus counterfactual with precommitted uncertainty and fixed attribution shares.";

  const contractId = useMemo(() => {
    const raw = `${contractName}-${baseline}-${counterfactual}`;

    return `PCC-${Array.from(raw)
      .reduce(
        (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
        0
      )
      .toString(16)
      .replace("-", "0")
      .toUpperCase()}`;
  }, [contractName, baseline, counterfactual]);

  async function lockContract() {
    if (locked || hashing) return;

    setHashing(true);
    setError("");
    setTransactionHash("");

    try {
      const hash = await createCommitmentHash({
        contractName,
        baseline,
        counterfactual,
        uncertainty,
        methodology,
        attribution: [0.6, 0.25, 0.15],
      });


const contract = await getPCCContract();

const { connectWallet } = await import("@/lib/web3");
const wallet = await connectWallet();

setWalletAddress(wallet.address);
      const contractIdHash = keccak256(toUtf8Bytes(contractId));
      const methodologyHash = keccak256(toUtf8Bytes(methodology));

      const transaction = await contract.lockContract(
        contractIdHash,
        `0x${hash}`,
        methodologyHash
      );

      setTransactionHash(transaction.hash);

      await transaction.wait();

      setCommitmentHash(hash);
      setLocked(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Blockchain transaction failed.";

      setError(message);
    } finally {
      setHashing(false);
    }
  }

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
        <span>
          {locked ? "PRE-COMMITMENT LOCKED" : "CONTRACT DRAFT"}
        </span>
        <span>BASE SEPOLIA</span>
        <span>COUNTERFACTUAL ENGINE</span>
      </section>

      <section className="panel">
        <p className="eyebrow">STEP 01</p>

        <h2>Create Counterfactual Contract</h2>

        <label>
          Contract Name
          <input
            type="text"
            value={contractName}
            disabled={locked}
            onChange={(e) => setContractName(e.target.value)}
          />
        </label>

        <label>
          Baseline Outcome
          <input
            type="number"
            value={baseline}
            disabled={locked}
            onChange={(e) => setBaseline(Number(e.target.value))}
          />
        </label>

        <label>
          Counterfactual Outcome
          <input
            type="number"
            value={counterfactual}
            disabled={locked}
            onChange={(e) => setCounterfactual(Number(e.target.value))}
          />
        </label>

        <label>
          Measurement Uncertainty
          <input
            type="number"
            value={uncertainty}
            disabled={locked}
            onChange={(e) => setUncertainty(Number(e.target.value))}
          />
        </label>

        <div className="locked">
          {locked
            ? "🔒 Contract parameters are cryptographically committed on Base Sepolia."
            : "🔐 Review all parameters before creating the blockchain commitment."}
        </div>

        <button
          type="button"
          onClick={lockContract}
          disabled={locked || hashing}
        >
          {hashing
            ? "SUBMITTING TO BASE SEPOLIA..."
            : locked
              ? "PRE-COMMITMENT LOCKED"
              : "CREATE BLOCKCHAIN COMMITMENT"}
        </button>

        {walletAddress && (
          <p>
            Wallet: <strong>{walletAddress}</strong>
          </p>
        )}

        {transactionHash && (
          <p>
            Transaction: <strong>{transactionHash}</strong>
          </p>
        )}

        {error && (
          <div className="locked">
            Transaction error: {error}
          </div>
        )}
      </section>

      <section className="grid">
        <div className="panel result-panel">
          <p className="eyebrow">STEP 02</p>

          <h2>Observed Outcome</h2>

          <label>
            Actual Result
            <input
              type="number"
              value={observed}
              disabled={!locked}
              onChange={(e) => setObserved(Number(e.target.value))}
            />
          </label>

          <h3>Incremental Effect</h3>

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
            Uncertainty: {result.confidenceBand}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">STEP 03</p>

          <h2>Contract Identity</h2>

          <div className="receipt-hash">{contractId}</div>

          <p>
            This identifies the PCC contract configuration.
          </p>

          <div className="locked">
            {locked
              ? "✓ Contract configuration committed on Base Sepolia"
              : "Waiting for blockchain commitment"}
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">STEP 04</p>

        <h2>Pre-Commitment Hash</h2>

        <p>
          This SHA-256 hash commits the contract parameters and methodology
          before settlement.
        </p>

        <div className="receipt-hash">
          {commitmentHash || "COMMITMENT NOT CREATED"}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">STEP 05</p>

        <h2>Contributor Attribution</h2>

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
        <p className="eyebrow">PROTOCOL</p>

        <div className="chain">
          <span>BASELINE</span>
          <i>→</i>
          <span>PRE-COMMITMENT</span>
          <i>→</i>
          <span>INTERVENTION</span>
          <i>→</i>
          <span>EVIDENCE</span>
          <i>→</i>
          <span>COUNTERFACTUAL</span>
          <i>→</i>
          <span>ATTRIBUTION</span>
          <i>→</i>
          <span>SETTLEMENT</span>
          <i>→</i>
          <span>CCR</span>
        </div>
      </section>

      <section className="receipt">
        <p className="eyebrow">
          COUNTERFACTUAL CONTRIBUTION RECEIPT
        </p>

        <h2>
          {locked
            ? "Cryptographic Receipt Preparation Ready"
            : "Receipt Awaiting Commitment"}
        </h2>

        <p>
          The final CCR will link the contract commitment, evidence,
          counterfactual calculation, attribution, verification and settlement
          state.
        </p>

        <div className="receipt-hash">
          {commitmentHash
            ? `CCR-${commitmentHash.slice(0, 32).toUpperCase()}`
            : "AWAITING PRE-COMMITMENT"}
        </div>
      </section>
    </main>
  );
}