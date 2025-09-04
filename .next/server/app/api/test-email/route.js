"use strict";(()=>{var e={};e.id=5528,e.ids=[5528],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},32081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},54301:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>b,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>g,staticGenerationAsyncStorage:()=>m});var o={};r.r(o),r.d(o,{GET:()=>p,POST:()=>d});var s=r(49303),a=r(88716),i=r(60670),n=r(87070),l=r(36119);async function d(e){try{let{email:t}=await e.json();if(!t||"string"!=typeof t||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))return n.NextResponse.json({success:!1,message:"Valid email address is required"},{status:400});if(!await (0,l.jC)(t.trim().toLowerCase()))return n.NextResponse.json({success:!1,message:"Failed to send test email. Please check SMTP configuration."},{status:500});return n.NextResponse.json({success:!0,message:`Test email sent successfully to ${t}`})}catch(e){return n.NextResponse.json({success:!1,message:"An unexpected error occurred while sending test email.",error:void 0},{status:500})}}async function p(e){let t=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Test - PC Real Estate</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                border-bottom: 2px solid #d4af37;
                padding-bottom: 10px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #555;
            }
            input[type="email"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }
            button {
                background-color: #d4af37;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #b8941f;
            }
            button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                display: none;
            }
            .success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📧 Email Configuration Test</h1>
            <p>Test the SMTP email configuration by sending a test email.</p>
            
            <form id="testForm">
                <div class="form-group">
                    <label for="email">Email Address:</label>
                    <input type="email" id="email" name="email" value="abedyr7@gmail.com" required>
                </div>
                
                <button type="submit" id="submitBtn">Send Test Email</button>
            </form>
            
            <div id="result" class="result"></div>
        </div>
        
        <script>
            document.getElementById('testForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = document.getElementById('submitBtn');
                const result = document.getElementById('result');
                const email = document.getElementById('email').value;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                result.style.display = 'none';
                
                try {
                    const response = await fetch('/api/test-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email })
                    });
                    
                    const data = await response.json();
                    
                    result.className = 'result ' + (data.success ? 'success' : 'error');
                    result.textContent = data.message;
                    result.style.display = 'block';
                    
                } catch (error) {
                    result.className = 'result error';
                    result.textContent = 'Network error: ' + error.message;
                    result.style.display = 'block';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Test Email';
                }
            });
        </script>
    </body>
    </html>
  `;return new n.NextResponse(t,{headers:{"Content-Type":"text/html"}})}let c=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/test-email/route",pathname:"/api/test-email",filename:"route",bundlePath:"app/api/test-email/route"},resolvedPagePath:"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\api\\test-email\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:u,staticGenerationAsyncStorage:m,serverHooks:g}=c,x="/api/test-email/route";function b(){return(0,i.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:m})}},36119:(e,t,r)=>{r.d(t,{Xb:()=>i,jC:()=>n});var o=r(55245);let s=()=>o.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"465"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});async function a(e){try{let t=s(),r={from:`${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,to:e.to,subject:e.subject,text:e.text,html:e.html};return await t.sendMail(r),!0}catch(e){return!1}}async function i(e){try{let{name:t,email:r,phone:o,message:s,subject:i}=e,n=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Contact Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${t}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${r}</p>
            ${o?`<p style="margin: 5px 0;"><strong>Phone:</strong> ${o}</p>`:""}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Message:</h3>
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37;">
              ${s.replace(/\n/g,"<br>")}
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
            <p style="color: #555; margin-bottom: 0;">${s.replace(/\n/g,"<br>")}</p>
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
    `,d=await a({to:"admin@pcrealestate.ae",subject:i||`New Contact Form Submission from ${t}`,html:n}),p=await a({to:r,subject:"Thank you for contacting PC Real Estate",html:l});return d&&p}catch(e){return!1}}async function n(e){return await a({to:e,subject:"Test Email from PC Real Estate",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Email Configuration Test</h2>
        <p>This is a test email to verify that the SMTP configuration is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> PC Real Estate Email System</p>
      </div>
    `})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[8948,5972,5245],()=>r(54301));module.exports=o})();