# PCC Network v0.1

## Proof of Counterfactual Contribution

**Tagline:** Prove what changed. Prove who caused it. Settle the value.

---

## 1. Purpose

PCC Network is a protocol for measuring and settling the incremental value of an intervention against a precommitted counterfactual.

The protocol is designed to prevent parties from changing the measurement rules after seeing the outcome.

---

## 2. Core Principle

Observed change is not automatically causal impact.

The basic PCC calculation is:

**Incremental Effect = Observed Outcome − Counterfactual Outcome**

Example:

- Baseline: $100,000
- Observed outcome: $127,000
- Counterfactual outcome: $108,000
- Incremental effect: $19,000
- Uncertainty: ±$3,200

The $19,000 represents the estimated incremental effect before applying attribution and settlement rules.

---

## 3. Pre-Commitment

Before an intervention occurs, the parties commit to:

1. Baseline definition
2. Intervention definition
3. Measurement period
4. Evidence sources
5. Counterfactual methodology
6. Attribution rules
7. Uncertainty thresholds
8. Settlement formula
9. Dispute rules

The commitment is represented by cryptographic hashes.

Once locked, the methodology cannot be silently changed after the result is known.

---

## 4. Evidence

Evidence may include:

- Financial records
- Sensor measurements
- Advertising data
- Energy consumption
- Logistics records
- Software telemetry
- AI-generated measurements
- Third-party data-provider attestations

Sensitive raw evidence can remain off-chain.

The blockchain records hashes and references that allow later verification without exposing confidential information.

---

## 5. Attribution

PCC can support multiple contributors.

Example:

- Contributor A: 60%
- Contributor B: 25%
- Contributor C: 15%

If verified incremental effect is $19,000:

- A: $11,400
- B: $4,750
- C: $2,850

Attribution percentages must satisfy the precommitted rules.

---

## 6. Counterfactual Contribution Receipt

After settlement, PCC produces a Counterfactual Contribution Receipt (CCR).

A CCR can contain:

- Contract ID
- Baseline commitment
- Intervention commitment
- Measurement period
- Evidence references
- Methodology hash
- Observed outcome
- Counterfactual outcome
- Incremental effect
- Uncertainty range
- Contributor attribution
- Settlement result
- Verification attestations
- Final receipt hash

The receipt provides a tamper-evident record of how the result was determined.

---

## 7. On-Chain Data

The blockchain should store only information required for verification and settlement.

Potential on-chain data:

- Contract ID
- Participant identifiers
- Pre-commitment hash
- Methodology hash
- Evidence hashes
- Timestamps
- Verifier attestations
- Dispute events
- Settlement state
- Final receipt hash

---

## 8. Off-Chain Data

Potential off-chain data:

- Personally identifiable information
- Customer records
- Proprietary business information
- Raw financial records
- Sensor datasets
- Confidential documents
- Proprietary analytical models

Only cryptographic references or hashes need to be anchored on-chain.

---

## 9. Protocol Flow

```text
REAL WORLD
    ↓
INTERVENTION
    ↓
PRE-COMMITMENT
    ↓
EVIDENCE COLLECTION
    ↓
COUNTERFACTUAL ANALYSIS
    ↓
VERIFICATION
    ↓
INCREMENTAL EFFECT
    ↓
ATTRIBUTION
    ↓
SETTLEMENT
    ↓
COUNTERFACTUAL CONTRIBUTION RECEIPT