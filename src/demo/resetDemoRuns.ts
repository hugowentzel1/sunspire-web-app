// Reset demo runs for testing
export function resetDemoRuns() {
  if (typeof window === "undefined") return;
  
  // Reset all demo quota systems
  localStorage.removeItem("demo_quota_v5");
  localStorage.removeItem("demo_runs_left");
  localStorage.removeItem("sunspire_demo_quota");
  localStorage.removeItem("sunspire_demo_quota_v1");
  localStorage.removeItem("demo_auto_open_v1");
  
  console.log("✅ Demo runs reset - you now have unlimited runs for testing");
}
