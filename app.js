(() => {
  "use strict";
  const MAX_SITES = 10;
  const frame = document.getElementById("site-frame");
  const state = document.getElementById("state");
  const heading = document.getElementById("state-heading");
  const message = document.getElementById("state-message");
  const stateLink = document.getElementById("state-link");
  const nameLabel = document.getElementById("site-name");
  const counter = document.getElementById("site-counter");
  const previous = document.getElementById("prev");
  const next = document.getElementById("next");
  const external = document.getElementById("open-external");
  let sites = [];
  let index = 0;
  function showState(title, description, link) {
    heading.textContent = title;
    message.textContent = description;
    state.hidden = false;
    stateLink.hidden = !link;
    if (link) stateLink.href = link;
  }
  function normalizeSite(entry) {
    if (!entry || typeof entry !== "object" || typeof entry.url !== "string") return null;
    try {
      const url = new URL(entry.url.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") return null;
      return { name: String(entry.name || url.hostname).trim().slice(0, 80), url: url.href };
    } catch { return null; }
  }
  function showSite() {
    if (!sites.length) {
      frame.removeAttribute("src");
      nameLabel.textContent = "Website viewer";
      counter.textContent = "0 / 0";
      previous.disabled = true;
      next.disabled = true;
      external.removeAttribute("href");
      external.setAttribute("aria-disabled", "true");
      showState("Your website showcase", "Add up to 10 websites to sites.json, then deploy the site.");
      return;
    }
    const site = sites[index];
    state.hidden = true;
    nameLabel.textContent = site.name;
    counter.textContent = `${index + 1} / ${sites.length}`;
    frame.title = site.name;
    frame.src = site.url;
    external.href = site.url;
    external.removeAttribute("aria-disabled");
    previous.disabled = sites.length < 2;
    next.disabled = sites.length < 2;
    const address = new URL(window.location.href);
    address.searchParams.set("site", String(index + 1));
    window.history.replaceState(null, "", address);
  }
  function navigate(delta) {
    if (sites.length < 2) return;
    index = (index + delta + sites.length) % sites.length;
    showSite();
  }
  previous.addEventListener("click", () => navigate(-1));
  next.addEventListener("click", () => navigate(1));
  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || ["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)) return;
    if (event.key === "ArrowLeft") navigate(-1);
    if (event.key === "ArrowRight") navigate(1);
  });
  async function init() {
    try {
      const response = await fetch("./sites.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load sites.json");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("sites.json must contain a JSON array");
      sites = data.slice(0, MAX_SITES).map(normalizeSite).filter(Boolean);
      const requested = Number.parseInt(new URLSearchParams(window.location.search).get("site"), 10);
      if (Number.isInteger(requested) && requested >= 1 && requested <= sites.length) index = requested - 1;
      showSite();
    } catch (error) {
      frame.removeAttribute("src");
      nameLabel.textContent = "Configuration error";
      counter.textContent = "0 / 0";
      previous.disabled = next.disabled = true;
      external.removeAttribute("href");
      showState("Could not load websites", "Check that sites.json contains a valid JSON array, then refresh.");
      console.error(error);
    }
  }
  init();
})();
