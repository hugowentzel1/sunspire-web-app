import { useState } from "react";
import { Card } from "@/components/ui/Card";

export default function EarningsMini() {
  const [clients, setClients] = useState(10);
  const recurring = clients * 30;   // $30 per client per month
  const setup = clients * 120;      // $120 per client one-time
  
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Earnings (example)</h3>
        <input 
          aria-label="Clients" 
          type="number" 
          min={1} 
          max={1000}
          value={clients} 
          onChange={e => setClients(Number(e.target.value || 0))}
          className="w-24 h-10 rounded-lg border border-neutral-300 px-3" 
        />
      </div>
      <p className="mt-4 text-neutral-700">
        {clients} clients → <b>${recurring}/mo recurring</b> + <b>${setup} setup</b>
      </p>
    </Card>
  );
}
