# Hostinger Deployment Guide

## Prerequisites
- Hostinger hosting account with Node.js support
- MySQL database already set up on Hostinger
- Domain name configured

## Database Configuration
Your MySQL database is already configured with these settings:
- **Host**: srv1558.hstgr.io
- **Username**: u485564989_pcrs
- **Password**: Abedyr57..
- **Database**: u485564989_pcrs
- **Port**: 3306

## Deployment Steps

### 1. Prepare Environment Variables
Create a `.env.production` file in your Hostinger file manager or upload it with the following variables:

```env
NODE_ENV=production
DB_HOST=srv1558.hstgr.io
DB_USER=u485564989_pcrs
DB_PASSWORD=Abedyr57..
DB_NAME=u485564989_pcrs
DB_PORT=3306
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-key-here
JWT_SECRET=your-jwt-secret-key-here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 2. Build the Application
Run the following commands locally:

```bash
# Test database connection
npm run db:test

# Build for production
npm run build:production
```

### 3. Upload Files to Hostinger
Upload the following files and folders to your Hostinger public_html directory:
- `.next/` folder (entire build output)
- `public/` folder
- `package.json`
- `next.config.ts`
- `.env.production`
- `lib/` folder
- `app/` folder
- `components/` folder
- `data/` folder

### 4. Install Dependencies on Hostinger
In your Hostinger terminal or file manager, run:

```bash
npm install --production
```

### 5. Start the Application
```bash
npm run start:production
```

## File Structure for Deployment
```
public_html/
├── .next/                 # Build output
├── public/               # Static assets
├── app/                  # Application code
├── components/           # React components
├── lib/                  # Database and utilities
├── data/                 # JSON data files
├── package.json          # Dependencies
├── next.config.ts        # Next.js configuration
└── .env.production       # Environment variables
```

## Important Notes

### 1. Environment Variables
- Replace `yourdomain.com` with your actual domain
- Generate secure secrets for JWT and NextAuth
- Add your Google Maps API key if using maps

### 2. File Permissions
Ensure these directories have write permissions:
- `public/uploads/`
- `public/brochures/`
- `public/presentations/`
- `public/videos/`

### 3. Database
Your database is already set up with all necessary tables and data.

### 4. Admin Access
Default admin credentials (change these in production):
- Email: admin@example.com
- Password: admin123

## Troubleshooting

### Common Issues:
1. **Database Connection Error**: Verify environment variables
2. **File Upload Issues**: Check directory permissions
3. **Build Errors**: Run `npm run lint` to check for issues

### Hostinger Specific:
- Ensure Node.js version is compatible (18+ recommended)
- Check if all dependencies are installed
- Verify file paths are correct

## Security Checklist
- [ ] Change default admin password
- [ ] Set secure JWT secrets
- [ ] Configure CORS for your domain
- [ ] Enable HTTPS
- [ ] Set proper file permissions

## Performance Optimization
- Images are already optimized with Next.js
- Static assets are served from `public/` directory
- Database queries are optimized
- Caching is enabled for API responses

## Monitoring
Monitor your application through:
- Hostinger control panel
- Application logs
- Database performance metrics

## Support
For deployment issues:
1. Check Hostinger documentation
2. Verify all environment variables
3. Test database connection
4. Check file permissions