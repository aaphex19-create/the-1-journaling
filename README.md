# THE 1% - Elite Quantitative Execution Journal & Trading Terminal

## GitHub Pages Deployment Guide

To deploy this project to GitHub Pages without a blank screen, use either of the two methods below:

### Option A: GitHub Actions (Recommended, 100% Automated)
1. In your GitHub repository, navigate to **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &gt; **Source**, change the dropdown to **GitHub Actions**.
3. That's it! The included `.github/workflows/deploy.yml` workflow will automatically build and publish your site whenever you push to `main` or `master`.

---

### Option B: Deploy from `/docs` Folder (Instant, No Actions Needed)
The repository build creates a pre-compiled `/docs` folder ready for GitHub Pages:
1. In your GitHub repository, navigate to **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &gt; **Source**, select **Deploy from a branch**.
3. Under **Branch**, select `main` (or `master`) and select the **`/docs`** folder from the folder dropdown.
4. Click **Save**. GitHub Pages will be live within 30 seconds.

---

### Google Sign-In on GitHub Pages
To enable Google Sign-In on your live GitHub Pages URL:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project: `gen-lang-client-0556616496`.
3. Go to **Authentication** &rarr; **Settings** &rarr; **Authorized domains**.
4. Click **Add domain** and enter your GitHub Pages domain (e.g., `<your-username>.github.io`).
