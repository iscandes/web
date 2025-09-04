"use strict";(()=>{var e={};e.id=5148,e.ids=[5148],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},41808:e=>{e.exports=require("net")},77282:e=>{e.exports=require("process")},12781:e=>{e.exports=require("stream")},71576:e=>{e.exports=require("string_decoder")},39512:e=>{e.exports=require("timers")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},84838:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>T,patchFetch:()=>R,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>E,staticGenerationAsyncStorage:()=>m});var a={};s.r(a),s.d(a,{GET:()=>c,PUT:()=>l});var r=s(49303),n=s(88716),i=s(60670),u=s(87070),o=s(69612);async function c(e){try{let{searchParams:t}=new URL(e.url),s=parseInt(t.get("limit")||"50"),a=parseInt(t.get("offset")||"0");if("true"===t.get("stats")){let e=await (0,o.si)();return u.NextResponse.json({success:!0,stats:e})}let r=await (0,o.us)(s,a),n=await (0,o.si)();return u.NextResponse.json({success:!0,submissions:r,stats:n,pagination:{limit:s,offset:a,total:n.total}})}catch(e){return u.NextResponse.json({success:!1,message:"Failed to fetch contact submissions"},{status:500})}}async function l(e){try{let{id:t,status:s}=await e.json();if(!t||!s)return u.NextResponse.json({success:!1,message:"ID and status are required"},{status:400});if(!["new","read","replied"].includes(s))return u.NextResponse.json({success:!1,message:"Invalid status. Must be: new, read, or replied"},{status:400});return await (0,o.yo)(t,s),u.NextResponse.json({success:!0,message:"Contact submission status updated successfully"})}catch(e){return u.NextResponse.json({success:!1,message:"Failed to update contact submission"},{status:500})}}let p=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/contact-submissions/route",pathname:"/api/admin/contact-submissions",filename:"route",bundlePath:"app/api/admin/contact-submissions/route"},resolvedPagePath:"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\api\\admin\\contact-submissions\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:d,staticGenerationAsyncStorage:m,serverHooks:E}=p,T="/api/admin/contact-submissions/route";function R(){return(0,i.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:m})}},69612:(e,t,s)=>{s.d(t,{Do:()=>n,n7:()=>r,si:()=>o,us:()=>i,yo:()=>u});var a=s(8852);async function r(){let e;try{e=await (0,a.B5)(),await e.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(500),
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)}catch(e){throw e}finally{e&&e.release()}}async function n(e){let t;try{return t=await (0,a.B5)(),(await t.execute(`INSERT INTO contact_submissions (name, email, phone, subject, message, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?)`,[e.name,e.email,e.phone||null,e.subject||null,e.message,e.ip_address||null])).insertId}catch(e){throw e}finally{t&&t.release()}}async function i(e=50,t=0){let s;try{s=await (0,a.B5)();let[r]=await s.execute(`SELECT id, name, email, phone, subject, message, status, created_at 
       FROM contact_submissions 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,[e,t]);return r}catch(e){throw e}finally{s&&s.release()}}async function u(e,t){let s;try{return s=await (0,a.B5)(),await s.execute("UPDATE contact_submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",[t,e]),!0}catch(e){throw e}finally{s&&s.release()}}async function o(){let e;try{e=await (0,a.B5)();let[t]=await e.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM contact_submissions 
      GROUP BY status
    `),s={new:0,read:0,replied:0,total:0};return t.forEach(e=>{s[e.status]=e.count,s.total+=e.count}),s}catch(e){throw e}finally{e&&e.release()}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[8948,5972,3785,5802],()=>s(84838));module.exports=a})();