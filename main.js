/* ============================================================
   Main script: builds header/footer, handles language switching
   ============================================================ */

// ---- Add your real contact details here (leave "" to hide them) ----
const CONFIG = {
  email: "",
  phone: ""
};

// Clean addresses: "team" opens team.html on GitHub Pages
const PAGES = [
  ["index", "nav_home"],
  ["team", "nav_team"],
  ["news", "nav_news"],
  ["achievements", "nav_awards"],
  ["contact", "nav_contact"]
];

const LANGS = [["en", "EN"], ["uz", "UZ"], ["ru", "RU"]];

function getLang() {
  try {
    const saved = localStorage.getItem("eco_lang");
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch (e) {}
  return "en";
}

let currentLang = getLang();

function t(key) {
  const own = TRANSLATIONS[currentLang];
  if (own && Object.prototype.hasOwnProperty.call(own, key)) return own[key];
  if (Object.prototype.hasOwnProperty.call(TRANSLATIONS.en, key)) return TRANSLATIONS.en[key];
  return key;
}

function currentPage() {
  const file = location.pathname.split("/").pop().replace(/\.html$/, "");
  return file === "" ? "index" : file;
}

function renderHeader() {
  const here = currentPage();
  const links = PAGES.map(([slug, key]) =>
    `<a href="${slug === "index" ? "./" : slug}" data-i18n="${key}" class="${slug === here ? "active" : ""}"></a>`
  ).join("");
  const langs = LANGS.map(([code, label]) =>
    `<button type="button" data-lang="${code}">${label}</button>`
  ).join("");

  const leaf = `<svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#3fae6a"/>
      <path d="M12 34c0-12 8-20 24-20 0 14-8 22-20 22" fill="#f7faf5"/>
      <path d="M13 35c6-8 12-12 20-16" stroke="#1f7a4d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`;

  document.getElementById("site-header").innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="./">${leaf}
        <span><span data-i18n="site_name"></span><small data-i18n="school_name"></small></span>
      </a>
      <nav class="nav" id="nav">${links}</nav>
      <div class="header-right">
        <div class="lang-switch">${langs}</div>
        <button class="menu-toggle" id="menu-toggle" aria-label="Menu">☰</button>
      </div>
    </div>`;

  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("nav").classList.toggle("open");
  });
  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

function renderFooter() {
  document.getElementById("site-footer").innerHTML =
    `<div class="container"><p data-i18n="footer_text"></p></div>`;
}

function applyLang() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
  const pageKey = document.body.dataset.title;
  if (pageKey) document.title = t(pageKey) + " | " + t("site_name");
}

function setLang(code) {
  currentLang = code;
  try { localStorage.setItem("eco_lang", code); } catch (e) {}
  applyLang();
}

function show(id, yes) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("hidden", !yes);
}

function setupContact() {
  if (!document.getElementById("contact-list")) return;

  const hasEmail = !!CONFIG.email;
  const hasPhone = !!CONFIG.phone;

  const emailEl = document.getElementById("contact-email");
  if (hasEmail) { emailEl.textContent = CONFIG.email; emailEl.href = "mailto:" + CONFIG.email; }
  const phoneEl = document.getElementById("contact-phone");
  if (hasPhone) { phoneEl.textContent = CONFIG.phone; phoneEl.href = "tel:" + CONFIG.phone.replace(/\s/g, ""); }

  show("contact-email-item", hasEmail);
  show("contact-phone-item", hasPhone);
  show("contact-form-card", hasEmail);
  show("contact-soon", !hasEmail && !hasPhone);
  show("contact-info-card", hasEmail || hasPhone || true);

  const form = document.getElementById("contact-form");
  if (form && hasEmail) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = form.elements["name"].value;
      const email = form.elements["email"].value;
      const msg = form.elements["message"].value;
      const subject = encodeURIComponent("Eco Committee website: " + name);
      const body = encodeURIComponent(msg + "\n\n" + name + "\n" + email);
      location.href = "mailto:" + CONFIG.email + "?subject=" + subject + "&body=" + body;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  setupContact();
  applyLang();
});
