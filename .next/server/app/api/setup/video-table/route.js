"use strict";(()=>{var e={};e.id=5713,e.ids=[5713],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},41808:e=>{e.exports=require("net")},77282:e=>{e.exports=require("process")},12781:e=>{e.exports=require("stream")},71576:e=>{e.exports=require("string_decoder")},39512:e=>{e.exports=require("timers")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},71137:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>E,patchFetch:()=>x,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>T,staticGenerationAsyncStorage:()=>l});var s={};r.r(s),r.d(s,{POST:()=>n});var i=r(49303),o=r(88716),u=r(60670),a=r(87070),p=r(8852);async function n(){try{let e=await (0,p.N8)();await e.execute(`
      CREATE TABLE IF NOT EXISTS video_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_type ENUM('youtube', 'upload') NOT NULL DEFAULT 'youtube',
        video_url VARCHAR(500) NULL,
        youtube_url VARCHAR(500) NULL,
        title VARCHAR(255) NOT NULL DEFAULT 'Welcome to Premium Choice',
        description TEXT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);let[t]=await e.execute("SELECT COUNT(*) as count FROM video_settings"),r=t[0].count;return 0===r&&await e.execute(`
        INSERT INTO video_settings (video_type, youtube_url, title, description, is_active)
        VALUES ('youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Welcome to Premium Choice Real Estate', 'Discover luxury properties in Dubai with Premium Choice Real Estate', TRUE)
      `),a.NextResponse.json({success:!0,message:"Video settings table created successfully",recordsCount:r})}catch(e){return a.NextResponse.json({error:"Failed to create video_settings table"},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/setup/video-table/route",pathname:"/api/setup/video-table",filename:"route",bundlePath:"app/api/setup/video-table/route"},resolvedPagePath:"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\api\\setup\\video-table\\route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:T}=d,E="/api/setup/video-table/route";function x(){return(0,u.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:l})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[8948,5972,3785,5802],()=>r(71137));module.exports=s})();