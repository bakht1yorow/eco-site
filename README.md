# Eco Committee Website

A free static website in English, Uzbek and Russian.
Pages: Home, Our Team, Eco Projects, News & Events, Achievements / Awards, Contact.

## 1. Edit your content

| What | Where |
|---|---|
| All texts (3 languages), school name, news, awards | `translations.js` |
| Email and phone | top of `main.js` (`CONFIG`) |
| Colors | top of `style.css` (`:root` variables) |
| Team photos | put images next to the HTML files and replace the emoji in `team.html` with `<img src="name.jpg" alt="">` |

The texts, numbers, names, news and awards are SAMPLES. Replace them with your real information.
Every text exists three times (en, uz, ru). Change all three.

## 2. Free hosting (use your own domain greenaissance.uz)

### Option A: GitHub Pages (recommended, works with AHOST DNS)
1. Create a free account at github.com and a new public repository, for example `eco-site`.
2. Upload ALL files from this folder (all files are in one folder, no subfolders).
3. Repository Settings > Pages > Deploy from branch > `main` / root > Save.
4. In the same page, under Custom domain, write `greenaissance.uz` and save. Tick "Enforce HTTPS" when it appears.
5. In AHOST, open your domain > DNS hosting tab and add these records:
   - Four A records for `@` with values: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One CNAME record: name `www`, value `YOUR-GITHUB-USERNAME.github.io`
6. Wait 10 minutes to a few hours. Then open https://greenaissance.uz

### Option B: Cloudflare Pages (free)
1. Create a free account at cloudflare.com > Workers & Pages > Create > Pages > Upload assets.
2. Upload this folder (or the zip) and deploy.
3. Open Custom domains and add `greenaissance.uz`. Cloudflare will show the DNS records (or nameservers) to enter in AHOST.

## 3. Important
- Pay the unpaid invoice in AHOST so the domain stays active. Renewal is due 15.12.2026.
- The contact form opens the visitor's email app. It does not store messages on a server.
