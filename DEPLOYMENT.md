# SKSSF Muttipadi Online Quiz - Deployment Guide

This guide covers how to set up the backend database (Google Sheets) and deploy the frontend application.

## 1. Backend Setup (Google Sheets + Apps Script)

You will use Google Sheets as a database to store student answers.

1.  Go to [Google Sheets](https://sheets.google.com) and create a **Blank spreadsheet**.
2.  Name the spreadsheet something like **"SKSSF Quiz Responses"**.
3.  In the first row (headers), add the following columns:
    *   Column A: `Timestamp`
    *   Column B: `Reference Number`
    *   Column C: `Register Number`
    *   Column D: `Name`
    *   Column E: `Phone`
    *   Column F: `Email`
    *   Column G: `Score`
    *   Column H: `Question 1 Answer`
    *   Column I: `Question 2 Answer`
    *   *(Add more columns depending on the number of questions)*
4.  In the top menu, click **Extensions > Apps Script**.
5.  Delete the existing code in the editor and copy-paste the entire contents of `backend/Code.gs` from this project into the editor.
6.  **IMPORTANT:** At the very top of `Code.gs`, you will see a `CORRECT_ANSWERS` block. You MUST update this object with the correct answers for your actual questions to enable automatic grading. (Correct = +2, Wrong = -1).
7.  Click the **Save** icon.
7.  Click the **Deploy** button in the top right corner, and select **New deployment**.
8.  Click the **Select type** gear icon and choose **Web app**.
9.  Fill out the details:
    *   **Description**: Initial Release
    *   **Execute as**: Me
    *   **Who has access**: Anyone
10. Click **Deploy**. (You may need to authorize the script to access your Google account).
11. Copy the **Web app URL** generated at the end.
12. In your local project, create a file named `.env` in the root folder and add this line:
    ```
    VITE_GAS_URL="YOUR_WEB_APP_URL_HERE"
    ```
    (Replace the URL with the one you copied).

---

## 2. Setting Up the Questions

1. Open `src/utils/questions.ts`.
2. Add your questions inside the `quizQuestions` array.

---

## 3. Frontend Deployment (Netlify - Recommended)

Netlify is the easiest way to deploy this application for free.

1.  Create a GitHub account and push this project to a new repository.
2.  Go to [Netlify](https://www.netlify.com/) and sign up.
3.  Click **Add new site** > **Import an existing project**.
4.  Connect your GitHub account and select the repository.
5.  Netlify will automatically detect the settings (`npm run build` and `dist` directory).
6.  Click **Add environment variables** and add:
    *   Key: `VITE_GAS_URL`
    *   Value: *(Your Google Apps Script Web App URL)*
7.  Click **Deploy site**.
8.  Once deployed, you can change the domain name in the site settings.

---

## Alternative: Frontend Deployment (GitHub Pages)

If you prefer GitHub pages:

1.  Open `vite.config.ts` and add `base: '/your-repo-name/'`, inside the configuration object.
2.  Install the gh-pages package: `npm install -D gh-pages`
3.  In `package.json`, add this to scripts: `"deploy": "gh-pages -d dist"`
4.  Run `npm run build`
5.  Run `npm run deploy`
6.  Make sure to configure your `VITE_GAS_URL` in the `.env` file before building.
