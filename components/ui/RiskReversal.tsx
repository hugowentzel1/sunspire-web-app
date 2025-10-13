import React from "react";

export default function RiskReversal({ id }: { id?: string }) {
  return (
    <p
      id={id ?? "risk-reversal"}
      className="mt-2 text-sm opacity-80 text-center leading-snug"
    >
      14-day money-back guarantee. Cancel anytime.
    </p>
  );
}
