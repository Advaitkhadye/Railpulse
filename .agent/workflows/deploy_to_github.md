---
description: How to deploy the RailPulse app to GitHub Pages
---

# Deploying RailPulse to GitHub Pages

Follow these steps to deploy your Vite + React application to GitHub Pages.

## 1. Create a GitHub Repository
1.  Go to [GitHub.com](https://github.com) and log in.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  Name your repository (e.g., `railpulse-tracker`).
4.  Make it **Public** (required for free GitHub Pages).
5.  Click **Create repository**.

## 2. Configure Vite
You need to set the base path in `vite.config.ts` to match your repository name.

1.  Open `vite.config.ts`.
2.  Add the `base` property:
    ```typescript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vite.dev/config/
    export default defineConfig({
      plugins: [react()],
      base: '/railpulse-tracker/', // REPLACE 'railpulse-tracker' WITH YOUR REPO NAME
    })
    ```

## 3. Push Code to GitHub
Run the following commands in your terminal (VS Code):

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Link to your GitHub repo (replace URL with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/railpulse-tracker.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## 4. Deploy
You can deploy manually or set up a workflow. The easiest manual way for Vite is using the `gh-pages` package.

### Option A: Using `gh-pages` package (Recommended)
1.  Install the package:
    ```bash
    npm install gh-pages --save-dev
    ```
2.  Add a deploy script to `package.json`:
    ```json
    "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "lint": "eslint .",
      "preview": "vite preview",
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
    }
    ```
3.  Run the deploy command:
    ```bash
    npm run deploy
    ```

### Option B: GitHub Actions (Automated)
1.  In your repo on GitHub, go to **Settings** > **Pages**.
2.  Under **Build and deployment**, select **GitHub Actions**.
3.  Search for "Static HTML" or "Vite" and configure it.

## 5. Verify
After deployment, your app will be live at:
`https://YOUR_USERNAME.github.io/railpulse-tracker/`
