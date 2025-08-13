"use client";
const KEY="demo_quota_v3";
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
    const map=JSON.parse(localStorage.getItem(KEY)||"{}");
    map[link]=Math.max(0,(map[link]??allowed)-1);
    localStorage.setItem(KEY,JSON.stringify(map));
  }
  return { read, consume };
}
