# Email Configuration Troubleshooting Guide

## Current Issue
SMTP authentication is failing with error: `535 5.7.8 Error: authentication failed`

## Possible Solutions

### 1. Verify Email Account Settings
- **Email**: admin@pcrealestate.ae
- **Password**: Berlin9811..
- **SMTP Host**: smtp.hostinger.com
- **SMTP Port**: 465 (SSL/TLS)

### 2. Hostinger Email Configuration Steps

#### Step 1: Verify Email Account Exists
1. Log into Hostinger control panel
2. Go to Email section
3. Verify that `admin@pcrealestate.ae` account exists
4. Check if the password is correct

#### Step 2: Enable SMTP Access
1. In Hostinger email settings, ensure SMTP is enabled
2. Some providers require explicit SMTP activation
3. Check if there are any security restrictions

#### Step 3: Alternative SMTP Settings
Try these alternative configurations:

**Option A: STARTTLS (Port 587)**
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Option B: Different Authentication**
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=25
SMTP_SECURE=false
```

### 3. Test with Manual Email Client
1. Configure Outlook/Thunderbird with same settings
2. Test if you can send emails manually
3. This will confirm if the issue is with credentials or code

### 4. Hostinger-Specific Requirements
- Some Hostinger accounts require domain verification
- Check if 2FA is enabled (may need app-specific password)
- Verify that the domain `pcrealestate.ae` is properly configured

### 5. Alternative Solutions

#### Option A: Use Hostinger's Web API
Some hosting providers offer email APIs instead of SMTP

#### Option B: Use Third-Party Email Service
- SendGrid
- Mailgun
- Amazon SES
- Resend

#### Option C: Contact Form without Email
- Store submissions in database
- Admin can view them in dashboard
- Add email functionality later

## Next Steps

1. **Immediate**: Verify email account credentials in Hostinger panel
2. **Test**: Try port 587 with STARTTLS
3. **Backup**: Implement database-only contact form
4. **Long-term**: Consider third-party email service

## Testing Commands

```bash
# Test with port 587
node debug-smtp-587.js

# Test contact form (will fail gracefully)
node test-email-functionality.js

# Check if email account works with manual client
# Use same credentials in Outlook/Thunderbird
```

## Contact Form Fallback
If email continues to fail, we can:
1. Save contact submissions to database
2. Show success message to user
3. Admin can view submissions in dashboard
4. Fix email later without affecting user experience