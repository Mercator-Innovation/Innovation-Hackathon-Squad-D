// Dark mode. Loads in the <head> so the page never flashes the wrong colours.
// Starts with the computer's own setting, then remembers the person's choice.
(function () {
  const KEY = "damp-theme";
  const root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) { /* fine: kept for this visit */ }
  }

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved() || (prefersDark ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    const show = () => {
      const dark = root.dataset.theme === "dark";
      button.setAttribute("aria-pressed", dark ? "true" : "false");
      button.textContent = "Dark mode: " + (dark ? "on" : "off");
    };
    button.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      remember(root.dataset.theme);
      show();
    });
    show();
  });
})();
