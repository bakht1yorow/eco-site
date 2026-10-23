/* ============================================================
   Main script: builds header/footer, handles language switching
   ============================================================ */

// ---- Change these to your real contact details ----
const CONFIG = {
  email: "eco@yourschool.uz",
  phone: "+998 00 000 00 00"
};

const PAGES = [
  ["index.html", "nav_home"],
  ["team.html", "nav_team"],
  ["projects.html", "nav_projects"],
  ["news.html", "nav_news"],
  ["achievements.html", "nav_awards"],
  ["contact.html", "nav_contact"]
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
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
         TRANSLATIONS.en[key] || key;
}

function currentPage() {
  const file = location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function renderHeader() {
  const here = currentPage();
  const links = PAGES.map(([href, key]) =>
    `<a href="${href}" data-i18n="${key}" class="${href === here ? "active" : ""}"></a>`
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
      <a class="brand" href="index.html">${leaf}
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
  // Page title: "<page name> | <site name>"
  const pageKey = document.body.dataset.title;
  if (pageKey) document.title = t(pageKey) + " | " + t("site_name");
}

function setLang(code) {
  currentLang = code;
  try { localStorage.setItem("eco_lang", code); } catch (e) {}
  applyLang();
}

function setupContact() {
  const emailEl = document.getElementById("contact-email");
  if (emailEl) { emailEl.textContent = CONFIG.email; emailEl.href = "mailto:" + CONFIG.email; }
  const phoneEl = document.getElementById("contact-phone");
  if (phoneEl) { phoneEl.textContent = CONFIG.phone; phoneEl.href = "tel:" + CONFIG.phone.replace(/\s/g, ""); }

  const form = document.getElementById("contact-form");
  if (form) {
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
