export function ensureBlurSupport() {
  if (typeof window === "undefined") return;
  const test = document.createElement("div");
  test.style.backdropFilter = "blur(1px)";
  const supported = !!test.style.backdropFilter || (CSS && CSS.supports && (CSS.supports("backdrop-filter: blur(1px)") || CSS.supports("-webkit-backdrop-filter: blur(1px)")));
  document.documentElement.classList.toggle("no-backdrop-filter", !supported);
}
