// Reset demo runs for testing
export function resetDemoRuns() {
  if (typeof window === "undefined") return;
  
  // Clear ALL localStorage to ensure complete reset
  localStorage.clear();
  
  // Safari-specific: Also clear sessionStorage
  sessionStorage.clear();
  
  // Re-set the brand takeover data with unlimited runs
  const brandData = {
    enabled: true,
    brand: "tesla",
    primary: "#CC0000",
    logo: null,
    domain: "tesla",
    city: null,
    rep: null,
    firstName: null,
    role: null,
    expireDays: 7,
    runs: 999, // Set to unlimited
    blur: true,
    pilot: false,
    isDemo: true,
    _timestamp: Date.now()
  };
  
  localStorage.setItem('sunspire-brand-takeover', JSON.stringify(brandData));
  
  console.log("✅ Demo runs completely reset - you now have unlimited runs for testing");
  console.log("🔄 All localStorage cleared and brand data reset with unlimited access");
  
  // Safari-specific: Force a hard reload to ensure state is refreshed
  // Safari caches localStorage more aggressively than Chrome
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    console.log("🍎 Safari detected - forcing hard reload...");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}

// Make resetDemoRuns available globally for easy access from browser console
if (typeof window !== "undefined") {
  (window as any).resetDemoRuns = resetDemoRuns;
  console.log("🛠️ Demo reset function available globally as window.resetDemoRuns()");
}
