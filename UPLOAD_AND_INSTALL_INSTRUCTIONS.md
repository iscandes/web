# Deployment Instructions for Next.js Project

## 1. Files and Folders to Upload to Your Server
Upload the following files and folders from your local project to your server's deployment directory (e.g., `/public_html/`):

- `.next/` (the build output folder)
- `app/` (your application source code)
- `components/` (shared React components)
- `lib/` (library/helper code)
- `public/` (static assets)
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `server.js` (custom server entry point)
- `.env.local` (your environment variables; rename from `.env.production` if needed)
- `.htaccess` (for Apache configuration)

## 2. How to Install and Build on Your Server

**A. Connect to your server via SSH.**

**B. Navigate to your project directory:**
```
cd /home/YOUR_USERNAME/public_html
```

**C. Install dependencies:**
```
npm install --production
```

**D. Start your Next.js server:**
```
node server.js
```

> If you want your server to keep running after you disconnect, use a process manager like `pm2`:
> 
> ```
> npm install -g pm2
> pm2 start server.js
> pm2 save
> pm2 startup
> ```

**E. Make sure your `.env.local` file is present and contains all required environment variables.**

## 3. Notes
- Do **not** run `npm run build` on the server if you already uploaded the `.next/` folder from your local build.
- Ensure all file and folder permissions are correct (folders: 755, files: 644).
- Your `.htaccess` file should be configured to proxy requests to your Node.js server (see included example).

---

**If you follow these steps and upload all the files above, your Next.js app should run correctly on your server.**