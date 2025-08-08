import incentives from "@/data/incentives.json" assert { type: "json" };
import type { PvwattsOut } from "./pvwatts";
import type { RateResult } from "./rates";

export interface SolarEstimate {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  date: string | Date;

  // system
  systemSizeKW: number;
  tilt: number;
  azimuth: number;
  losses: number;

  // production
  annualProductionKWh: number;
  monthlyProduction: number[];
  solarIrradiance: number;

  // finance
  grossCost: number;
  netCostAfterITC: number;
  year1Savings: number;
  paybackYear: number | null;
  npv25Year: number;

  // env
  co2OffsetPerYear: number;

  // utility
  utilityRate: number;
  utilityRateSource: string;

  // assumptions shown in UI
  assumptions: {
    itcPercentage: number;
    costPerWatt: number;
    degradationRate: number;
    oandmPerKWYear: number;
    electricityRateIncrease: number;
    discountRate: number;
  };

  // for chart
  cashflowProjection: {
    year: number;
    production: number;
    savings: number;
    cumulativeSavings: number;
    netCashflow: number;
  }[];
}

export type BuildInputs = {
  address: string;
  lat: number; lng: number;
  stateCode?: string;
  pv: PvwattsOut;
  rate: RateResult;
  systemKw: number;
  tilt: number;
  azimuth: number;
  lossesPct: number;
};

export function buildEstimate({
  address, lat, lng, stateCode, pv, rate, systemKw, tilt, azimuth, lossesPct
}: BuildInputs): SolarEstimate {
  const costPerWatt = num(process.env.DEFAULT_COST_PER_WATT, 3.0);
  const degr = num(process.env.DEFAULT_DEGRADATION_PCT, 0.5) / 100;
  const oandmPerKW = num(process.env.OANDM_PER_KW_YEAR, 22);
  const rateEsc = num(process.env.DEFAULT_RATE_ESCALATION, 0.025);
  const oandmEsc = num(process.env.DEFAULT_OANDM_ESCALATION, 0.02);
  const discount = num(process.env.DISCOUNT_RATE, 0.07);

  // Incentives (rebate BEFORE ITC)
  const itcPct = incentives["US"]?.itc_pct ?? 0.30;
  const stateReb = stateCode ? (incentives as any)[stateCode] : undefined;
  const rebatePerWatt = stateReb?.rebate_per_watt ?? 0;
  const rebateFlat = stateReb?.rebate_flat ?? 0;

  const capex = systemKw * 1000 * costPerWatt;
  const rebate = rebateFlat + rebatePerWatt * systemKw * 1000;
  const itc = itcPct * Math.max(0, capex - rebate);
  const netCost = Math.max(0, capex - rebate - itc);

  const annualKWh = pv.annual_kwh;
  const monthlyKWh = pv.monthly_kwh.map((n) => Math.round(n));

  // Cashflow 25 years
  const oandm0 = oandmPerKW * systemKw;
  let cumulative = -netCost;
  const cashflowProjection = [];
  let npv = -netCost;

  for (let y = 1; y <= 25; y++) {
    const prodY = annualKWh * Math.pow(1 - degr, y - 1);
    const rateY = rate.rate * Math.pow(1 + rateEsc, y - 1);
    const oandmY = oandm0 * Math.pow(1 + oandmEsc, y - 1);
    const savingsY = prodY * rateY;
    const netY = savingsY - oandmY;
    cumulative += netY;
    npv += netY / Math.pow(1 + discount, y);
    cashflowProjection.push({
      year: y,
      production: Math.round(prodY),
      savings: Math.round(savingsY),
      cumulativeSavings: Math.round(Math.max(0, cumulative + netCost)), // cumulative pre-capex if you need
      netCashflow: Math.round(cumulative)
    });
  }

  const paybackYear = cashflowProjection.find((p) => p.netCashflow >= 0)?.year ?? null;
  const co2Offset = Math.round(annualKWh * 0.85); // lbs CO2 avoided (Year 1)

  return {
    id: Date.now().toString(),
    address,
    coordinates: { lat, lng },
    date: new Date().toISOString(),

    systemSizeKW: systemKw,
    tilt, azimuth, losses: lossesPct,

    annualProductionKWh: Math.round(annualKWh),
    monthlyProduction: monthlyKWh,
    solarIrradiance: round2(pv.solrad_kwh_m2_day), // kWh/m²/day

    grossCost: Math.round(capex),
    netCostAfterITC: Math.round(netCost),
    year1Savings: Math.round(annualKWh * rate.rate - oandm0),
    paybackYear,
    npv25Year: Math.round(npv),

    co2OffsetPerYear: co2Offset,

    utilityRate: round3(rate.rate),
    utilityRateSource: rate.source,

    assumptions: {
      itcPercentage: itcPct,
      costPerWatt,
      degradationRate: degr,
      oandmPerKWYear: oandmPerKW,
      electricityRateIncrease: rateEsc,
      discountRate: discount
    },

    cashflowProjection
  };
}

function num(v: string|undefined, dflt: number) {
  const n = Number(v); return Number.isFinite(n) ? n : dflt;
}
function round2(n: number) { return Math.round(n * 100) / 100; }
function round3(n: number) { return Math.round(n * 1000) / 1000; }
