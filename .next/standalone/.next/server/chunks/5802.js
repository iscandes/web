exports.id=5802,exports.ids=[5802],exports.modules={62849:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=62849,e.exports=t},8852:(e,t,a)=>{"use strict";a.d(t,{B5:()=>c,IO:()=>o,N8:()=>l,uu:()=>n,vo:()=>p});var i=a(73785);let r={host:"srv1558.hstgr.io",user:"u485564989_pcrs",password:"Abedyr57..",database:"u485564989_pcrs",port:Number("3306"),ssl:{rejectUnauthorized:!1},connectionLimit:10,queueLimit:20,acquireTimeout:6e4,timeout:6e4,enableKeepAlive:!0,keepAliveInitialDelay:0,idleTimeout:3e5,maxIdle:5,multipleStatements:!1},s=i.createPool(r);class n{static async testConnection(){try{let e=await s.getConnection();return await e.ping(),e.release(),!0}catch(e){return!1}}static async cleanup(){try{await s.end()}catch(e){}}static async executeQuery(e,t=[]){try{let a=await s.getConnection(),[i]=await a.execute(e,t);return a.release(),i}catch(e){throw e}}static async query(e,t=[]){return this.executeQuery(e,t)}static async initialize(){try{if(!await this.testConnection())throw Error("Database connection failed");return await this.initializeTables()}catch(e){return!1}}static async addMissingSocialColumns(){try{let e=await s.getConnection(),t=`
        ALTER TABLE site_settings 
        ADD COLUMN IF NOT EXISTS social_tiktok VARCHAR(500),
        ADD COLUMN IF NOT EXISTS social_snapchat VARCHAR(500),
        ADD COLUMN IF NOT EXISTS social_telegram VARCHAR(500),
        ADD COLUMN IF NOT EXISTS social_whatsapp VARCHAR(500);
      `;return await e.execute(t),e.release(),!0}catch(e){return!1}}static async initializeTables(){try{let e=await s.getConnection(),t=`
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
          name VARCHAR(255) NOT NULL,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE
        );

        -- Developers table
        CREATE TABLE IF NOT EXISTS developers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          logo VARCHAR(500),
          established VARCHAR(50),
          projects_count INT DEFAULT 0,
          location VARCHAR(255),
          website VARCHAR(500),
          phone VARCHAR(50),
          email VARCHAR(255),
          status ENUM('Active', 'Inactive') DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Projects table
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          developer VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          price VARCHAR(100) NOT NULL,
          status ENUM('Available', 'Sold', 'Under Construction') DEFAULT 'Available',
          bedrooms INT NOT NULL,
          bathrooms INT NOT NULL,
          studios INT DEFAULT 0,
          area VARCHAR(100) NOT NULL,
          description TEXT,
          image VARCHAR(500),
          gallery JSON,
          coordinates_lat DECIMAL(10, 8),
          coordinates_lng DECIMAL(11, 8),
          features JSON,
          amenities JSON,
          presentation_file VARCHAR(500),
          presentation_url VARCHAR(500),
          presentation_slides JSON,
          presentation_animations JSON,
          presentation_effects JSON,
          media_files JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Hero sections table
        CREATE TABLE IF NOT EXISTS hero_sections (
          id INT AUTO_INCREMENT PRIMARY KEY,
          page VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          subtitle VARCHAR(255),
          description TEXT,
          background_image VARCHAR(500),
          cta_text VARCHAR(100),
          cta_link VARCHAR(500),
          is_active BOOLEAN DEFAULT TRUE,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Articles table
        CREATE TABLE IF NOT EXISTS articles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content LONGTEXT,
          excerpt TEXT,
          featured_image VARCHAR(500),
          author VARCHAR(255),
          status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
          published_at TIMESTAMP NULL,
          tags JSON,
          category VARCHAR(100),
          read_time INT DEFAULT 5,
          meta_description TEXT,
          featured BOOLEAN DEFAULT FALSE,
          views_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Media files table
        CREATE TABLE IF NOT EXISTS media_files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          alt_text VARCHAR(255),
          uploaded_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
        );

        -- System logs table
        CREATE TABLE IF NOT EXISTS system_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          level ENUM('info', 'warning', 'error', 'success') NOT NULL,
          category VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          user_id INT,
          ip_address VARCHAR(45),
          user_agent TEXT,
          details JSON,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- Chat messages table
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          response TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          response_time INT NOT NULL,
          user_ip VARCHAR(45)
        );

        -- Presentation slides table
        CREATE TABLE IF NOT EXISTS presentation_slides (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT NOT NULL,
          slide_number INT NOT NULL,
          title VARCHAR(255),
          content TEXT,
          image_url VARCHAR(500),
          animation_type VARCHAR(100),
          duration INT DEFAULT 5000,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        -- Site settings table
        CREATE TABLE IF NOT EXISTS site_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          site_title VARCHAR(255) DEFAULT 'Premium Choice',
          site_description TEXT DEFAULT 'Your trusted partner in Dubai real estate',
          site_logo VARCHAR(500) DEFAULT '/logo.png',
          site_favicon VARCHAR(500) DEFAULT '/favicon.ico',
          contact_email VARCHAR(255) DEFAULT 'admin@example.com',
    contact_phone VARCHAR(50) DEFAULT NULL,
    contact_address TEXT DEFAULT 'Dubai, UAE',
    contact_whatsapp VARCHAR(50) DEFAULT NULL,
          social_facebook VARCHAR(500),
          social_instagram VARCHAR(500),
          social_twitter VARCHAR(500),
          social_linkedin VARCHAR(500),
          social_youtube VARCHAR(500),
          social_tiktok VARCHAR(500),
          social_snapchat VARCHAR(500),
          social_telegram VARCHAR(500),
          social_whatsapp VARCHAR(500),
          seo_meta_title VARCHAR(255) DEFAULT 'Premium Choice - Dubai Real Estate',
          seo_meta_description TEXT DEFAULT 'Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.',
          seo_keywords TEXT DEFAULT 'Dubai real estate, luxury properties, investment, Premium Choice',
          features_enable_blog BOOLEAN DEFAULT TRUE,
          features_enable_newsletter BOOLEAN DEFAULT TRUE,
          features_enable_whatsapp BOOLEAN DEFAULT TRUE,
          features_enable_live_chat BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Project media table for enhanced media management
        CREATE TABLE IF NOT EXISTS project_media (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          media_type ENUM('image', 'video', 'animation', 'pdf', 'pptx') NOT NULL,
          file_extension VARCHAR(10) NOT NULL,
          upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        -- Hero images table for landing page carousel
        CREATE TABLE IF NOT EXISTS hero_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          url VARCHAR(500) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          alt_text VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          order_index INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_active_order (is_active, order_index)
        );

        -- AI API settings table for AI integration control
        CREATE TABLE IF NOT EXISTS ai_api_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          openai_api_key VARCHAR(255),
          openai_model VARCHAR(100) DEFAULT 'gpt-3.5-turbo',
          openai_max_tokens INT DEFAULT 1000,
          openai_temperature DECIMAL(3,2) DEFAULT 0.70,
          google_api_key VARCHAR(255),
          google_model VARCHAR(100) DEFAULT 'gemini-pro',
          google_max_tokens INT DEFAULT 1000,
          google_temperature DECIMAL(3,2) DEFAULT 0.70,
          anthropic_api_key VARCHAR(255),
          anthropic_model VARCHAR(100) DEFAULT 'claude-3-sonnet-20240229',
          anthropic_max_tokens INT DEFAULT 1000,
          anthropic_temperature DECIMAL(3,2) DEFAULT 0.70,
          default_provider ENUM('openai', 'google', 'anthropic') DEFAULT 'openai',
          ai_enabled BOOLEAN DEFAULT TRUE,
          rate_limit_per_minute INT DEFAULT 10,
          rate_limit_per_hour INT DEFAULT 100,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;return await e.execute(t),e.release(),!0}catch(e){return!1}}static async createDefaultAdmin(){try{let e=await s.getConnection(),[t]=await e.execute('SELECT id FROM users WHERE role = "admin"');return 0===t.length&&await e.execute(`INSERT INTO users (email, password_hash, role, name, is_active) 
           VALUES (?, ?, 'admin', 'Admin', TRUE)`,["admin@example.com","Abedyr57.."]),e.release(),!0}catch(e){return!1}}static async updateArticlesTable(){try{let e=await s.getConnection();for(let t of[{name:"tags",definition:"JSON"},{name:"category",definition:"VARCHAR(100)"},{name:"read_time",definition:"INT DEFAULT 5"},{name:"meta_description",definition:"TEXT"},{name:"featured",definition:"BOOLEAN DEFAULT FALSE"},{name:"views_count",definition:"INT DEFAULT 0"}])try{let[a]=await e.execute(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND COLUMN_NAME = ?`,[t.name]);0===a.length&&await e.execute(`ALTER TABLE articles ADD COLUMN ${t.name} ${t.definition}`)}catch(e){}return e.release(),!0}catch(e){return!1}}static async getProjects(){let e;try{e=await s.getConnection();let[t]=await e.execute("SELECT * FROM projects ORDER BY created_at DESC"),a=e=>{if(!e)return null;if("string"==typeof e)try{return JSON.parse(e)}catch{return e.split(",").map(e=>e.trim()).filter(Boolean)}return e};return t.map(e=>({...e,gallery:a(e.gallery),features:a(e.features),amenities:a(e.amenities),property_types:a(e.property_types),sub_projects:a(e.sub_projects),media_files:a(e.media_files),units:a(e.units),property_type:a(e.property_type)}))}catch(e){return e instanceof Error&&e.message.includes("max_user_connections"),[]}finally{if(e)try{e.release()}catch(e){}}}static async getProjectsByDeveloper(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM projects WHERE developer = ? ORDER BY created_at DESC",[e]);t.release();let i=e=>{if(!e)return null;if("string"==typeof e)try{return JSON.parse(e)}catch{return e.split(",").map(e=>e.trim()).filter(Boolean)}return e};return a.map(e=>({...e,gallery:i(e.gallery),features:i(e.features),amenities:i(e.amenities),property_types:i(e.property_types),sub_projects:i(e.sub_projects),media_files:i(e.media_files),units:i(e.units),property_type:i(e.property_type)}))}catch(e){return[]}}static async getProjectBySlug(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM projects WHERE slug = ?",[e]);if(0===a.length)return t.release(),null;let i=a[0],[r]=await t.execute("SELECT * FROM presentation_slides WHERE project_id = ? ORDER BY slide_number ASC",[i.id]);t.release();let n=e=>{if(!e)return null;if("string"==typeof e)try{return JSON.parse(e)}catch{return e.split(",").map(e=>e.trim()).filter(Boolean)}return e};return{...i,gallery:n(i.gallery),features:n(i.features),amenities:n(i.amenities),property_types:n(i.property_types),sub_projects:n(i.sub_projects),media_files:n(i.media_files),presentation_slides:r}}catch(e){return null}}static async createProject(e){let t;try{if(!e.name||""===e.name.trim())throw Error("Project name is required");if(!e.description||""===e.description.trim())throw Error("Project description is required");t=await s.getConnection();let a=e=>void 0===e?null:e,i=e.slug||"",[r]=await t.execute("SELECT id FROM projects WHERE slug = ?",[i]);r.length>0&&(i=`${i}-${Date.now()}`);let[n]=await t.execute(`INSERT INTO projects (name, slug, developer, developer_id, location, price, status, bedrooms, bathrooms, area, 
         description, image, gallery, coordinates_lat, coordinates_lng, features, amenities,
         presentation_file, presentation_url, presentation_slides, presentation_animations, presentation_effects, 
         featured_video, studios, media_files)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[e.name||"",i,e.developer||"",e.developer_id||null,e.location||"",e.price||"Price on Request",e.status||"Available",e.bedrooms||0,e.bathrooms||0,e.area||"",e.description||"",e.image||"",JSON.stringify(e.gallery||[]),e.coordinates_lat||0,e.coordinates_lng||0,JSON.stringify(e.features||[]),JSON.stringify(e.amenities||[]),a(e.presentation_file),a(e.presentation_url),JSON.stringify(e.presentation_slides||{}),JSON.stringify(e.presentation_animations||{}),JSON.stringify(e.presentation_effects||{}),a(e.featured_video),e.studios||0,JSON.stringify(e.media_files||[])]),o=n.insertId;if(e.developer_id){let[a]=await t.execute("SELECT name FROM developers WHERE id = ?",[e.developer_id]);a.length>0&&await this.updateDeveloperProjectCount(a[0].name)}else e.developer&&await this.updateDeveloperProjectCount(e.developer);t.release();try{await this.createActivity({level:"success",category:"project",message:`Created new project "${e.name}" by ${e.developer||"Unknown Developer"}`,details:null})}catch(e){}return await this.getProjectById(o)}catch(e){if(t&&t.release(),"ER_DUP_ENTRY"===e.code){if(e.message.includes("name"))throw Error("A project with this name already exists. Please choose a different name.");if(e.message.includes("slug"))throw Error("A project with this URL slug already exists. Please modify the project name.");throw Error("A project with these details already exists. Please check for duplicates.")}if("ER_DATA_TOO_LONG"===e.code)throw Error("One or more fields contain too much data. Please shorten your input.");if("ER_BAD_NULL_ERROR"===e.code)throw Error("Required field is missing. Please fill in all required fields.");if(e.message.includes("required"))throw e;else throw Error("Database error occurred while creating the project. Please try again.")}}static async getProjectById(e){let t;try{t=await s.getConnection();let[a]=await t.execute("SELECT * FROM projects WHERE id = ?",[e]);if(0===a.length)return null;let i=a[0],r=e=>{if(!e)return null;if("string"==typeof e)try{return JSON.parse(e)}catch{return e.split(",").map(e=>e.trim()).filter(Boolean)}return e};return{...i,gallery:r(i.gallery),features:r(i.features),amenities:r(i.amenities),property_types:r(i.property_types),sub_projects:r(i.sub_projects),media_files:r(i.media_files),units:r(i.units),property_type:r(i.property_type)}}catch(e){throw e}finally{t&&t.release()}}static async updateProject(e,t){try{let a=await s.getConnection(),[i]=await a.execute("SELECT developer FROM projects WHERE id = ?",[e]),r=i[0],n=r?.developer,o=Object.keys(t).filter(e=>"id"!==e),l=o.map(e=>`${e} = ?`).join(", "),c=o.map(e=>{let a=t[e];return"object"==typeof a?JSON.stringify(a):a});await a.execute(`UPDATE projects SET ${l}, updated_at = NOW() WHERE id = ?`,[...c,e]);let p=t.developer;p&&p!==n&&(n&&await this.updateDeveloperProjectCount(n),await this.updateDeveloperProjectCount(p)),a.release();try{let a=await this.getProjectById(e),i=Object.keys(t),r=1===i.length?i[0]:`${i.length} fields`;await this.createActivity({level:"info",category:"project",message:`Updated ${r} for project "${a?.name||"Unknown"}"`,details:null})}catch(e){}return await this.getProjectById(e)}catch(e){return null}}static async deleteProject(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT id, developer FROM projects WHERE id = ?",[e]);if(0===a.length)return t.release(),!1;let i=a[0].developer,[r]=await t.execute("SELECT name FROM projects WHERE id = ?",[e]),n=r[0]?.name||"Unknown",[o]=await t.execute("DELETE FROM projects WHERE id = ?",[e]);i&&await this.updateDeveloperProjectCount(i),t.release();let l=o.affectedRows;if(l>0)try{await this.createActivity({level:"warning",category:"project",message:`Deleted project "${n}" by ${i||"Unknown Developer"}`,details:null})}catch(e){}return l>0}catch(e){return!1}}static async getDevelopers(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT * FROM developers ORDER BY name ASC");return e.release(),t}catch(e){return[]}}static async createDeveloper(e){try{let t=await s.getConnection(),[a]=await t.execute(`INSERT INTO developers (name, slug, description, logo, established, projects_count, 
         location, website, phone, email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[e.name,e.slug,e.description,e.logo,e.established,e.projects_count,e.location,e.website,e.phone,e.email,e.status]),i=a.insertId;t.release();try{await this.createActivity({level:"success",category:"developer",message:`Added new developer "${e.name}" from ${e.location||"Unknown Location"}`,details:null})}catch(e){}return await this.getDeveloperById(i)}catch(e){return null}}static async getDeveloperById(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM developers WHERE id = ?",[e]);return t.release(),a.length>0?a[0]:null}catch(e){return null}}static async updateDeveloper(e,t){try{let a=await s.getConnection(),[i]=await a.execute("SELECT name FROM developers WHERE id = ?",[e]),r=i[0],n=r?.name||"Unknown Developer",o=Object.keys(t).filter(e=>"id"!==e),l=o.map(e=>`${e} = ?`).join(", "),c=o.map(e=>t[e]);await a.execute(`UPDATE developers SET ${l}, updated_at = NOW() WHERE id = ?`,[...c,e]),a.release();try{await this.createActivity({level:"info",category:"developer",message:`Developer updated: ${n}`,details:JSON.stringify({developerId:e,updatedFields:o})})}catch(e){}return await this.getDeveloperById(e)}catch(e){return null}}static async deleteDeveloper(e){try{let t=await s.getConnection();return await t.execute("DELETE FROM developers WHERE id = ?",[e]),t.release(),!0}catch(e){return!1}}static async updateDeveloperProjectCount(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT COUNT(*) as project_count FROM projects WHERE developer = ?",[e]),i=a[0].project_count;await t.execute("UPDATE developers SET projects_count = ?, updated_at = NOW() WHERE name = ?",[i,e]),t.release()}catch(e){}}static async getProjectsByDeveloperId(e){try{let t=await s.getConnection(),[a]=await t.execute(`SELECT p.*, d.name as developer_name, d.slug as developer_slug 
         FROM projects p 
         LEFT JOIN developers d ON p.developer_id = d.id 
         WHERE p.developer_id = ? 
         ORDER BY p.created_at DESC`,[e]);return t.release(),a}catch(e){return[]}}static async getDeveloperWithProjects(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM developers WHERE id = ?",[e]);if(0===a.length)return t.release(),null;let i=a[0],[r]=await t.execute("SELECT * FROM projects WHERE developer_id = ? ORDER BY created_at DESC",[e]);return t.release(),{...i,projects:r}}catch(e){return null}}static async assignProjectToDeveloper(e,t){try{let a=await s.getConnection();return await a.execute("UPDATE projects SET developer_id = ?, updated_at = NOW() WHERE id = ?",[t,e]),await a.execute("UPDATE developers SET projects_count = projects_count + 1, updated_at = NOW() WHERE id = ?",[t]),a.release(),!0}catch(e){return!1}}static async unassignProjectFromDeveloper(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT developer_id FROM projects WHERE id = ?",[e]);if(a.length>0){let i=a[0].developer_id;i&&(await t.execute("UPDATE projects SET developer_id = NULL, updated_at = NOW() WHERE id = ?",[e]),await t.execute("UPDATE developers SET projects_count = projects_count - 1, updated_at = NOW() WHERE id = ?",[i]))}return t.release(),!0}catch(e){return!1}}static async deleteDeveloperWithCascade(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT name FROM developers WHERE id = ?",[e]),i=a[0]?.name||"Unknown Developer";await t.beginTransaction();try{let[a]=await t.execute("SELECT COUNT(*) as project_count FROM projects WHERE developer_id = ?",[e]),r=a[0].project_count;await t.execute("DELETE FROM projects WHERE developer_id = ?",[e]),await t.execute("DELETE FROM developers WHERE id = ?",[e]),await t.commit(),t.release();try{await this.createActivity({level:"warning",category:"developer",message:`Developer deleted: ${i}`,details:JSON.stringify({developerId:e,deletedProjects:r})})}catch(e){}return{success:!0,deletedProjects:r}}catch(e){throw await t.rollback(),t.release(),e}}catch(e){return{success:!1,deletedProjects:0}}}static async createProjectWithDeveloper(e,t){try{let a=await s.getConnection();await a.beginTransaction();try{let i={...e,developer_id:t||null},[r]=await a.execute(`INSERT INTO projects (
            name, slug, project_name, sub_project, display_title, developer, developer_id,
            location, price, starting_price, status, project_type, type, category,
            color_palette, property_type, property_types, sub_projects, bedrooms, bathrooms,
            studios, units_1bedroom, units_2bedroom, units_3bedroom, units_4bedroom,
            units_5bedroom, units_office, living_rooms, units, area, description, image,
            gallery, coordinates_lat, coordinates_lng, features, amenities, is_featured,
            brochure_url, theme_color, voice_over_url, presentation_file, presentation_url,
            media_type, featured_video, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,[i.name,i.slug,i.project_name||null,i.sub_project||null,i.display_title||null,i.developer,i.developer_id,i.location,i.price||null,i.starting_price||null,i.status||"Active",i.project_type||null,i.type||null,i.category||null,i.color_palette||null,JSON.stringify(i.property_type||[]),JSON.stringify(i.property_types||[]),JSON.stringify(i.sub_projects||[]),i.bedrooms||0,i.bathrooms||0,i.studios||0,i.units_1bedroom||0,i.units_2bedroom||0,i.units_3bedroom||0,i.units_4bedroom||0,i.units_5bedroom||0,i.units_office||0,i.living_rooms||0,JSON.stringify(i.units||[]),i.area,i.description,i.image,JSON.stringify(i.gallery||[]),i.coordinates_lat,i.coordinates_lng,JSON.stringify(i.features||[]),JSON.stringify(i.amenities||[]),i.is_featured||!1,i.brochure_url||null,i.theme_color||null,i.voice_over_url||null,i.presentation_file||null,i.presentation_url||null,i.media_type||null,i.featured_video||null]),s=r.insertId;t&&await a.execute("UPDATE developers SET projects_count = projects_count + 1, updated_at = NOW() WHERE id = ?",[t]),await a.commit();let[n]=await a.execute("SELECT * FROM projects WHERE id = ?",[s]);if(a.release(),n.length>0){let e=n[0];return{...e,property_type:e.property_type?"string"==typeof e.property_type?JSON.parse(e.property_type):e.property_type:[],property_types:e.property_types?"string"==typeof e.property_types?JSON.parse(e.property_types):e.property_types:[],sub_projects:e.sub_projects?"string"==typeof e.sub_projects?JSON.parse(e.sub_projects):e.sub_projects:[],units:e.units?"string"==typeof e.units?JSON.parse(e.units):e.units:[],gallery:e.gallery?"string"==typeof e.gallery?JSON.parse(e.gallery):e.gallery:[],features:e.features?"string"==typeof e.features?JSON.parse(e.features):e.features:[],amenities:e.amenities?"string"==typeof e.amenities?JSON.parse(e.amenities):e.amenities:[]}}return null}catch(e){throw await a.rollback(),a.release(),e}}catch(e){return null}}static async getArticles(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT * FROM articles ORDER BY created_at DESC");return e.release(),t.map(e=>({...e,tags:e.tags?"string"==typeof e.tags?JSON.parse(e.tags):e.tags:[],category:e.category||"",read_time:e.read_time||5,meta_description:e.meta_description||"",featured:e.featured||!1,views_count:e.views_count||0}))}catch(e){return[]}}static async createArticle(e){try{let t=await s.getConnection();try{let[a]=await t.execute(`INSERT INTO articles (title, slug, content, excerpt, featured_image, author, status, published_at, tags, category, read_time, meta_description, featured, views_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[e.title,e.slug,e.content,e.excerpt,e.featured_image,e.author,e.status,e.published_at,JSON.stringify(e.tags||[]),e.category,e.read_time,e.meta_description,e.featured||!1,e.views_count||0]),i=a.insertId;return t.release(),await this.getArticleById(i)}catch(r){let[a]=await t.execute(`INSERT INTO articles (title, slug, content, excerpt, featured_image, author, status, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[e.title,e.slug,e.content,e.excerpt,e.featured_image,e.author,e.status,e.published_at]),i=a.insertId;return t.release(),await this.getArticleById(i)}}catch(e){return null}}static async getArticleById(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM articles WHERE id = ?",[e]);if(t.release(),a.length>0){let e=a[0];return{...e,tags:e.tags?"string"==typeof e.tags?JSON.parse(e.tags):e.tags:[],category:e.category||"",read_time:e.read_time||5,meta_description:e.meta_description||"",featured:e.featured||!1,views_count:e.views_count||0}}return null}catch(e){return null}}static async updateArticle(e,t){try{let a=await s.getConnection(),i={...t};i.tags&&(i.tags=JSON.stringify(i.tags));let r=Object.keys(i).filter(e=>"id"!==e),n=r.map(e=>`${e} = ?`).join(", "),o=r.map(e=>i[e]);return await a.execute(`UPDATE articles SET ${n}, updated_at = NOW() WHERE id = ?`,[...o,e]),a.release(),await this.getArticleById(e)}catch(e){return null}}static async deleteArticle(e){try{let t=await s.getConnection();return await t.execute("DELETE FROM articles WHERE id = ?",[e]),t.release(),!0}catch(e){return!1}}static async getArticleBySlug(e){try{let t=await s.getConnection(),[a]=await t.execute('SELECT * FROM articles WHERE slug = ? AND status = "published"',[e]);if(t.release(),a.length>0){let e=a[0];return{...e,tags:e.tags?"string"==typeof e.tags?JSON.parse(e.tags):e.tags:[],category:e.category||"",read_time:e.read_time||5,meta_description:e.meta_description||"",featured:e.featured||!1,views_count:e.views_count||0}}return null}catch(e){return null}}static async getPublishedArticles(e){try{let t=await s.getConnection(),a='SELECT * FROM articles WHERE status = "published" ORDER BY published_at DESC, created_at DESC',i=[];e?.limit&&(a+=" LIMIT ?",i.push(e.limit));let[r]=await t.execute(a,i);return t.release(),r.map(e=>({...e,tags:e.tags?"string"==typeof e.tags?JSON.parse(e.tags):e.tags:[],category:e.category||"",read_time:e.read_time||5,meta_description:e.meta_description||"",featured:e.featured||!1,views_count:e.views_count||0}))}catch(e){return[]}}static async getMediaFiles(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT * FROM media_files ORDER BY created_at DESC");return e.release(),t}catch(e){return[]}}static async createMediaFile(e){try{let t=await s.getConnection(),[a]=await t.execute(`INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, alt_text, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,[e.filename,e.original_name,e.file_path,e.file_size,e.mime_type,e.alt_text,e.uploaded_by]),i=a.insertId;return t.release(),await this.getMediaFileById(i)}catch(e){return null}}static async getMediaFileById(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM media_files WHERE id = ?",[e]);return t.release(),a.length>0?a[0]:null}catch(e){return null}}static async updateMediaFile(e,t){try{let a=await s.getConnection(),i=Object.keys(t).filter(e=>"id"!==e&&"created_at"!==e&&void 0!==t[e]);if(0===i.length)return a.release(),!0;let r=i.map(e=>`${e} = ?`).join(", "),n=i.map(e=>t[e]),[o]=await a.execute(`UPDATE media_files SET ${r} WHERE id = ?`,[...n,e]);return a.release(),o.affectedRows>0}catch(e){return!1}}static async deleteMediaFile(e){try{let t=await s.getConnection();return await t.execute("DELETE FROM media_files WHERE id = ?",[e]),t.release(),!0}catch(e){return!1}}static async getHeroSections(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT * FROM hero_sections ORDER BY id DESC");return e.release(),t}catch(e){return[]}}static async createHeroSection(e){try{let t=await s.getConnection(),[a]=await t.execute(`INSERT INTO hero_sections (page, title, subtitle, description, background_image, cta_text, cta_link, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[e.page,e.title,e.subtitle,e.description,e.background_image,e.cta_text,e.cta_link,e.is_active]),i=a.insertId;return t.release(),await this.getHeroSectionById(i)}catch(e){return null}}static async getHeroSectionById(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM hero_sections WHERE id = ?",[e]);return t.release(),a.length>0?a[0]:null}catch(e){return null}}static async updateHeroSection(e,t){try{let a=await s.getConnection(),i=Object.keys(t).filter(e=>"id"!==e),r=i.map(e=>`${e} = ?`).join(", "),n=i.map(e=>t[e]);return await a.execute(`UPDATE hero_sections SET ${r}, updated_at = NOW() WHERE id = ?`,[...n,e]),a.release(),await this.getHeroSectionById(e)}catch(e){return null}}static async deleteHeroSection(e){try{let t=await s.getConnection();return await t.execute("DELETE FROM hero_sections WHERE id = ?",[e]),t.release(),!0}catch(e){return!1}}static async getUserByEmail(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM users WHERE email = ? AND is_active = TRUE",[e]);return t.release(),a.length>0?a[0]:null}catch(e){return null}}static async updateUserLastLogin(e){try{let t=await s.getConnection();return await t.execute("UPDATE users SET last_login = NOW() WHERE id = ?",[e]),t.release(),!0}catch(e){return!1}}static async createLog(e){try{let t=await s.getConnection();return await t.execute(`INSERT INTO system_logs (level, category, message, user_id, ip_address, user_agent, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,[e.level,e.category,e.message,e.user_id,e.ip_address,e.user_agent,JSON.stringify(e.details||{})]),t.release(),!0}catch(e){return!1}}static async getSystemStats(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT COUNT(*) as count FROM projects"),[a]=await e.execute("SELECT COUNT(*) as count FROM developers"),[i]=await e.execute("SELECT COUNT(*) as count FROM users"),[r]=await e.execute("SELECT COUNT(*) as count FROM system_logs");return e.release(),{totalProjects:t[0].count,totalDevelopers:a[0].count,totalUsers:i[0].count,totalLogs:r[0].count,lastBackup:new Date}}catch(e){return{totalProjects:0,totalDevelopers:0,totalUsers:0,totalLogs:0,lastBackup:new Date}}}static async getSettings(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT * FROM site_settings ORDER BY id DESC LIMIT 1");if(e.release(),!(t.length>0))return{site:{title:"Premium Choice",description:"Your trusted partner in Dubai real estate",logo:"/logo.png",favicon:"/favicon.ico"},contact:{email:"admin@example.com",phone:null,address:"Dubai, UAE",whatsapp:null},social:{facebook:"",instagram:"",twitter:"",linkedin:"",youtube:"",tiktok:"",snapchat:"",telegram:"",whatsapp:""},seo:{metaTitle:"Premium Choice - Dubai Real Estate",metaDescription:"Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.",keywords:"Dubai real estate, luxury properties, investment, Premium Choice"},features:{enableBlog:!0,enableNewsletter:!0,enableWhatsApp:!0,enableLiveChat:!1},whatsapp:{phone:null,enabled:!0,defaultMessage:"Hello! I'm interested in your real estate services.",businessHours:null,autoReply:null,showOnPages:["home","projects","contact"]}};{let e=t[0];return{site:{title:e.site_title||"Premium Choice",description:e.site_description||"Your trusted partner in Dubai real estate",logo:e.site_logo||"/logo.png",favicon:e.site_favicon||"/favicon.ico"},contact:{email:e.contact_email||"admin@example.com",phone:e.contact_phone||null,address:e.contact_address||"Dubai, UAE",whatsapp:e.contact_whatsapp||e.whatsapp_phone||null},social:{facebook:e.social_facebook||"",instagram:e.social_instagram||"",twitter:e.social_twitter||"",linkedin:e.social_linkedin||"",youtube:e.social_youtube||"",tiktok:e.social_tiktok||"",snapchat:e.social_snapchat||"",telegram:e.social_telegram||"",whatsapp:e.social_whatsapp||""},seo:{metaTitle:e.seo_meta_title||"Premium Choice - Dubai Real Estate",metaDescription:e.seo_meta_description||"Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.",keywords:e.seo_keywords||"Dubai real estate, luxury properties, investment, Premium Choice"},features:{enableBlog:!1!==e.features_enable_blog,enableNewsletter:!1!==e.features_enable_newsletter,enableWhatsApp:!1!==e.features_enable_whatsapp,enableLiveChat:!0===e.features_enable_live_chat},whatsapp:{phone:e.whatsapp_phone||e.contact_whatsapp||null,enabled:!1!==e.whatsapp_enabled,defaultMessage:e.whatsapp_default_message||"Hello! I'm interested in your real estate services.",businessHours:e.whatsapp_business_hours?JSON.parse(e.whatsapp_business_hours):null,autoReply:e.whatsapp_auto_reply||null,showOnPages:e.whatsapp_show_on_pages?JSON.parse(e.whatsapp_show_on_pages):["home","projects","contact"]}}}}catch(e){return{site:{title:"Premium Choice",description:"Your trusted partner in Dubai real estate",logo:"/logo.png",favicon:"/favicon.ico"},contact:{email:"admin@example.com",phone:null,address:"Dubai, UAE",whatsapp:null},social:{facebook:"",instagram:"",twitter:"",linkedin:"",youtube:"",tiktok:"",snapchat:"",telegram:"",whatsapp:""},seo:{metaTitle:"Premium Choice - Dubai Real Estate",metaDescription:"Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.",keywords:"Dubai real estate, luxury properties, investment, Premium Choice"},features:{enableBlog:!0,enableNewsletter:!0,enableWhatsApp:!0,enableLiveChat:!1},whatsapp:{phone:null,enabled:!0,defaultMessage:"Hello! I'm interested in your real estate services.",businessHours:null,autoReply:null,showOnPages:["home","projects","contact"]}}}}static async updateSettings(e){try{let t=await s.getConnection(),a={};e.site&&(e.site.title&&(a.site_title=e.site.title),e.site.description&&(a.site_description=e.site.description),e.site.logo&&(a.site_logo=e.site.logo),e.site.favicon&&(a.site_favicon=e.site.favicon)),e.contact&&(e.contact.email&&(a.contact_email=e.contact.email),e.contact.phone&&(a.contact_phone=e.contact.phone),e.contact.address&&(a.contact_address=e.contact.address),e.contact.whatsapp&&(a.contact_whatsapp=e.contact.whatsapp)),e.social&&(void 0!==e.social.facebook&&(a.social_facebook=e.social.facebook),void 0!==e.social.instagram&&(a.social_instagram=e.social.instagram),void 0!==e.social.twitter&&(a.social_twitter=e.social.twitter),void 0!==e.social.linkedin&&(a.social_linkedin=e.social.linkedin),void 0!==e.social.youtube&&(a.social_youtube=e.social.youtube),void 0!==e.social.tiktok&&(a.social_tiktok=e.social.tiktok),void 0!==e.social.snapchat&&(a.social_snapchat=e.social.snapchat),void 0!==e.social.telegram&&(a.social_telegram=e.social.telegram),void 0!==e.social.whatsapp&&(a.social_whatsapp=e.social.whatsapp)),e.seo&&(e.seo.metaTitle&&(a.seo_meta_title=e.seo.metaTitle),e.seo.metaDescription&&(a.seo_meta_description=e.seo.metaDescription),e.seo.keywords&&(a.seo_keywords=e.seo.keywords)),e.features&&(void 0!==e.features.enableBlog&&(a.features_enable_blog=e.features.enableBlog),void 0!==e.features.enableNewsletter&&(a.features_enable_newsletter=e.features.enableNewsletter),void 0!==e.features.enableWhatsApp&&(a.features_enable_whatsapp=e.features.enableWhatsApp),void 0!==e.features.enableLiveChat&&(a.features_enable_live_chat=e.features.enableLiveChat)),e.whatsapp&&(void 0!==e.whatsapp.phone&&(a.whatsapp_phone=e.whatsapp.phone),void 0!==e.whatsapp.enabled&&(a.whatsapp_enabled=e.whatsapp.enabled),void 0!==e.whatsapp.defaultMessage&&(a.whatsapp_default_message=e.whatsapp.defaultMessage),void 0!==e.whatsapp.businessHours&&(a.whatsapp_business_hours=e.whatsapp.businessHours?JSON.stringify(e.whatsapp.businessHours):null),void 0!==e.whatsapp.autoReply&&(a.whatsapp_auto_reply=e.whatsapp.autoReply),void 0!==e.whatsapp.showOnPages&&(a.whatsapp_show_on_pages=e.whatsapp.showOnPages?JSON.stringify(e.whatsapp.showOnPages):null));let[i]=await t.execute("SELECT id FROM site_settings LIMIT 1");if(i.length>0){let e=Object.keys(a);if(e.length>0){let r=e.map(e=>`${e} = ?`).join(", "),s=e.map(e=>a[e]);await t.execute(`UPDATE site_settings SET ${r}, updated_at = NOW() WHERE id = ?`,[...s,i[0].id])}}else{let e={site_title:"Premium Choice",site_description:"Your trusted partner in Dubai real estate",site_logo:"/logo.png",site_favicon:"/favicon.ico",contact_email:"admin@example.com",contact_phone:null,contact_address:"Dubai, UAE",contact_whatsapp:null,social_facebook:"",social_instagram:"",social_twitter:"",social_linkedin:"",social_youtube:"",seo_meta_title:"Premium Choice - Dubai Real Estate",seo_meta_description:"Discover premium real estate opportunities in Dubai with Premium Choice. Your trusted partner for luxury properties and investment solutions.",seo_keywords:"Dubai real estate, luxury properties, investment, Premium Choice",features_enable_blog:!0,features_enable_newsletter:!0,features_enable_whatsapp:!0,features_enable_live_chat:!1,...a},i=Object.keys(e),r=i.map(()=>"?").join(", "),s=i.map(t=>e[t]);await t.execute(`INSERT INTO site_settings (${i.join(", ")}, created_at, updated_at) VALUES (${r}, NOW(), NOW())`,s)}return t.release(),await this.getSettings()}catch(e){throw e}}static async getPresentationSlides(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT * FROM presentation_slides WHERE project_id = ? ORDER BY slide_number ASC",[e]);return t.release(),a}catch(e){return[]}}static async createPresentationSlide(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT COALESCE(MAX(slide_number), 0) + 1 as next_slide_number FROM presentation_slides WHERE project_id = ?",[e.project_id]),i=a[0].next_slide_number,[r]=await t.execute(`INSERT INTO presentation_slides 
         (project_id, slide_number, title, content, description, image_url, background_image, animation_type, duration, voice_over_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[e.project_id,e.slide_number||i,e.title,e.content,e.description||null,e.image_url||null,e.background_image||null,e.animation_type||"fadeIn",e.duration||5e3,e.voice_over_url||null]);return t.release(),r.insertId}catch(e){throw e}}static async updatePresentationSlide(e,t){try{let a=await s.getConnection(),i=Object.keys(t).filter(e=>"id"!==e&&"created_at"!==e),r=i.map(e=>`${e} = ?`).join(", "),n=i.map(e=>t[e]);return await a.execute(`UPDATE presentation_slides SET ${r} WHERE id = ?`,[...n,e]),a.release(),!0}catch(e){return!1}}static async deletePresentationSlide(e){try{let t=await s.getConnection();return await t.execute("DELETE FROM presentation_slides WHERE id = ?",[e]),t.release(),!0}catch(e){return!1}}static async deletePresentationSlidesByProject(e){try{let t=await s.getConnection();return await t.execute("DELETE FROM presentation_slides WHERE project_id = ?",[e]),t.release(),!0}catch(e){return!1}}static async getHeroImages(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT * FROM hero_images ORDER BY order_index ASC, created_at DESC");return e.release(),t}catch(e){return[]}}static async createHeroImage(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM hero_images"),i=a[0].next_order,[r]=await t.execute(`INSERT INTO hero_images 
         (url, title, description, alt_text, is_active, order_index, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,[e.url,e.title,e.description||null,e.alt_text||e.title,void 0===e.is_active||e.is_active,e.order_index||i]),n=r.insertId,[o]=await t.execute("SELECT * FROM hero_images WHERE id = ?",[n]);return t.release(),o[0]}catch(e){throw e}}static async updateHeroImage(e,t){try{let a=await s.getConnection(),i=Object.keys(t).filter(e=>"id"!==e&&"created_at"!==e&&"updated_at"!==e);if(0===i.length)return a.release(),!0;let r=i.map(e=>`${e} = ?`).join(", "),n=i.map(e=>t[e]),[o]=await a.execute(`UPDATE hero_images SET ${r}, updated_at = NOW() WHERE id = ?`,[...n,e]);return a.release(),o.affectedRows>0}catch(e){return!1}}static async deleteHeroImage(e){try{let t=await s.getConnection(),[a]=await t.execute("DELETE FROM hero_images WHERE id = ?",[e]);return t.release(),a.affectedRows>0}catch(e){return!1}}static async getAISettings(){try{let e=await s.getConnection(),[t]=await e.execute("SELECT * FROM ai_api_settings ORDER BY created_at DESC LIMIT 1");return e.release(),t.length>0?t[0]:null}catch(e){return null}}static async saveAISettings(e){try{let t=await s.getConnection(),[a]=await t.execute("SELECT id FROM ai_api_settings LIMIT 1");return a.length>0?await t.execute(`UPDATE ai_api_settings SET 
           openai_api_key = ?, openai_model = ?, openai_max_tokens = ?, openai_temperature = ?,
           gemini_api_key = ?, gemini_model = ?, claude_api_key = ?, claude_model = ?,
           deepseek_api_key = ?, deepseek_model = ?, deepseek_max_tokens = ?, deepseek_temperature = ?,
           default_provider = ?, ai_enabled = ?, rate_limit_per_minute = ?, rate_limit_per_hour = ?,
           system_prompt = ?, property_suggestions_enabled = ?, property_suggestions_count = ?, contact_info_in_responses = ?,
           updated_at = NOW()
           WHERE id = ?`,[e.openai_api_key||"",e.openai_model||"gpt-3.5-turbo",e.openai_max_tokens||1e3,e.openai_temperature||.7,e.gemini_api_key||"",e.gemini_model||"gemini-pro",e.claude_api_key||"",e.claude_model||"claude-3-sonnet-20240229",e.deepseek_api_key||"",e.deepseek_model||"deepseek-chat",e.deepseek_max_tokens||1e3,e.deepseek_temperature||.7,e.default_provider||"openai",void 0===e.ai_enabled||e.ai_enabled,e.rate_limit_per_minute||10,e.rate_limit_per_hour||100,e.system_prompt||"You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market.",void 0===e.property_suggestions_enabled||e.property_suggestions_enabled,e.property_suggestions_count||4,void 0===e.contact_info_in_responses||e.contact_info_in_responses,a[0].id]):await t.execute(`INSERT INTO ai_api_settings 
           (openai_api_key, openai_model, openai_max_tokens, openai_temperature,
            gemini_api_key, gemini_model, claude_api_key, claude_model,
            deepseek_api_key, deepseek_model, deepseek_max_tokens, deepseek_temperature,
            default_provider, ai_enabled, rate_limit_per_minute, rate_limit_per_hour,
            system_prompt, property_suggestions_enabled, property_suggestions_count, contact_info_in_responses,
            created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,[e.openai_api_key||"",e.openai_model||"gpt-3.5-turbo",e.openai_max_tokens||1e3,e.openai_temperature||.7,e.gemini_api_key||"",e.gemini_model||"gemini-pro",e.claude_api_key||"",e.claude_model||"claude-3-sonnet-20240229",e.deepseek_api_key||"",e.deepseek_model||"deepseek-chat",e.deepseek_max_tokens||1e3,e.deepseek_temperature||.7,e.default_provider||"openai",void 0===e.ai_enabled||e.ai_enabled,e.rate_limit_per_minute||10,e.rate_limit_per_hour||100,e.system_prompt||"You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market.",void 0===e.property_suggestions_enabled||e.property_suggestions_enabled,e.property_suggestions_count||4,void 0===e.contact_info_in_responses||e.contact_info_in_responses]),t.release(),await this.getAISettings()}catch(e){throw e}}static async getRecentActivities(e=10,t=!1){try{let a=await s.getConnection(),i=`SELECT id, timestamp, level, category, message, details 
                   FROM system_logs`,r=[];t&&(i+=" WHERE category IN ('project', 'developer', 'article', 'media')"),i+=" ORDER BY timestamp DESC LIMIT ?",r.push(e);let[n]=await a.execute(i,r);return a.release(),n.map(e=>({id:e.id,timestamp:e.timestamp,level:e.level,category:e.category,message:e.message,details:e.details?JSON.parse(e.details):null}))}catch(e){throw e}}static async createActivity(e){try{let t=await s.getConnection(),[a]=await t.execute(`INSERT INTO system_logs (level, category, message, details, timestamp) 
         VALUES (?, ?, ?, ?, NOW())`,[e.level,e.category,e.message,e.details]),i=a.insertId,[r]=await t.execute(`SELECT id, timestamp, level, category, message, details 
         FROM system_logs 
         WHERE id = ?`,[i]);t.release();let n=r[0];return{id:n.id,timestamp:n.timestamp,level:n.level,category:n.category,message:n.message,details:n.details?JSON.parse(n.details):null}}catch(e){throw e}}}let o=n.query.bind(n);async function l(){return s}async function c(){return await s.getConnection()}let p=n}};