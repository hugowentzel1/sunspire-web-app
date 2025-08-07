import { PVWattsResponse } from './pvwatts';
import { UtilityRate } from './rates';

export interface SolarEstimate {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  date: Date;
  
  // System specifications
  systemSizeKW: number;
  tilt: number;
  azimuth: number;
  losses: number;
  
  // Production data
  annualProductionKWh: number;
  monthlyProduction: number[];
  solarIrradiance: number;
  
  // Financial calculations
  grossCost: number;
  netCostAfterITC: number;
  year1Savings: number;
  paybackYear: number;
  npv25Year: number;
  
  // Environmental impact
  co2OffsetPerYear: number;
  
  // Utility data
  utilityRate: number;
  utilityRateSource: string;
  
  // Assumptions and methodology
  assumptions: {
    itcPercentage: number;
    costPerWatt: number;
    degradationRate: number;
    oandmPerKWYear: number;
    electricityRateIncrease: number;
    discountRate: number;
  };
  
  // 25-year cashflow projection
  cashflowProjection: {
    year: number;
    production: number;
    savings: number;
    cumulativeSavings: number;
    netCashflow: number;
  }[];
}

export interface EstimateRequest {
  lat: number;
  lng: number;
  address: string;
  systemKw?: number;
  tilt?: number;
  azimuth?: number;
  lossesPct?: number;
  stateCode?: string;
  zipCode?: string;
}

export function calculateSolarEstimate(
  pvwattsData: PVWattsResponse,
  utilityRate: UtilityRate,
  request: EstimateRequest
): SolarEstimate {
  // Get configurable parameters from environment variables
  const costPerWatt = parseFloat(process.env.DEFAULT_COST_PER_WATT || '3.00');
  const degradationRate = parseFloat(process.env.DEFAULT_DEGRADATION_PCT || '0.5') / 100;
  const oandmPerKWYear = parseFloat(process.env.OANDM_PER_KW_YEAR || '22');
  
  // Fixed assumptions
  const itcPercentage = 0.30; // 30% federal tax credit
  const electricityRateIncrease = 0.025; // 2.5% annual increase
  const discountRate = 0.07; // 7% discount rate for NPV
  
  // System specifications
  const systemSizeKW = request.systemKw || pvwattsData.inputs.system_capacity;
  const tilt = request.tilt || pvwattsData.inputs.tilt;
  const azimuth = request.azimuth || pvwattsData.inputs.azimuth;
  const losses = request.lossesPct || pvwattsData.inputs.losses;
  
  // Production data
  const annualProductionKWh = pvwattsData.outputs.ac_annual;
  const monthlyProduction = pvwattsData.outputs.ac_monthly;
  const solarIrradiance = pvwattsData.outputs.solrad_annual / 365;
  
  // Cost calculations
  const grossCost = systemSizeKW * 1000 * costPerWatt;
  const netCostAfterITC = grossCost * (1 - itcPercentage);
  
  // Year 1 savings calculation
  const annualOandMCost = systemSizeKW * oandmPerKWYear;
  const year1Savings = annualProductionKWh * utilityRate.rate - annualOandMCost;
  
  // 25-year cashflow projection
  const cashflowProjection = calculate25YearCashflow(
    annualProductionKWh,
    utilityRate.rate,
    annualOandMCost,
    degradationRate,
    electricityRateIncrease,
    netCostAfterITC
  );
  
  // Payback year calculation
  const paybackYear = calculatePaybackYear(cashflowProjection);
  
  // 25-year NPV calculation
  const npv25Year = calculateNPV25Year(cashflowProjection, discountRate);
  
  // CO2 offset calculation (lbs CO2 per kWh avoided)
  const co2PerKwh = 0.85; // EPA average for US grid
  const co2OffsetPerYear = Math.round(annualProductionKWh * co2PerKwh);
  
  return {
    id: Date.now().toString(),
    address: request.address,
    coordinates: { lat: request.lat, lng: request.lng },
    date: new Date(),
    
    systemSizeKW,
    tilt,
    azimuth,
    losses,
    
    annualProductionKWh,
    monthlyProduction,
    solarIrradiance: Math.round(solarIrradiance * 10) / 10,
    
    grossCost: Math.round(grossCost),
    netCostAfterITC: Math.round(netCostAfterITC),
    year1Savings: Math.round(year1Savings),
    paybackYear,
    npv25Year: Math.round(npv25Year),
    
    co2OffsetPerYear,
    
    utilityRate: utilityRate.rate,
    utilityRateSource: utilityRate.source,
    
    assumptions: {
      itcPercentage,
      costPerWatt,
      degradationRate,
      oandmPerKWYear,
      electricityRateIncrease,
      discountRate
    },
    
    cashflowProjection
  };
}

function calculate25YearCashflow(
  annualProduction: number,
  utilityRate: number,
  annualOandM: number,
  degradationRate: number,
  rateIncrease: number,
  netCost: number
) {
  const cashflow: SolarEstimate['cashflowProjection'] = [];
  let cumulativeSavings = 0;
  let currentRate = utilityRate;
  let degradationFactor = 1.0;
  
  for (let year = 1; year <= 25; year++) {
    // Apply degradation to production
    if (year > 1) {
      degradationFactor *= (1 - degradationRate);
    }
    
    const yearlyProduction = annualProduction * degradationFactor;
    const yearlySavings = yearlyProduction * currentRate - annualOandM;
    cumulativeSavings += yearlySavings;
    const netCashflow = cumulativeSavings - netCost;
    
    cashflow.push({
      year,
      production: Math.round(yearlyProduction),
      savings: Math.round(yearlySavings),
      cumulativeSavings: Math.round(cumulativeSavings),
      netCashflow: Math.round(netCashflow)
    });
    
    // Increase electricity rate
    currentRate *= (1 + rateIncrease);
  }
  
  return cashflow;
}

function calculatePaybackYear(cashflow: SolarEstimate['cashflowProjection']): number {
  for (const year of cashflow) {
    if (year.netCashflow >= 0) {
      return year.year;
    }
  }
  return 25; // If never reaches payback
}

function calculateNPV25Year(cashflow: SolarEstimate['cashflowProjection'], discountRate: number): number {
  let npv = 0;
  
  for (const year of cashflow) {
    const discountFactor = Math.pow(1 + discountRate, -year.year);
    npv += year.savings * discountFactor;
  }
  
  return npv;
}
