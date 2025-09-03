# Hostinger Deployment Guide for Premium Choice Real Estate

This guide provides step-by-step instructions for deploying your Next.js real estate application to Hostinger hosting without errors.

## Prerequisites

Before starting the deployment, ensure you have:
- A Hostinger hosting account with Node.js support
- Access to your Hostinger control panel (hPanel)
- Your application files ready for deployment
- Database credentials from Hostinger

## Step 1: Prepare Your Application for Production

### 1.1 Environment Configuration

Create a production environment file:

```bash
# .env.production
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Database Configuration
DB_HOST=your-hostinger-db-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-database-name
DB_PORT=3306

# AI API Keys (Optional)
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
CLAUDE_API_KEY=your-claude-key
```

### 1.2 Update Next.js Configuration

Ensure your `next.config.ts` is optimized for production:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  images: {
    domains: ['yourdomain.com'],
    unoptimized: true, // For Hostinger compatibility
  },
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
}

module.exports = nextConfig
```

### 1.3 Build the Application

```bash
npm run build
```

## Step 2: Database Setup on Hostinger

### 2.1 Create MySQL Database

1. Log into your Hostinger hPanel
2. Go to "Databases" → "MySQL Databases"
3. Create a new database:
   - Database name: `your_app_db`
   - Username: `your_db_user`
   - Password: `strong_password`

### 2.2 Import Database Schema

1. Access phpMyAdmin from hPanel
2. Select your database
3. Go to "Import" tab
4. Upload and execute the following SQL files in order:
   - `database_setup.sql`
   - `add-hero-images-ai-settings.sql`

### 2.3 Verify Database Tables

Ensure these tables are created:
- `users`
- `developers`
- `projects`
- `hero_sections`
- `articles`
- `media_files`
- `system_logs`
- `chat_messages`
- `presentation_slides`
- `site_settings`
- `hero_images`
- `ai_api_settings`

## Step 3: File Upload and Deployment

### 3.1 Prepare Files for Upload

Create a deployment package:

```bash
# Create deployment folder
mkdir deployment
cp -r .next deployment/
cp -r public deployment/
cp -r node_modules deployment/
cp package.json deployment/
cp package-lock.json deployment/
cp next.config.ts deployment/
cp .env.production deployment/.env.local
```

### 3.2 Upload via File Manager

1. Access Hostinger File Manager
2. Navigate to `public_html` directory
3. Upload your deployment files:
   - Upload `.next` folder
   - Upload `public` folder
   - Upload `node_modules` folder
   - Upload `package.json`
   - Upload `next.config.ts`
   - Upload `.env.local`

### 3.3 Alternative: Upload via FTP

```bash
# Using FileZilla or similar FTP client
Host: ftp.yourdomain.com
Username: your-ftp-username
Password: your-ftp-password
Port: 21

# Upload all files to public_html directory
```

## Step 4: Node.js Configuration on Hostinger

### 4.1 Enable Node.js

1. In hPanel, go to "Advanced" → "Node.js"
2. Click "Create Application"
3. Configure:
   - Node.js version: 18.x or higher
   - Application root: `/public_html`
   - Application URL: `yourdomain.com`
   - Application startup file: `server.js`

### 4.2 Create Server File

Create `server.js` in your root directory:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

### 4.3 Install Dependencies

In the Node.js terminal (hPanel):

```bash
npm install --production
```

## Step 5: Domain and SSL Configuration

### 5.1 Domain Setup

1. In hPanel, go to "Domains"
2. Point your domain to Hostinger nameservers:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`

### 5.2 SSL Certificate

1. Go to "Security" → "SSL/TLS"
2. Enable "Force HTTPS"
3. Install free Let's Encrypt SSL certificate

## Step 6: File Permissions and Security

### 6.1 Set Correct Permissions

```bash
# In File Manager or via SSH
chmod 755 public_html
chmod 644 public_html/.env.local
chmod 755 public_html/public
chmod 755 public_html/public/uploads
```

### 6.2 Create .htaccess File

Create `.htaccess` in `public_html`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## Step 7: Testing and Troubleshooting

### 7.1 Test Application

1. Visit your domain: `https://yourdomain.com`
2. Test key functionalities:
   - Homepage loading
   - Project listings
   - Admin panel access
   - Database connections
   - File uploads

### 7.2 Common Issues and Solutions

#### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install --production
```

#### Issue: Database connection errors
**Solution:**
- Verify database credentials in `.env.local`
- Check if database server is accessible
- Ensure database tables are properly created

#### Issue: File upload errors
**Solution:**
```bash
# Set proper permissions
chmod 755 public/uploads
chmod 755 public/brochures
chmod 755 public/presentations
```

#### Issue: 500 Internal Server Error
**Solution:**
- Check error logs in hPanel
- Verify Node.js application is running
- Check `server.js` configuration

### 7.3 Performance Optimization

1. **Enable Gzip Compression:**
```apache
# Add to .htaccess
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

2. **Database Optimization:**
```sql
-- Add indexes for better performance
ALTER TABLE projects ADD INDEX idx_status (status);
ALTER TABLE projects ADD INDEX idx_featured (is_featured);
ALTER TABLE developers ADD INDEX idx_status (status);
```

## Step 8: Monitoring and Maintenance

### 8.1 Set Up Monitoring

1. Enable error logging in hPanel
2. Monitor application performance
3. Set up uptime monitoring

### 8.2 Regular Maintenance

- **Weekly:** Check error logs
- **Monthly:** Update dependencies
- **Quarterly:** Database optimization
- **Annually:** SSL certificate renewal (automatic with Let's Encrypt)

## Step 9: Backup Strategy

### 9.1 Database Backup

```bash
# Create automated backup script
mysqldump -h your-db-host -u your-db-user -p your-database > backup_$(date +%Y%m%d).sql
```

### 9.2 File Backup

1. Use Hostinger's backup feature in hPanel
2. Download weekly backups of:
   - Application files
   - Uploaded media
   - Database exports

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and schema imported
- [ ] Files uploaded to public_html
- [ ] Node.js application configured
- [ ] Dependencies installed
- [ ] Domain and SSL configured
- [ ] File permissions set correctly
- [ ] .htaccess file created
- [ ] Application tested thoroughly
- [ ] Monitoring and backups configured

## Support and Resources

- **Hostinger Documentation:** https://support.hostinger.com
- **Next.js Deployment Guide:** https://nextjs.org/docs/deployment
- **Node.js on Hostinger:** https://support.hostinger.com/en/articles/1583579-how-to-use-node-js

## Troubleshooting Contacts

If you encounter issues:
1. Check Hostinger support documentation
2. Contact Hostinger support via live chat
3. Review application error logs in hPanel
4. Check Node.js application status in hPanel

---

**Note:** This guide assumes you have a Hostinger Business or Premium plan with Node.js support. Shared hosting plans may have limitations for Node.js applications.