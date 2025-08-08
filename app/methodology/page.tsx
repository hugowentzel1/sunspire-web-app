'use client';

import { LegalFooter } from '@/components/legal/LegalFooter';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-app">
      <div className="container-premium py-12">
        <div className="max-w-4xl mx-auto space-premium">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-premium mb-4">
              Methodology & Sources
            </h1>
            <p className="text-lg text-muted-premium">
              Transparent solar estimation methodology and data sources
            </p>
          </div>

          <div className="card p-8 space-premium">
            <div>
              <h2 className="text-2xl font-bold text-premium mb-4">Solar Production Data</h2>
              <p className="text-muted-premium mb-4">
                All solar production estimates are generated using the National Renewable Energy Laboratory's 
                PVWatts® Calculator v8, which provides industry-standard solar irradiance and production data.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-premium">
                <li>NREL PVWatts® v8 Calculator</li>
                <li>NASA Surface Meteorology and Solar Energy (SSE) dataset</li>
                <li>30-year historical weather data</li>
                <li>Site-specific solar resource assessment</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-premium mb-4">Financial Assumptions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-premium mb-2">Federal Tax Credit (ITC)</h3>
                  <p className="text-muted-premium">30% of system cost after state rebates</p>
                </div>
                <div>
                  <h3 className="font-bold text-premium mb-2">System Cost</h3>
                  <p className="text-muted-premium">$3.00 per watt (industry average)</p>
                </div>
                <div>
                  <h3 className="font-bold text-premium mb-2">Panel Degradation</h3>
                  <p className="text-muted-premium">0.5% per year (NREL standard)</p>
                </div>
                <div>
                  <h3 className="font-bold text-premium mb-2">O&M Costs</h3>
                  <p className="text-muted-premium">$22 per kW per year</p>
                </div>
                <div>
                  <h3 className="font-bold text-premium mb-2">Electricity Rate Escalation</h3>
                  <p className="text-muted-premium">2.5% per year (historical average)</p>
                </div>
                <div>
                  <h3 className="font-bold text-premium mb-2">Discount Rate</h3>
                  <p className="text-muted-premium">7% (standard financial metric)</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-premium mb-4">Utility Rate Data</h2>
              <p className="text-muted-premium mb-4">
                Electricity rates are sourced from the U.S. Energy Information Administration (EIA) 
                when available, with state-specific fallback data for comprehensive coverage.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-premium">
                <li>EIA Annual Electric Power Industry Report</li>
                <li>Residential electricity prices by state</li>
                <li>Updated annually with latest available data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-premium mb-4">Environmental Impact</h2>
              <p className="text-muted-premium mb-4">
                CO₂ offset calculations are based on EPA emission factors for grid electricity generation.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-premium">
                <li>EPA eGRID emission factors</li>
                <li>0.85 lbs CO₂ per kWh avoided</li>
                <li>Regional grid mix considerations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-premium mb-4">Accuracy & Limitations</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 text-sm">
                  <strong>Important:</strong> These estimates are for informational purposes only and 
                  represent typical system performance. Actual results may vary based on site-specific 
                  conditions, equipment selection, installation quality, and local market factors. 
                  Always consult with qualified solar installers for detailed site assessments and 
                  accurate quotes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <LegalFooter />
    </div>
  );
}
