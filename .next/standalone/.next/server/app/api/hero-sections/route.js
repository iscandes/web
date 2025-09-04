(()=>{var e={};e.id=8482,e.ids=[8482],e.modules={62849:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=62849,e.exports=t},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},41808:e=>{"use strict";e.exports=require("net")},77282:e=>{"use strict";e.exports=require("process")},12781:e=>{"use strict";e.exports=require("stream")},71576:e=>{"use strict";e.exports=require("string_decoder")},39512:e=>{"use strict";e.exports=require("timers")},24404:e=>{"use strict";e.exports=require("tls")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},59918:(e,t,s)=>{"use strict";s.r(t),s.d(t,{originalPathname:()=>R,patchFetch:()=>m,requestAsyncStorage:()=>h,routeModule:()=>_,serverHooks:()=>E,staticGenerationAsyncStorage:()=>g});var r={};s.r(r),s.d(r,{DELETE:()=>x,GET:()=>d,POST:()=>p,PUT:()=>l});var i=s(49303),a=s(88716),o=s(60670),n=s(87070),c=s(73785);let u={host:"srv1558.hstgr.io",user:"u485564989_pcrs",password:"Abedyr57..",database:"u485564989_pcrs",port:3306,ssl:{rejectUnauthorized:!1},connectionLimit:10,queueLimit:0,enableKeepAlive:!0,keepAliveInitialDelay:0};async function d(){let e;try{e=await c.createConnection(u);let[t]=await e.execute(`
      SELECT 
        id,
        page,
        title,
        subtitle,
        description,
        background_image as backgroundImage,
        cta_text as ctaText,
        cta_link as ctaLink,
        is_active as isActive,
        updated_at as updatedAt
      FROM hero_sections 
      WHERE page = 'home' AND is_active = 1
      ORDER BY id ASC
    `);return n.NextResponse.json(t)}catch(e){return n.NextResponse.json({error:"Failed to fetch hero sections"},{status:500})}finally{e&&await e.end()}}async function p(e){let t;try{let{page:s="home",title:r,subtitle:i,description:a,backgroundImage:o,ctaText:d,ctaLink:p,isActive:l=!0}=await e.json();if(!r||!i||!a)return n.NextResponse.json({error:"Title, subtitle, and description are required"},{status:400});t=await c.createConnection(u);let[x]=await t.execute(`
      INSERT INTO hero_sections (
        page, title, subtitle, description, background_image, 
        cta_text, cta_link, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,[s,r,i,a,o,d,p,l]),_=x.insertId,[h]=await t.execute(` SELECT 
        id,
        page,
        title,
        subtitle,
        description,
        background_image as backgroundImage,
        cta_text as ctaText,
        cta_link as ctaLink,
        is_active as isActive,
        updated_at as updatedAt
      FROM hero_sections 
      WHERE id = ?
    `,[_]);return n.NextResponse.json(h[0],{status:201})}catch(e){return n.NextResponse.json({error:"Failed to create hero section"},{status:500})}finally{t&&await t.end()}}async function l(e){let t;try{let{id:s,page:r,title:i,subtitle:a,description:o,backgroundImage:d,ctaText:p,ctaLink:l,isActive:x}=await e.json();if(!s)return n.NextResponse.json({error:"Hero section ID is required"},{status:400});t=await c.createConnection(u),await t.execute(`
      UPDATE hero_sections SET
        page = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        background_image = ?,
        cta_text = ?,
        cta_link = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,[r,i,a,o,d,p,l,x,s]);let[_]=await t.execute(` SELECT 
        id,
        page,
        title,
        subtitle,
        description,
        background_image as backgroundImage,
        cta_text as ctaText,
        cta_link as ctaLink,
        is_active as isActive,
        updated_at as updatedAt
      FROM hero_sections 
      WHERE id = ?
    `,[s]);return n.NextResponse.json(_[0])}catch(e){return n.NextResponse.json({error:"Failed to update hero section"},{status:500})}finally{t&&await t.end()}}async function x(e){let t;try{let{searchParams:s}=new URL(e.url),r=s.get("id");if(!r)return n.NextResponse.json({error:"Hero section ID is required"},{status:400});return t=await c.createConnection(u),await t.execute("DELETE FROM hero_sections WHERE id = ?",[r]),n.NextResponse.json({message:"Hero section deleted successfully"})}catch(e){return n.NextResponse.json({error:"Failed to delete hero section"},{status:500})}finally{t&&await t.end()}}let _=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/hero-sections/route",pathname:"/api/hero-sections",filename:"route",bundlePath:"app/api/hero-sections/route"},resolvedPagePath:"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\api\\hero-sections\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:h,staticGenerationAsyncStorage:g,serverHooks:E}=_,R="/api/hero-sections/route";function m(){return(0,o.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:g})}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[8948,5972,3785],()=>s(59918));module.exports=r})();