"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type PlaceResult = {
  formattedAddress: string; lat: number; lng: number; components: Record<string,string>; placeId: string;
};
type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (p: PlaceResult) => void;
  placeholder?: string; className?: string;
};

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder="Enter your address…", className="" }: Props){
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preds, setPreds] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [active, setActive] = useState(-1);
  const svcRef = useRef<google.maps.places.AutocompleteService>();
  const detailsRef = useRef<google.maps.places.PlacesService>();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number>();
  const suppressFetchRef = useRef<boolean>(false);
  const ignoreNextPredsRef = useRef<boolean>(false);

  // Log the key for debugging
  useEffect(() => {
    console.log('Google Maps API Key available:', !!key);
    if (!key) {
      setError('Google Maps API key is missing');
      return;
    }
  }, [key]);

  useEffect(() => {
    if (!key) return;
    
    setLoading(true);
    setError(null);
    let mounted = true;
    
    const loader = new Loader({ 
      apiKey: key, 
      version: "weekly", 
      libraries: ["places"] 
    });
    
    loader.load().then(() => {
      if (!mounted) return;
      console.log('Google Maps API loaded successfully');
      
      svcRef.current = new google.maps.places.AutocompleteService();
      detailsRef.current = new google.maps.places.PlacesService(document.createElement("div"));
      
      console.info("Places ready");
      setReady(true);
      setLoading(false);
    }).catch((e) => { 
      console.error("Places load failed", e);
      setError('Failed to load Google Places API. Check API key and referrers.');
      setLoading(false);
    });
    
    return () => { 
      mounted = false; 
      if (debounceRef.current) window.clearTimeout(debounceRef.current); 
    };
  }, [key]);

  useEffect(() => {
    if (!ready || !svcRef.current) return;
    // If we just selected an item programmatically, skip one fetch cycle
    if (suppressFetchRef.current) { suppressFetchRef.current = false; return; }
    if (!value || value.length < 1) { setPreds([]); return; }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      svcRef.current!.getPlacePredictions({ input: value, types: ["address"] }, (p) => {
        if (ignoreNextPredsRef.current) { ignoreNextPredsRef.current = false; return; }
        setPreds(p || []);
      });
      setActive(-1);
    }, 180);
  }, [value, ready]);

  function fetchDetails(placeId: string){
    if (!detailsRef.current) return;
    detailsRef.current.getDetails({ placeId, fields: ["formatted_address","address_components","geometry","place_id"] },
      (res, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !res) return;
        const components: Record<string,string> = {};
        (res.address_components || []).forEach(c => c.types.forEach(t => components[t]=c.long_name));
        onSelect({
          formattedAddress: res.formatted_address || "",
          lat: res.geometry?.location?.lat() ?? 0,
          lng: res.geometry?.location?.lng() ?? 0,
          components, placeId: res.place_id || placeId
        });
      });
  }
  function selectIdx(i:number){
    const p = preds[i]; if (!p) return;
    suppressFetchRef.current = true;
    ignoreNextPredsRef.current = true;
    if (debounceRef.current) { window.clearTimeout(debounceRef.current); }
    onChange(p.description);
    setPreds([]);
    setActive(-1);
    fetchDetails(p.place_id);
    // Blur to ensure any OS-level suggestion UI closes
    inputRef.current?.blur();
  }

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!containerRef.current?.contains(e.target as Node)) setPreds([]); };
    document.addEventListener("click", close); return () => document.removeEventListener("click", close);
  }, []);

  if (!key) {
    return (
      <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
        Google Maps key missing. Set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your env and redeploy.
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, preds.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && active >= 0) { e.preventDefault(); selectIdx(active); }
          else if (e.key === "Escape") { setPreds([]); }
        }}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-300 bg-white/70 px-4 py-3 text-[15px] shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
        aria-autocomplete="list" aria-expanded={preds.length > 0}
      />
      {preds.length > 0 && (
        <ul className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {preds.map((p, i) => (
            <li
              key={p.place_id}
              className={`cursor-pointer px-4 py-2 text-sm ${i===active?"bg-gray-100":"hover:bg-slate-50"}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); selectIdx(i); }}
            >{p.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
