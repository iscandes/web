#!/usr/bin/env node

/**
 * Project Settings Backup Script
 * This script saves all current project settings and configurations
 * without making any changes to the existing setup.
 */

const fs = require('fs');
const path = require('path');

// Get current timestamp for backup naming
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(__dirname, '..', 'backups', `project-backup-${timestamp}`);

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Files and directories to backup
const itemsToBackup = [
    // Configuration files
    'package.json',
    'package-lock.json',
    'next.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'postcss.config.js',
    '.env.local',
    '.eslintrc.json',
    
    // Database and setup files
    'database_setup.sql',
    'server.js',
    
    // Application structure
    'app',
    'components',
    'lib',
    'data',
    'scripts',
    'public',
    
    // Documentation
    'README.md',
    'DEPLOYMENT.md',
    'DATABASE_SETUP_README.md'
];

// Function to copy files and directories recursively
function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
            // Skip node_modules, .next, and other build directories
            if (['node_modules', '.next', '.git', 'backups'].includes(file)) {
                return;
            }
            
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            copyRecursive(srcPath, destPath);
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Function to save current project state
function saveProjectSettings() {
    console.log('🔄 Starting project settings backup...');
    console.log(`📁 Backup directory: ${backupDir}`);
    
    try {
        // Copy all specified items
        itemsToBackup.forEach(item => {
            const srcPath = path.join(__dirname, '..', item);
            const destPath = path.join(backupDir, item);
            
            if (fs.existsSync(srcPath)) {
                console.log(`📋 Backing up: ${item}`);
                copyRecursive(srcPath, destPath);
            } else {
                console.log(`⚠️  Skipping (not found): ${item}`);
            }
        });
        
        // Create a settings summary file
        const settingsSummary = {
            backupDate: new Date().toISOString(),
            projectName: "Premium Choice Real Estate",
            description: "Complete project backup with all current settings preserved",
            structure: {
                frontend: "Next.js 14 with TypeScript",
                styling: "Tailwind CSS",
                database: "MySQL with connection pooling",
                features: [
                    "Real estate project listings",
                    "Developer profiles",
                    "Article management",
                    "AI chat integration",
                    "Admin panel",
                    "Featured projects display"
                ]
            },
            currentSettings: {
                navigation: ["Home", "Projects", "Articles", "Developers", "Expert"],
                databaseConnection: "MySQL with optimized pool settings",
                apiEndpoints: [
                    "/api/projects",
                    "/api/developers", 
                    "/api/articles",
                    "/api/expert",
                    "/api/admin"
                ],
                fallbackMechanism: "Test data when database unavailable"
            },
            lastModified: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(backupDir, 'BACKUP_SUMMARY.json'),
            JSON.stringify(settingsSummary, null, 2)
        );
        
        // Create restore instructions
        const restoreInstructions = `# Project Restore Instructions

## Backup Information
- Created: ${new Date().toISOString()}
- Location: ${backupDir}

## To Restore This Backup:

1. **Stop the development server** if running
2. **Copy all files** from this backup directory to your project root
3. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
4. **Set up environment variables** (copy .env.local)
5. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

## Current Project State Preserved:
- ✅ Navigation without "About" page
- ✅ Database connection with optimized settings
- ✅ Fallback mechanism for API endpoints
- ✅ All components and pages
- ✅ Styling and configuration
- ✅ Admin panel functionality
- ✅ AI chat integration

## Important Notes:
- Database credentials are in .env.local
- All current optimizations are preserved
- No changes were made during backup process
`;
        
        fs.writeFileSync(
            path.join(backupDir, 'RESTORE_INSTRUCTIONS.md'),
            restoreInstructions
        );
        
        console.log('✅ Project settings backup completed successfully!');
        console.log(`📍 Backup saved to: ${backupDir}`);
        console.log('📄 Backup summary and restore instructions included');
        
    } catch (error) {
        console.error('❌ Error during backup:', error.message);
        process.exit(1);
    }
}

// Run the backup
saveProjectSettings();