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
  ["projects", "nav_projects"],
  ["news", "nav_news"],
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

  document.getElementById("site-header").innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="./"><img src="logo.png" alt="Greenaissance Eco-Committee BPS"></a>
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
    `<div class="container"><img src="logo.png" alt=""><p data-i18n="footer_text"></p></div>`;
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

// Gentle reveal on scroll (cards and photo strip only)
(function(){
  if(!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  document.documentElement.classList.add("js");
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.08});
  addEventListener("load",()=>document.querySelectorAll(".grid-3>.card,.strip a,.cta,.member").forEach(el=>{el.classList.add("reveal");io.observe(el);}));
})();
