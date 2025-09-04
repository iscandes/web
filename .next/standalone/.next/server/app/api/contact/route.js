"use strict";(()=>{var e={};e.id=386,e.ids=[386],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},32081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},77282:e=>{e.exports=require("process")},12781:e=>{e.exports=require("stream")},71576:e=>{e.exports=require("string_decoder")},39512:e=>{e.exports=require("timers")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},74015:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>x,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var r={};s.r(r),s.d(r,{OPTIONS:()=>u,POST:()=>c});var a=s(49303),o=s(88716),i=s(60670),n=s(87070),l=s(36119),p=s(69612);async function c(e){try{let t=await e.json(),s=function(e){var t;let s=[];if((!e.name||"string"!=typeof e.name||e.name.trim().length<2)&&s.push("Name is required and must be at least 2 characters long"),e.email&&"string"==typeof e.email&&(t=e.email,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))||s.push("Valid email address is required"),(!e.message||"string"!=typeof e.message||e.message.trim().length<10)&&s.push("Message is required and must be at least 10 characters long"),e.phone&&"string"==typeof e.phone&&e.phone.trim().length>0&&!/^[+]?[0-9\s\-\(\)]{7,20}$/.test(e.phone.trim())&&s.push("Invalid phone number format"),s.length>0)return{isValid:!1,errors:s};let r={name:e.name.trim(),email:e.email.trim().toLowerCase(),message:e.message.trim()};return e.phone&&"string"==typeof e.phone&&e.phone.trim().length>0&&(r.phone=e.phone.trim()),e.subject&&"string"==typeof e.subject&&e.subject.trim().length>0&&(r.subject=e.subject.trim()),{isValid:!0,errors:[],sanitizedData:r}}(t);if(!s.isValid)return n.NextResponse.json({success:!1,message:"Validation failed",errors:s.errors},{status:400});let r=s.sanitizedData,a=e.headers.get("x-forwarded-for"),o=a?a.split(",")[0]:e.headers.get("x-real-ip")||"unknown",i=!1,c=!1;try{i=await (0,l.Xb)(r)}catch(e){i=!1}try{await (0,p.n7)(),await (0,p.Do)({...r,ip_address:o}),c=!0}catch(e){c=!1}if(i&&c)return n.NextResponse.json({success:!0,message:"Thank you for your message! We will get back to you soon.",emailSent:!0},{status:200});if(c)return n.NextResponse.json({success:!0,message:"Thank you for your message! We have received your inquiry and will get back to you soon.",emailSent:!1,note:"Your message has been saved and our team will review it shortly."},{status:200});return n.NextResponse.json({success:!1,message:"Failed to process your message. Please try again later."},{status:500})}catch(e){return n.NextResponse.json({success:!1,message:"An unexpected error occurred. Please try again later."},{status:500})}}async function u(e){return new n.NextResponse(null,{status:200,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}})}let d=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\api\\contact\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:h}=d,x="/api/contact/route";function y(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}},69612:(e,t,s)=>{s.d(t,{Do:()=>o,n7:()=>a,si:()=>l,us:()=>i,yo:()=>n});var r=s(8852);async function a(){let e;try{e=await (0,r.B5)(),await e.execute(`
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
    `)}catch(e){throw e}finally{e&&e.release()}}async function o(e){let t;try{return t=await (0,r.B5)(),(await t.execute(`INSERT INTO contact_submissions (name, email, phone, subject, message, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?)`,[e.name,e.email,e.phone||null,e.subject||null,e.message,e.ip_address||null])).insertId}catch(e){throw e}finally{t&&t.release()}}async function i(e=50,t=0){let s;try{s=await (0,r.B5)();let[a]=await s.execute(`SELECT id, name, email, phone, subject, message, status, created_at 
       FROM contact_submissions 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,[e,t]);return a}catch(e){throw e}finally{s&&s.release()}}async function n(e,t){let s;try{return s=await (0,r.B5)(),await s.execute("UPDATE contact_submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",[t,e]),!0}catch(e){throw e}finally{s&&s.release()}}async function l(){let e;try{e=await (0,r.B5)();let[t]=await e.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM contact_submissions 
      GROUP BY status
    `),s={new:0,read:0,replied:0,total:0};return t.forEach(e=>{s[e.status]=e.count,s.total+=e.count}),s}catch(e){throw e}finally{e&&e.release()}}},36119:(e,t,s)=>{s.d(t,{Xb:()=>i,jC:()=>n});var r=s(55245);let a=()=>r.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"465"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});async function o(e){try{let t=a(),s={from:`${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,to:e.to,subject:e.subject,text:e.text,html:e.html};return await t.sendMail(s),!0}catch(e){return!1}}async function i(e){try{let{name:t,email:s,phone:r,message:a,subject:i}=e,n=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Contact Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${t}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${s}</p>
            ${r?`<p style="margin: 5px 0;"><strong>Phone:</strong> ${r}</p>`:""}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Message:</h3>
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37;">
              ${a.replace(/\n/g,"<br>")}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This email was sent from the PC Real Estate contact form.</p>
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `,l=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Thank You for Contacting PC Real Estate</h2>
          
          <p style="color: #555; line-height: 1.6;">Dear ${t},</p>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.
          </p>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Your Message:</h4>
            <p style="color: #555; margin-bottom: 0;">${a.replace(/\n/g,"<br>")}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            In the meantime, feel free to explore our latest projects and services on our website.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #333; font-weight: bold; margin-bottom: 5px;">PC Real Estate</p>
            <p style="color: #666; margin: 2px 0;">Email: admin@pcrealestate.ae</p>
            <p style="color: #666; margin: 2px 0;">Website: www.pcrealestate.ae</p>
          </div>
        </div>
      </div>
    `,p=await o({to:"admin@pcrealestate.ae",subject:i||`New Contact Form Submission from ${t}`,html:n}),c=await o({to:s,subject:"Thank you for contacting PC Real Estate",html:l});return p&&c}catch(e){return!1}}async function n(e){return await o({to:e,subject:"Test Email from PC Real Estate",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Email Configuration Test</h2>
        <p>This is a test email to verify that the SMTP configuration is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> PC Real Estate Email System</p>
      </div>
    `})}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[8948,5972,3785,5245,5802],()=>s(74015));module.exports=r})();