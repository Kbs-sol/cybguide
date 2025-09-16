# \ud83d\ude80 CYB Guide 3.0 - Complete Setup Guide for Beginners

## \ud83c\udf1f Welcome! This Guide is For You If:
- \u2705 You want to set up CYB Guide but don't know much about coding
- \u2705 You've never used GitHub, Cloudflare, or APIs before
- \u2705 You want step-by-step instructions with screenshots and explanations
- \u2705 You need everything explained in simple terms

## \ud83d\udccb Table of Contents
1. [What You'll Need](#what-youll-need)
2. [Account Setup](#account-setup)
3. [Getting the Code](#getting-the-code)
4. [Setting Up API Keys](#setting-up-api-keys)
5. [Deploying to Cloudflare](#deploying-to-cloudflare)
6. [Testing Your Site](#testing-your-site)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance--updates)

---

## \ud83d\udecd\ufe0f What You'll Need

### Required (Free)
- \ud83d\udcbb Computer with internet connection
- \ud83d\udce7 Email address for account creation
- \u23f0 About 30-60 minutes of time
- \ud83d\udcf1 Phone (for 2-factor authentication)

### Optional (Enhanced Features)
- \ud83d\udcb3 Credit card (for upgraded AI features - most features work without this)

---

## \ud83d\udd10 Account Setup

### Step 1: Create GitHub Account
GitHub is where the code lives. Think of it like Google Drive for programmers.

1. Go to [github.com](https://github.com)
2. Click **"Sign up"**
3. Choose a username (e.g., "johndoe_cybguide")
4. Enter your email and create a strong password
5. Verify your email when GitHub sends you a message

**\ud83d\udcdd Why GitHub?** This is where we store and manage the website code. It's like having a backup of your website that you can always access.

### Step 2: Create Cloudflare Account
Cloudflare will host your website for free and make it super fast worldwide.

1. Go to [cloudflare.com](https://cloudflare.com)
2. Click **"Sign up"**
3. Use the same email as GitHub (makes things easier)
4. Verify your email
5. You'll see a dashboard - don't worry about it for now

**\ud83d\udcdd Why Cloudflare?** They provide free website hosting that's incredibly fast and secure. Your website will load instantly anywhere in the world.

### Step 3: Create Google Account (If Needed)
You'll need this for some of the AI features and user authentication.

1. If you don't have Gmail, create one at [gmail.com](https://gmail.com)
2. Remember these login details - you'll need them later

---

## \ud83d\udcbe Getting the Code

### Step 1: Fork the Repository
"Forking" means making your own copy of the code that you can modify.

1. Go to the GitHub repository: [github.com/surisettidev/new4.2](https://github.com/surisettidev/new4.2)
2. Click the **"Fork"** button in the top right
3. Choose your GitHub account as the destination
4. Wait for it to copy (usually takes 30 seconds)
5. You now have your own copy at `github.com/YOUR_USERNAME/new4.2`

**\ud83d\udcdd What just happened?** You now own a complete copy of the CYB Guide website code. You can modify it however you want without affecting the original.

---

## \ud83d\udd11 Setting Up API Keys

API keys are like passwords that let different services talk to each other. Don't worry - we'll set up the free ones first!

### Step 1: Google OAuth Setup
This lets users log in with their Google account.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **"Create Project"**
3. Name it "CYB Guide" (or whatever you like)
4. Wait for it to create (about 1 minute)
5. In the sidebar, click **"APIs & Services"** \u2192 **"Credentials"**
6. Click **"Create Credentials"** \u2192 **"OAuth 2.0 Client ID"**
7. Choose **"Web application"**
8. For **"Authorized redirect URIs"**, add:
   - `http://localhost:3000/auth/google/callback`
   - `https://YOUR-SITE-NAME.pages.dev/auth/google/callback` (you'll get this URL later)
9. Click **"Create"**
10. **SAVE THESE NUMBERS:** You'll get a "Client ID" and "Client Secret" - write them down!

### Step 2: Discord OAuth Setup (Optional)
This lets users log in with Discord.

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Name it "CYB Guide"
4. Go to **"OAuth2"** tab
5. Under **"Redirects"**, add:
   - `http://localhost:3000/auth/discord/callback`
   - `https://YOUR-SITE-NAME.pages.dev/auth/discord/callback`
6. **SAVE THESE:** Copy the "Client ID" and "Client Secret"

### Step 3: AI API Keys (Optional but Recommended)

#### OpenAI (Most Popular)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up with your email
3. Go to **"API Keys"**
4. Click **"Create new secret key"**
5. **SAVE THIS KEY** - you can't see it again!
6. **Cost:** Usually $5-10/month for moderate usage

#### OpenRouter (Cheaper Alternative)
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up with GitHub or email
3. Go to **"Keys"** tab
4. Click **"Create Key"**
5. **SAVE THIS KEY**
6. **Cost:** Usually $1-3/month for the same usage

#### Google Search API (For Enhanced AI)
1. Go back to [console.cloud.google.com](https://console.cloud.google.com)
2. In the same project, go to **"APIs & Services"** \u2192 **"Library"**
3. Search for "Custom Search API"
4. Click it and click **"Enable"**
5. Go to **"Credentials"** \u2192 **"Create Credentials"** \u2192 **"API Key"**
6. **SAVE THIS KEY**
7. Go to [cse.google.com](https://cse.google.com)
8. Click **"Add"**
9. In "Sites to search", add: `*.reddit.com`
10. Click **"Create"**
11. **SAVE THE SEARCH ENGINE ID** (looks like: `017576662512468239146:omuauf_lfve`)

---

## \u2601\ufe0f Deploying to Cloudflare

### Step 1: Install Wrangler CLI
Wrangler is Cloudflare's tool for managing websites. We'll install it through their web interface.

1. Go to your Cloudflare dashboard
2. Click **"Workers & Pages"**
3. Click **"Create Application"**
4. Click **"Pages"** tab
5. Click **"Connect to Git"**

### Step 2: Connect GitHub
1. Click **"Connect GitHub"**
2. Authorize Cloudflare to access your GitHub
3. Select your forked repository (`YOUR_USERNAME/new4.2`)
4. Click **"Begin setup"**

### Step 3: Configure Build Settings
1. **Framework preset:** Select "Vite"
2. **Build command:** `npm run build`
3. **Build output directory:** `dist`
4. Click **"Save and Deploy"**

### Step 4: Wait for First Build
- This takes 2-5 minutes
- You'll see a progress bar
- When it's done, you'll get a URL like `https://cyb-guide-abc123.pages.dev`

### Step 5: Add Environment Variables
Now we'll add all those API keys you saved earlier.

1. Go to your Pages project dashboard
2. Click **"Settings"** tab
3. Click **"Environment variables"**
4. For each key you have, click **"Add variable"**:

**Required Variables:**
```
ADMIN_PASSWORD = Yethical
JWT_SECRET = your_random_32_character_string_here_12345
```

**OAuth Variables (if you set them up):**
```
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
DISCORD_CLIENT_ID = your_discord_client_id
DISCORD_CLIENT_SECRET = your_discord_client_secret
```

**AI Variables (if you have them):**
```
OPENAI_API_KEY = your_openai_key
OPENROUTER_API_KEY = your_openrouter_key
SEARCH_API_KEY = your_google_search_key
SEARCH_ENGINE_ID = your_search_engine_id
```

### Step 6: Redeploy
1. Go to **"Deployments"** tab
2. Click **"Retry deployment"** on the latest one
3. Wait for it to finish

---

## \u2705 Testing Your Site

### Step 1: Basic Functionality Test
1. Visit your site URL (something like `https://cyb-guide-abc123.pages.dev`)
2. You should see a dark, hacker-themed website
3. Try accepting the responsibility modal
4. Navigate between different sections

### Step 2: Assessment Quiz Test
1. Click **"Retake Assessment"** in the Learning Guide section
2. Go through the quiz questions
3. Check that you get assigned a learning pathway
4. Verify that learning cards appear

### Step 3: AI Assistant Test
1. Go to the **"AI Assistant Terminal"** section
2. Try typing a question like "What is SQL injection?"
3. If you set up AI keys, you should get detailed responses
4. If not, you'll get built-in responses (still very helpful!)

### Step 4: Konami Code Test
1. On any page, type this sequence: **\u2b06 \u2b06 \u2b07 \u2b07 \u2b05 \u27a1 \u2b05 \u27a1 B A Enter**
2. OR click the terminal icon in the top-left 5 times quickly
3. You should see a notification and a secret admin button appear

### Step 5: Admin Dashboard Test
1. After triggering the Konami code, click the secret button
2. OR go directly to `https://your-site.pages.dev/admin`
3. Enter password: `Yethical`
4. You should see the admin dashboard

---

## \ud83d\ude91 Troubleshooting

### Common Issues & Solutions

#### "Site won't load" or "404 Error"
**Cause:** Build failed or wrong settings
**Solution:** 
1. Go to Cloudflare Pages dashboard
2. Check "Deployments" tab for errors
3. Make sure build settings are: Framework=Vite, Build command=`npm run build`, Output=`dist`

#### "AI Assistant says 'unavailable'"
**Cause:** No AI API keys set up
**Solution:** 
1. This is normal if you didn't set up AI keys
2. The built-in responses still work great!
3. To fix: Add AI API keys in Environment Variables and redeploy

#### "Google login doesn't work"
**Cause:** OAuth redirect URLs don't match
**Solution:**
1. Go back to Google Cloud Console
2. Update redirect URLs to use your actual site URL
3. Make sure both localhost AND your Pages URL are added

#### "Assessment quiz doesn't save progress"
**Cause:** Browser storage disabled
**Solution:**
1. Make sure your browser allows localStorage
2. Try a different browser
3. Check if you're in incognito/private mode

#### "Konami code doesn't work"
**Cause:** Wrong key sequence or timing
**Solution:**
1. Try the click method: Click terminal icon 5 times quickly
2. Make sure you press keys in exact order: \u2b06\u2b06\u2b07\u2b07\u2b05\u27a1\u2b05\u27a1BA Enter
3. Try refreshing the page and trying again

---

## \ud83d\udd04 Maintenance & Updates

### Weekly Checks
- \u2705 Visit your site to make sure it's working
- \u2705 Check Cloudflare dashboard for any issues
- \u2705 Review admin dashboard for user activity

### Monthly Tasks
- \u2705 Check API usage costs (if using paid APIs)
- \u2705 Update admin password from default "Yethical"
- \u2705 Review and export user logs from admin dashboard

### Getting Updates
When new features are added to CYB Guide:

1. Go to the original repository: [github.com/surisettidev/new4.2](https://github.com/surisettidev/new4.2)
2. Click **"Sync fork"** button on your forked repository
3. This will update your copy with new features
4. Cloudflare will automatically rebuild and deploy the updates

---

## \ud83c\udf86 Advanced Features Unlocked!

### What You Now Have:
- \u2728 **Adaptive Learning System:** AI-powered assessment that customizes learning paths
- \ud83d\udcbb **Terminal AI Assistant:** Real-time cybersecurity guidance with search integration
- \ud83c\udfd7\ufe0f **Interactive Learning Cards:** Progress tracking with gamification elements
- \ud83d\udcc5 **Live Timeline:** Real-time events and announcements
- \ud83d\udc65 **Community Hub:** Discord-style interface for collaboration
- \ud83d\udd79\ufe0f **Secret Admin Access:** Hidden dashboard with comprehensive analytics
- \ud83d\udd12 **Enterprise Security:** Activity logging and user management

### Your Site Features:
- **Professional Grade:** Enterprise-level security and performance
- **Global CDN:** Lightning-fast loading worldwide via Cloudflare
- **Mobile Optimized:** Perfect experience on all devices
- **SEO Optimized:** Google-friendly for maximum visibility
- **Accessibility Compliant:** WCAG compatible for all users

---

## \ud83d\udd17 Important Links to Bookmark

### Your Resources:
- **Your Website:** `https://your-site-name.pages.dev`
- **Admin Dashboard:** `https://your-site-name.pages.dev/admin`
- **GitHub Repository:** `https://github.com/YOUR_USERNAME/new4.2`
- **Cloudflare Dashboard:** [dash.cloudflare.com](https://dash.cloudflare.com)

### Support Resources:
- **GitHub Issues:** Report bugs or request features
- **Cloudflare Docs:** [developers.cloudflare.com](https://developers.cloudflare.com)
- **API Documentation:** Links to all API providers in their respective dashboards

---

## \ud83c\udf89 Congratulations!

You now have your own professional-grade cybersecurity education platform! 

### What You've Accomplished:
1. \u2705 Set up a modern, secure web application
2. \u2705 Integrated multiple AI systems for enhanced learning
3. \u2705 Created a scalable platform that can handle thousands of users
4. \u2705 Built something that rivals commercial educational platforms

### Share Your Success:
- Show it off to friends and colleagues
- Use it to teach cybersecurity concepts
- Contribute improvements back to the community
- Help others set up their own instances

**Remember:** You built something amazing, even if you're not a programmer! This platform represents enterprise-level technology that you now own and control.

---

## \ud83d\udd12 Security Reminders

### Important Security Notes:
- \u26a0\ufe0f **Change the default admin password** from "Yethical" to something secure
- \ud83d\udd10 **Never share your API keys** - treat them like passwords
- \ud83d\udcca **Monitor your API usage** to avoid unexpected charges
- \ud83d\udcc9 **Regular backups** - your GitHub repository IS your backup
- \ud83d\udeab **Only use for educational purposes** - follow all ethical guidelines

### Legal Compliance:
- All users must accept the responsibility modal
- Activity logging helps ensure ethical use
- Terms and privacy policies are included
- Designed for educational and defensive purposes only

---

**Need help?** Create an issue on GitHub or check the troubleshooting section above. The cybersecurity community is friendly and helpful!

**Happy Learning! \ud83d\ude80**