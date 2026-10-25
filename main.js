/* ============================================================
   Main script: builds header/footer, handles language switching
   ============================================================ */

// ---- Add your real contact details here (leave "" to hide them) ----
const CONFIG = {
  email: "",
  telegram: "https://t.me/ecoschoolbukhps",
  instagram: "https://www.instagram.com/greenaissance.bps/",
  phone: ""
};

// Clean addresses: "team" opens team.html on GitHub Pages
const PAGES = [
  ["index", "nav_home"],
  ["team", "nav_team"],
  ["projects", "nav_projects"],
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

  document.getElementById("site-header").innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="./"><img src="logo-light.png" alt="Greenaissance Eco-Committee BPS"></a>
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
  const links = PAGES.map(([slug, key]) =>
    `<a href="${slug === "index" ? "./" : slug}" data-i18n="${key}"></a>`).join("");
  const soc = [];
  if (CONFIG.telegram) soc.push(`<a class="soc soc-tg" href="${CONFIG.telegram}" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24"><path fill="#fff" d="M9.4 15.6l-.4 4.1c.6 0 .8-.3 1.1-.5l2.6-2.4 5.4 4c1 .5 1.7.3 2-.9l3.6-16.7c.3-1.5-.5-2-1.5-1.7L1.1 10.7c-1.4.5-1.4 1.3-.2 1.7l5.5 1.7 12.7-8c.6-.4 1.1-.2.7.2z"/></svg></a>`);
  if (CONFIG.instagram) soc.push(`<a class="soc soc-ig" href="${CONFIG.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.3" cy="6.7" r="1.2" fill="#fff" stroke="none"/></svg></a>`);
  document.getElementById("site-footer").innerHTML =
    `<div class="container foot">
       <div class="foot-brand"><img src="logo-light.png" alt=""><p data-i18n="footer_text"></p></div>
       <nav class="foot-links">${links}</nav>
       <div class="foot-soc">${soc.join("")}</div>
     </div>`;
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

  const tg=document.getElementById("cc-telegram"), ig=document.getElementById("cc-instagram"), em=document.getElementById("cc-email");
  if (tg) { tg.classList.toggle("hidden", !CONFIG.telegram); if (CONFIG.telegram) tg.href = CONFIG.telegram; }
  if (ig) { ig.classList.toggle("hidden", !CONFIG.instagram); if (CONFIG.instagram) ig.href = CONFIG.instagram; }
  if (em) { em.classList.toggle("hidden", !hasEmail); if (hasEmail) { em.href = "mailto:" + CONFIG.email; document.getElementById("cc-email-val").textContent = CONFIG.email; } }
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

