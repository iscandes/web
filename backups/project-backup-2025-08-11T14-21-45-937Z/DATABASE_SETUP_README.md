# Database Setup Instructions

## How to Import the Database in phpMyAdmin

### Step 1: Access phpMyAdmin
1. Open your web browser and go to your phpMyAdmin URL
2. Login with your database credentials:
   - **Host:** srv1558.hstgr.io
   - **Username:** u485564989_pcrs
   - **Password:** Abedyr57..
   - **Database:** u485564989_pcrs

### Step 2: Import the SQL File
1. Click on your database name `u485564989_pcrs` in the left sidebar
2. Click on the **"Import"** tab at the top
3. Click **"Choose File"** and select `database_setup.sql`
4. Make sure the format is set to **"SQL"**
5. Click **"Import"** button at the bottom

### Step 3: Verify the Import
After successful import, you should see these tables:
- ✅ `users` (with default admin user)
- ✅ `developers` (with sample developers)
- ✅ `projects` (with sample projects)
- ✅ `hero_sections` (with page hero content)
- ✅ `articles` (with sample articles)
- ✅ `media_files` (for file uploads)
- ✅ `system_logs` (for system logging)
- ✅ `chat_messages` (for chat functionality)
- ✅ `presentation_slides` (for PowerPoint presentations)

## Default Admin Login Credentials
- **Email:** admin@premiumchoice.com
- **Password:** Abedyr57..

## What's Included in the Database

### Sample Data:
- **3 Developers:** Emaar Properties, DAMAC Properties, Nakheel
- **3 Projects:** Dubai Hills Estate, Downtown Views, DAMAC Hills Villas
- **Hero Sections:** For home, projects, and about pages
- **2 Sample Articles:** Market trends and investment guide

### Features:
- ✅ Complete user authentication system
- ✅ Project management with PowerPoint support
- ✅ Developer profiles
- ✅ Article/blog system
- ✅ Media file management
- ✅ System logging
- ✅ Chat message storage
- ✅ Presentation slide management

## Database Configuration Fixed
The following MySQL2 warnings have been resolved:
- ❌ ~~acquireTimeout~~ → ✅ Fixed
- ❌ ~~timeout~~ → ✅ Fixed  
- ❌ ~~reconnect~~ → ✅ Fixed

## Testing the Setup
1. Import the SQL file in phpMyAdmin
2. Start your application: `npm run dev`
3. Go to: `http://localhost:3003/admin`
4. Login with the admin credentials above
5. You should see the admin dashboard with all features working

## Troubleshooting
If you encounter any issues:
1. Make sure all tables were created successfully
2. Check that the admin user exists in the `users` table
3. Verify your database connection settings match the ones in the application
4. Check the browser console and server logs for any errors

## Next Steps
After importing the database:
1. ✅ Login to admin panel
2. ✅ Upload PowerPoint presentations for projects
3. ✅ Add more projects and developers
4. ✅ Customize hero sections and content
5. ✅ Test the cinematic project visualization features