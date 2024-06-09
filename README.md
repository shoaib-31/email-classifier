# Gmail Email Classifier

This project is a Next.js application that allows users to log in with Google, fetch their Gmail emails, and classify them using the OpenAI API. The project uses Google OAuth for authentication, and Recoil for state management.

## Table of Contents

- [Getting Started](#getting-started)
- [Setting Up Google OAuth Credentials](#setting-up-google-oauth-credentials)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)

## Getting Started

### Cloning the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/shoaib-31/gmail-email-classifier.git
cd gmail-email-classifier
npm install
```

# Setting Up Google OAuth Credentials

This guide will help you set up Google OAuth credentials for your application.

## Creating Google OAuth Client ID and Secret

1. **Go to the Google Cloud Console**

   - Navigate to [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a new project or select an existing project**

   - Click on the project dropdown in the top menu and select **New Project**.
   - Enter the project name and click **Create**.
   - If you already have a project, select it from the list.

3. **Navigate to APIs & Services > Credentials**

   - In the left sidebar, go to **APIs & Services** and then **Credentials**.

4. **Click on Create Credentials and select OAuth 2.0 Client ID**

   - Click on the **Create Credentials** button.
   - Choose **OAuth 2.0 Client ID** from the dropdown.

5. **Configure the OAuth consent screen**

   - You will be prompted to configure the OAuth consent screen.
   - Set up the OAuth consent screen with your app details (app name, user support email, etc.).
   - Add the required scopes:
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/gmail.readonly`
   - Save and continue.

6. **Create an OAuth client ID**

   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback`
   - Click **Create**.

7. **Get your Client ID and Client Secret**
   - After creating the credentials, you will be provided with a **Client ID** and **Client Secret**.
   - Save these for later use in your application configuration.

### Adding Test Users

While your app is in testing mode, you need to add test users:

1. **Go to APIs & Services > OAuth consent screen**

   - In the left sidebar, go to **APIs & Services** and then **OAuth consent screen**.

2. **Scroll down to the Test users section**

   - Scroll down to find the **Test users** section.

3. **Add the email addresses of the users who should have access to the app during the testing phase**
   - Click **Add Users** and enter the email addresses.
   - Save your changes.

### Environment Variables

Create a .env.local file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

Replace your-google-client-id, your-google-client-secret, and your-jwt-secret with the values you obtained from the Google Cloud Console and your preferred JWT secret.

## Running the App

Run the development server:

```
npm run dev
```

Open http://localhost:3000 in your browser to see the application.

### Usage

- Navigate to the login page and click "Login with Google".
- Authorize the application to access your Google account.
- After logging in, you will be redirected to the /classify page.
- On the /classify page, you can fetch and classify your emails.

**Note**: On runnning the app, if emails are not fetched for the first time Please logout and login again.
