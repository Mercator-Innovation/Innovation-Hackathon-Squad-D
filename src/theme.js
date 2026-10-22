// Display settings: dark mode, high contrast and colours for colour blindness.
// Loads in the <head> so the page never flashes the wrong colours.
// Starts with the computer's own settings, then remembers the person's choices.
// The colours for each setting are in display.css.
(function () {
  const root = document.documentElement;
  const media = (q) => window.matchMedia && window.matchMedia(q).matches;

  function saved(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function remember(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* fine: kept for this visit */ }
  }

  root.dataset.theme = saved("damp-theme") || (media("(prefers-color-scheme: dark)") ? "dark" : "light");
  root.dataset.contrast = saved("damp-contrast") || (media("(prefers-contrast: more)") ? "high" : "standard");
  root.dataset.colours = saved("damp-colours") || "standard";

  document.addEventListener("DOMContentLoaded", function () {
    const dark = document.getElementById("set-dark");
    const contrast = document.getElementById("set-contrast");
    const colours = document.getElementById("set-colours");
    if (!dark || !contrast || !colours) return;

    dark.checked = root.dataset.theme === "dark";
    contrast.checked = root.dataset.contrast === "high";
    colours.value = root.dataset.colours;

    dark.addEventListener("change", function () {
      root.dataset.theme = dark.checked ? "dark" : "light";
      remember("damp-theme", root.dataset.theme);
    });
    contrast.addEventListener("change", function () {
      root.dataset.contrast = contrast.checked ? "high" : "standard";
      remember("damp-contrast", root.dataset.contrast);
    });
    colours.addEventListener("change", function () {
      root.dataset.colours = colours.value;
      remember("damp-colours", colours.value);
    });
  });
})();
