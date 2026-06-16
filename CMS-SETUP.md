# Works CMS — Setup (Sanity)

Your Works grid and case-study pages can be managed from a hosted CMS (Sanity).
The website reads content live from Sanity at runtime — no rebuild or redeploy needed
when you add or edit a project. Until you finish step 4, the site shows the built-in
static content as a fallback, so nothing breaks in the meantime.

## What's already wired up
- `studio/` — the Sanity Studio (your editing app) with a **Project / Case Study** schema.
- `assets/cms.js` — fetches content and renders the Works grid + case-study pages.
- `assets/cms-config.js` — where you paste your Project ID.
- `work/case.html` — the template every case study renders into (`work/case.html?slug=...`).

---

## 1. Create a Sanity project
1. Go to **https://www.sanity.io/manage** and sign up / log in (free).
2. Create a **new project**. Name it "Outliers at Play". Use the default dataset **`production`**.
3. Copy the **Project ID** (looks like `a1b2c3d4`).

## 2. Paste the Project ID in 3 places
Replace `YOUR_PROJECT_ID` with your real ID in:
- `assets/cms-config.js`
- `studio/sanity.config.js`
- `studio/sanity.cli.js`

## 3. Run the Studio (the editor)
You'll need [Node.js](https://nodejs.org) installed (LTS is fine).

```bash
cd studio
npm install
npx sanity login        # opens a browser to log in
npm run dev             # open http://localhost:3333 and start adding projects
```

To get a **hosted** editor you can use from anywhere:
```bash
npm run deploy          # pick a hostname → https://<name>.sanity.studio
```

## 4. Let the website read your content
Two one-time settings so the public site can fetch from Sanity:

```bash
cd studio
# allow your live site (and local testing) to read content
npx sanity cors add https://outlierdesign-lab.github.io
npx sanity cors add http://localhost:3000
# make the dataset publicly readable
npx sanity dataset visibility set production public
```

(You can also do both from the **API** tab in https://www.sanity.io/manage.)

## 5. Go live
Commit the updated `assets/cms-config.js` (with your real Project ID) and push.
The Works grid and case studies now come from Sanity. ✅

---

## Adding a project
In the Studio, create a **Project / Case Study** and fill in:
- **Title**, **Slug** (auto from title), **Order** (lower = first)
- **Card subtitle**, **Funding badge** (optional), **Cover image**
- Case-study fields: kicker, tagline, client/services/stage/year/timeline,
  overview, challenge paragraphs, two-up gallery, "what we did" bullets,
  feature image, outcome, quote, and results.

Each project is automatically reachable at `work/case.html?slug=<your-slug>` and
appears in the homepage Works grid. The "Next project" link follows the **Order** field.

## Notes
- Images are served from Sanity's CDN, resized automatically.
- The old hand-built pages (`work/blend-app.html`, etc.) still exist as a fallback and
  can be deleted once you've recreated those projects in the CMS.
