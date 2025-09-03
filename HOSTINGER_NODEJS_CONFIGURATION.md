# 🔧 CONFIGURE NODE.JS APP IN HOSTINGER hPANEL

## 📍 Step-by-Step Configuration Guide

### Step 1: Access Node.js Section
1. **Login to Hostinger hPanel**
   - Go to your Hostinger account
   - Click on your hosting plan
   - Access the hPanel dashboard

2. **Navigate to Node.js**
   - In hPanel, look for **"Node.js"** section
   - Click on **"Node.js"** or **"Node.js Apps"**
   - You'll see the Node.js management interface

### Step 2: Create New Node.js Application
1. **Click "Create Application"**
   - Look for a button like "Create Application" or "Add Application"
   - Click it to start the setup process

2. **Configure Application Settings:**
   ```
   📋 Application Configuration:
   ├── Application Name: premium-choice-real-estate
   ├── Application Root: /public_html
   ├── Application URL: yourdomain.com (or subdomain)
   ├── Node.js Version: 18.x or 20.x (latest stable)
   └── Startup File: server.js
   ```

### Step 3: Detailed Configuration Settings

#### 🎯 Required Settings:
```
Application Name: premium-choice-real-estate
Application Root: /public_html
Startup File: server.js
Node.js Version: 18.x (recommended) or 20.x
Environment: production
```

#### 🌐 Domain Configuration:
```
Domain: yourdomain.com
OR
Subdomain: app.yourdomain.com
```

#### 📁 File Structure Verification:
Make sure your `/public_html/` contains:
```
📁 public_html/
├── 📄 server.js              ← STARTUP FILE
├── 📄 package.json           ← DEPENDENCIES
├── 📁 .next/                 ← BUILT APP
├── 📁 app/                   ← SOURCE CODE
├── 📁 public/                ← STATIC FILES
└── 📄 .env.local             ← ENVIRONMENT
```

### Step 4: Environment Variables Setup
1. **In Node.js App Settings:**
   - Look for "Environment Variables" section
   - Add these variables:

```env
NODE_ENV=production
DB_HOST=srv1558.hstgr.io
DB_USER=u485564989_pcrs
DB_PASSWORD=Abedyr57..
DB_NAME=u485564989_pcrs
DB_PORT=3306
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=super-secret-nextauth-key-for-production-2024
JWT_SECRET=jwt-secret-key-for-production-security-2024
```

### Step 5: Install Dependencies
1. **Access Terminal/SSH:**
   - In hPanel, look for "Terminal" or "SSH Access"
   - Or use the built-in terminal in Node.js section

2. **Run Installation Commands:**
   ```bash
   cd /public_html
   npm install --production
   ```

### Step 6: Start the Application
1. **In Node.js App Management:**
   - Click "Start" or "Run Application"
   - The app should start using `server.js`

2. **Verify Status:**
   - Check if status shows "Running"
   - Note the assigned port (usually auto-assigned)

### Step 7: Configure Domain/Subdomain
1. **Domain Setup:**
   - Go to "Domains" section in hPanel
   - Point your domain to the Node.js app
   - Or create a subdomain for the app

2. **SSL Certificate:**
   - Enable SSL for your domain
   - Hostinger usually provides free SSL

## 🖥️ Visual Guide - hPanel Interface

### What You'll See in hPanel:
```
┌─────────────────────────────────────┐
│           hPanel Dashboard          │
├─────────────────────────────────────┤
│ 🏠 Dashboard                        │
│ 📁 File Manager                     │
│ 🌐 Domains                          │
│ 📧 Email                            │
│ 🗄️ Databases                        │
│ ⚙️ Node.js          ← CLICK HERE    │
│ 🔒 SSL                              │
│ 📊 Statistics                       │
└─────────────────────────────────────┘
```

### Node.js Section Interface:
```
┌─────────────────────────────────────┐
│         Node.js Applications        │
├─────────────────────────────────────┤
│ [+ Create Application]              │
│                                     │
│ 📋 Application List:                │
│ ┌─────────────────────────────────┐ │
│ │ App Name: premium-choice-re...  │ │
│ │ Status: ⚫ Stopped              │ │
│ │ Domain: yourdomain.com          │ │
│ │ [▶️ Start] [⚙️ Settings] [🗑️]    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🔧 Configuration Form Fields

### When Creating Application:
```
Application Name: [premium-choice-real-estate]
Application Root: [/public_html]
Startup File: [server.js]
Node.js Version: [18.x] ▼
Domain: [yourdomain.com] ▼
Environment: [production] ▼

[Create Application]
```

## ⚡ Quick Configuration Checklist

### Before Configuration:
- [ ] Files uploaded to `/public_html/`
- [ ] `server.js` exists in root
- [ ] `package.json` exists
- [ ] `.env.local` configured

### During Configuration:
- [ ] Application name set
- [ ] Startup file: `server.js`
- [ ] Node.js version 18.x+
- [ ] Domain configured
- [ ] Environment variables added

### After Configuration:
- [ ] Dependencies installed
- [ ] Application started
- [ ] Status shows "Running"
- [ ] Domain accessible
- [ ] SSL enabled

## 🚨 Common Configuration Issues

### Issue 1: Can't Find server.js
**Solution:** Make sure `server.js` is in `/public_html/` root directory

### Issue 2: Dependencies Missing
**Solution:** Run `npm install --production` in terminal

### Issue 3: Environment Variables Not Working
**Solution:** Add them in hPanel Node.js settings, not just .env file

### Issue 4: Port Conflicts
**Solution:** Let Hostinger auto-assign port, don't specify in code

## 📞 Next Steps After Configuration

1. **Test the Application:**
   - Visit your domain
   - Check if site loads
   - Test admin panel

2. **Monitor Logs:**
   - Check application logs in hPanel
   - Monitor for any errors

3. **Update DNS (if needed):**
   - Point domain to Hostinger
   - Wait for propagation

**Your Node.js app should now be running on Hostinger!** 🚀