"use client";
const KEY="demo_quota_v3";
const AUTO_OPEN_KEY="demo_auto_open_v1";

export function usePreviewQuota(allowed:number=2){
  const link = typeof window !== "undefined" ? window.location.href : "link";
  
  function read(){
    if (typeof window === "undefined") return allowed;
    const map=JSON.parse(localStorage.getItem(KEY)||"{}");
    if(!(link in map)) map[link]=allowed;
    localStorage.setItem(KEY,JSON.stringify(map));
    return map[link];
  }
  
  function consume(){
    if (typeof window === "undefined") return;
    console.log('🔒 usePreviewQuota consume() called for link:', link);
    const map=JSON.parse(localStorage.getItem(KEY)||"{}");
    const currentRuns = map[link] ?? allowed;
    const newRuns = Math.max(0, currentRuns - 1);
    console.log('🔒 usePreviewQuota - currentRuns:', currentRuns, 'newRuns:', newRuns);
    map[link] = newRuns;
    localStorage.setItem(KEY,JSON.stringify(map));
    console.log('🔒 usePreviewQuota - updated map:', map);
    
    // Auto-open InstallSheet after first completed run
    if (currentRuns === allowed && newRuns < allowed) {
      const autoOpenMap = JSON.parse(sessionStorage.getItem(AUTO_OPEN_KEY) || "{}");
      if (!autoOpenMap[link]) {
        autoOpenMap[link] = true;
        sessionStorage.setItem(AUTO_OPEN_KEY, JSON.stringify(autoOpenMap));
        
        // Small delay to ensure smooth UX
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent("openInstall"));
        }, 1000);
      }
    }
  }
  
  return { read, consume };
}
