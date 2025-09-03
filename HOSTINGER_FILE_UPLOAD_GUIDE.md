# HOSTINGER FILE UPLOAD GUIDE

## What Files to Upload and Where

### 1. MAIN APPLICATION FILES (Upload to `/public_html/`)

#### Core Next.js Files:
```
📁 public_html/
├── 📁 .next/                    ← Built application (from npm run build)
├── 📁 public/                   ← Static assets
├── 📁 node_modules/             ← Dependencies (or install via npm)
├── 📄 package.json              ← Dependencies list
├── 📄 package-lock.json         ← Dependency lock file
├── 📄 next.config.ts            ← Next.js configuration
├── 📄 server.js                 ← Custom server file (create new)
├── 📄 .env.local                ← Environment variables (rename from .env.production)
└── 📄 .htaccess                 ← Apache configuration (create new)
```

#### Files to Upload:
1. **`.next` folder** - Complete built application
2. **`public` folder** - All static files (images, uploads, etc.)
3. **`node_modules` folder** - All dependencies (or install via npm install)
4. **`package.json`** - Dependencies configuration
5. **`package-lock.json`** - Exact dependency versions
6. **`next.config.ts`** - Next.js configuration
7. **`.env.production`** (rename to `.env.local` on server)

#### Files to CREATE on server:
1. **`server.js`** - Custom server file
2. **`.htaccess`** - Apache configuration

### 2. UPLOAD LOCATIONS

#### Via Hostinger File Manager:
1. Login to hPanel → File Manager
2. Navigate to `public_html` directory
3. Upload files directly to this folder

#### Via FTP:
```
Host: ftp.yourdomain.com
Username: your-ftp-username
Password: your-ftp-password
Directory: /public_html/
```

### 3. FOLDER STRUCTURE ON HOSTINGER

```
📁 public_html/
├── 📁 .next/
│   ├── 📁 server/
│   ├── 📁 static/
│   └── 📄 Various build files
├── 📁 public/
│   ├── 📁 uploads/              ← User uploaded files
│   ├── 📁 images/               ← Static images
│   ├── 📁 brochures/            ← PDF files
│   ├── 📁 presentations/        ← PowerPoint files
│   └── 📁 videos/               ← Video files
├── 📁 node_modules/             ← All npm packages
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 next.config.ts
├── 📄 server.js                 ← CREATE THIS
├── 📄 .env.local                ← RENAME FROM .env.production
└── 📄 .htaccess                 ← CREATE THIS
```

### 4. IMPORTANT UPLOAD NOTES

#### DO NOT Upload:
- ❌ `.git` folder
- ❌ `node_modules` (if you plan to run npm install on server)
- ❌ `.env` files (upload as .env.local)
- ❌ Development files (.eslintrc, tsconfig, etc.)
- ❌ `temp` folder
- ❌ `scripts` folder

#### MUST Upload:
- ✅ `.next` folder (complete)
- ✅ `public` folder (complete)
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `next.config.ts`

### 5. FILE PERMISSIONS AFTER UPLOAD

Set these permissions via File Manager:
```
📁 public_html/          → 755
📁 public/               → 755
📁 public/uploads/       → 755 (writable)
📁 public/brochures/     → 755 (writable)
📁 public/presentations/ → 755 (writable)
📄 .env.local           → 644 (secure)
📄 .htaccess            → 644
```

### 6. UPLOAD METHODS

#### Method 1: File Manager (Recommended)
1. Zip your files locally
2. Upload zip to public_html
3. Extract on server
4. Set permissions

#### Method 2: FTP Client
1. Use FileZilla or similar
2. Upload files directly
3. Maintain folder structure

#### Method 3: Git (Advanced)
1. Push to GitHub/GitLab
2. Clone on server
3. Build on server

### 7. UPLOAD CHECKLIST

Before uploading:
- [ ] Run `npm run build` locally
- [ ] Verify `.next` folder exists
- [ ] Check `public` folder has all assets
- [ ] Rename `.env.production` to `.env.local`
- [ ] Create `server.js` file
- [ ] Create `.htaccess` file

After uploading:
- [ ] Set correct file permissions
- [ ] Install dependencies (if needed)
- [ ] Configure Node.js app in hPanel
- [ ] Test database connection
- [ ] Verify website loads

### 8. COMMON UPLOAD ISSUES

#### Issue: Large file upload fails
**Solution:** 
- Upload in smaller chunks
- Use FTP for large files
- Compress files before upload

#### Issue: Permission denied errors
**Solution:**
```bash
chmod 755 public_html
chmod 755 public/uploads
chmod 644 .env.local
```

#### Issue: Missing dependencies
**Solution:**
```bash
# Run in hPanel terminal
npm install --production
```