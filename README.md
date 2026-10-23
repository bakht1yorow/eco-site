# Eco Committee Website

A free static website in English, Uzbek and Russian (greenaissance.uz), Bukhara Presidential School.
All files sit in one folder. Pages: Home, Our Team, Eco Projects, News & Events, Achievements / Awards, Contact.

## How to change things

| What | Where |
|---|---|
| All texts (3 languages): team roles, projects, news, goals/awards | `translations.js` |
| Email and phone (leave empty to hide) | top of `main.js` (`CONFIG`) |
| Colors | top of `style.css` (`:root` variables) |
| Team photos | put images next to the HTML files and replace the emoji in `team.html` with `<img src="name.jpg" alt="">` |

Every text exists three times (en, uz, ru). Change all three.
When you add an email in `CONFIG`, the contact form appears automatically.

## How to update the live site
Open github.com/bakht1yorow/eco-site/upload, drag in the changed files and click Commit changes.
