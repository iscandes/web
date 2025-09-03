# 🎯 HOSTINGER hPANEL - NODE.JS CONFIGURATION SCREENSHOTS GUIDE

## 📱 Visual Step-by-Step Guide

### Step 1: Login to hPanel
```
🌐 Browser: https://hpanel.hostinger.com
📧 Email: your-hostinger-email
🔑 Password: your-hostinger-password
```

### Step 2: Navigate to Node.js Section
**What you'll see in hPanel sidebar:**
```
┌─────────────────────┐
│ 🏠 Overview         │
│ 📁 File Manager     │
│ 🌐 Domains          │
│ 📧 Email Accounts   │
│ 🗄️ Databases        │
│ ⚙️ Node.js          │ ← CLICK THIS
│ 🔒 SSL/TLS          │
│ 📊 Analytics        │
│ ⚙️ Advanced         │
└─────────────────────┘
```

### Step 3: Create New Application
**You'll see this interface:**
```
┌─────────────────────────────────────────┐
│           Node.js Applications          │
├─────────────────────────────────────────┤
│                                         │
│  No applications found                  │
│                                         │
│  [+ Create Application]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Click "Create Application" button**

### Step 4: Fill Configuration Form
**Configuration form will appear:**
```
┌─────────────────────────────────────────┐
│        Create Node.js Application      │
├─────────────────────────────────────────┤
│                                         │
│ Application name                        │
│ [premium-choice-real-estate        ]    │
│                                         │
│ Application root                        │
│ [/public_html                      ]    │
│                                         │
│ Application startup file                │
│ [server.js                         ]    │
│                                         │
│ Node.js version                         │
│ [18.x                              ▼]   │
│                                         │
│ Application mode                        │
│ [production                        ▼]   │
│                                         │
│ Domain                                  │
│ [yourdomain.com                    ▼]   │
│                                         │
│ [Create Application]                    │
│                                         │
└─────────────────────────────────────────┘
```

### Step 5: Application Created Successfully
**After creation, you'll see:**
```
┌─────────────────────────────────────────┐
│           Node.js Applications          │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📱 premium-choice-real-estate       │ │
│ │ 🌐 yourdomain.com                   │ │
│ │ 📁 /public_html                     │ │
│ │ ⚫ Status: Stopped                  │ │
│ │                                     │ │
│ │ [▶️ Start] [⚙️ Edit] [🗑️ Delete]     │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Step 6: Configure Environment Variables
**Click "Edit" button, then find Environment Variables section:**
```
┌─────────────────────────────────────────┐
│        Application Settings            │
├─────────────────────────────────────────┤
│                                         │
│ Environment Variables                   │
│ ┌─────────────────────────────────────┐ │
│ │ Variable Name    │ Value            │ │
│ ├─────────────────────────────────────┤ │
│ │ NODE_ENV         │ production       │ │
│ │ DB_HOST          │ srv1558.hstgr.io │ │
│ │ DB_USER          │ u485564989_pcrs  │ │
│ │ DB_PASSWORD      │ Abedyr57..       │ │
│ │ DB_NAME          │ u485564989_pcrs  │ │
│ │ NEXTAUTH_URL     │ https://yourdomain│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ Add Variable]                        │
│                                         │
└─────────────────────────────────────────┘
```

### Step 7: Install Dependencies
**Access Terminal section in hPanel:**
```
┌─────────────────────────────────────────┐
│              Terminal                   │
├─────────────────────────────────────────┤
│                                         │
│ [u485564989@server ~]$ cd public_html   │
│ [u485564989@server public_html]$        │
│ npm install --production                │
│                                         │
│ Installing dependencies...              │
│ ✓ Dependencies installed successfully   │
│                                         │
└─────────────────────────────────────────┘
```

### Step 8: Start Application
**Back in Node.js section, click "Start":**
```
┌─────────────────────────────────────────┐
│           Node.js Applications          │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📱 premium-choice-real-estate       │ │
│ │ 🌐 yourdomain.com                   │ │
│ │ 📁 /public_html                     │ │
│ │ 🟢 Status: Running                  │ │ ← NOW RUNNING!
│ │ 🔗 Port: 3000                       │ │
│ │                                     │ │
│ │ [⏹️ Stop] [⚙️ Edit] [📊 Logs]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## 🔧 Exact Configuration Values

### Application Settings:
```
Application Name: premium-choice-real-estate
Application Root: /public_html
Startup File: server.js
Node.js Version: 18.x (or latest stable)
Application Mode: production
Domain: yourdomain.com
```

### Environment Variables to Add:
```
NODE_ENV = production
DB_HOST = srv1558.hstgr.io
DB_USER = u485564989_pcrs
DB_PASSWORD = Abedyr57..
DB_NAME = u485564989_pcrs
DB_PORT = 3306
NEXTAUTH_URL = https://yourdomain.com
NEXTAUTH_SECRET = super-secret-nextauth-key-for-production-2024
JWT_SECRET = jwt-secret-key-for-production-security-2024
```

## 🚨 Important Notes

### ✅ What Should Work:
- Application shows "Running" status
- Green indicator next to status
- Port number assigned (usually 3000)
- Domain accessible

### ❌ Common Issues:
- **Red status**: Check if `server.js` exists
- **Port conflicts**: Let Hostinger auto-assign
- **Dependencies error**: Run `npm install --production`
- **Environment variables**: Add them in hPanel, not just .env file

## 📞 After Configuration

1. **Visit your domain** - Should show your website
2. **Check logs** - Click "Logs" button to see any errors
3. **Test admin panel** - Go to yourdomain.com/admin
4. **Monitor performance** - Use hPanel analytics

**Your Node.js application should now be live on Hostinger!** 🎉