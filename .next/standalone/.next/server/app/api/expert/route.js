"use strict";(()=>{var e={};e.id=1567,e.ids=[1567],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},41808:e=>{e.exports=require("net")},77282:e=>{e.exports=require("process")},12781:e=>{e.exports=require("stream")},71576:e=>{e.exports=require("string_decoder")},39512:e=>{e.exports=require("timers")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},55711:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>w,patchFetch:()=>x,requestAsyncStorage:()=>g,routeModule:()=>y,serverHooks:()=>v,staticGenerationAsyncStorage:()=>b});var a={};r.r(a),r.d(a,{GET:()=>f,POST:()=>h});var i=r(49303),o=r(88716),s=r(60670),n=r(87070),l=r(8852);async function p(e,t){try{let t=[],r=[];try{t=await (0,l.IO)("SELECT * FROM projects ORDER BY created_at DESC LIMIT 20"),r=await (0,l.IO)('SELECT * FROM developers WHERE status = "Active"')}catch(e){t=[],r=[]}let a={projects:t.map(e=>({name:e.name,developer:e.developer,location:e.location,price:e.price||e.starting_price,type:e.type,bedrooms:e.bedrooms,bathrooms:e.bathrooms,area:e.area,status:e.status,project_type:e.project_type,features:e.features?JSON.parse(e.features):[],amenities:e.amenities?JSON.parse(e.amenities):[],description:e.description,image:e.image})),developers:r.map(e=>({name:e.name,description:e.description,established:e.established,projects_count:e.projects_count,location:e.location,website:e.website})),totalProjects:t.length,availableProjects:t.filter(e=>"Available"===e.status).length,underConstructionProjects:t.filter(e=>"Under Construction"===e.status).length,contactInfo:{phone:null,email:null,address:"Dubai, UAE"}};await u();let i=`You are a professional real estate consultant specializing in Dubai properties. You work for Premium Choice Real Estate and have access to the company's exclusive property portfolio.

CRITICAL INSTRUCTIONS:
- ONLY discuss properties from the database provided below
- Be professional, concise, and direct
- Always reference specific project names, developers, and exact details from the database
- If asked about properties not in your database, politely redirect to your available portfolio
- Provide brief, focused responses without excessive details
- Include contact information only when specifically requested

COMPANY PORTFOLIO:
Total Projects: ${a.totalProjects}
Available Properties: ${a.availableProjects}
Under Construction: ${a.underConstructionProjects}

DEVELOPER PARTNERS:
${a.developers.map(e=>`• ${e.name} - ${e.description}`).join("\n")}

AVAILABLE PROJECTS:
${a.projects.slice(0,10).map(e=>`• ${e.name} by ${e.developer}
    📍 ${e.location}
    🏠 ${e.type} | ${e.bedrooms}BR | ${e.bathrooms}BA | ${e.area} sq ft
    💰 ${e.price||"Price on request"}
    📋 Status: ${e.status}
    🖼️ Image: ${e.image||"No image available"}
    ${e.description?`📝 ${e.description.substring(0,100)}...`:""}`).join("\n\n")}

CONTACT: Phone: ${a.contactInfo.phone} | Email: ${a.contactInfo.email}

USER QUESTION: "${e}"

RESPONSE GUIDELINES:
1. Keep responses concise and professional
2. Reference specific projects from the database only
3. Provide exact project names, developers, and key details
4. Suggest 1-2 relevant properties maximum
5. If no relevant projects in database, redirect to available options
6. No generic market advice - focus on actual portfolio
7. **IMPORTANT: Do NOT include any image URLs or [IMAGE:] tags in your responses**

**EXAMPLE RESPONSE FORMAT:**
"I recommend **Dubai Hills Estate** by Emaar Properties in Dubai Hills. This luxury 3BR villa offers 2,200 sq ft with golf course views for AED 2,500,000.

The property features premium finishes and smart home technology..."

Remember: Only discuss the specific properties listed in the database above. Focus on text-based descriptions without any image references.`,o=await u();return await d(o,i)}catch(t){return c(e)}}function c(e){let t=e.toLowerCase();return t.includes("project")||t.includes("property")?`Here is the available project in our portfolio:

**LUME Residences by S&S Developer**
📍 **Location:** Jumeirah Village Circle, Dubai
🏠 **Type:** 1BR | 1BA Apartment
💰 **Price:** On Request
📋 **Status:** Available

This modern development offers contemporary living in one of Dubai's most sought-after communities. What specific details would you like to know about this project?`:t.includes("developer")||t.includes("builder")?"We work with Dubai's most reputable developers including Emaar, DAMAC, Sobha Realty, and other established names. Each developer brings unique expertise and quality standards. Would you like to know about specific developers or their current projects?":t.includes("investment")||t.includes("roi")?`As a real estate investment expert, I can guide you through Dubai's lucrative property market. Our portfolio includes both ready properties for immediate rental income and off-plan projects for capital appreciation.

Key investment highlights:
• Ready Properties: Immediate rental yields of 6-8% annually
• Off-Plan Projects: Potential 15-25% capital appreciation
• Prime Locations: Business Bay, Downtown, Dubai Marina, JVC
• Developer Partnerships: Established relationships with top-tier developers

I recommend focusing on high-yield areas and emerging neighborhoods for optimal returns.

Would you like me to analyze specific investment opportunities?`:t.includes("location")||t.includes("area")?`Dubai offers diverse neighborhoods, each with unique advantages:

**Premium Areas**: Downtown Dubai, Dubai Marina, Palm Jumeirah
**Emerging Hotspots**: Dubai South, Dubailand, JVC, Arjan
**Family-Friendly**: Arabian Ranches, The Springs, Dubai Hills
**Business Districts**: Business Bay, DIFC, JLT

Our portfolio spans these prime locations with projects ranging from luxury villas to modern apartments. Which location interests you most?`:`As your real estate expert, I'm here to help you navigate Dubai's dynamic property market. I have access to our complete portfolio of premium projects from top developers.

I can assist you with:
🏢 **Property Selection** - Find the perfect match for your needs
💰 **Investment Analysis** - ROI calculations and market insights  
🏗️ **Developer Insights** - Track records and project quality
📍 **Location Guidance** - Area analysis and future growth potential
📋 **Market Trends** - Current pricing and demand patterns

What specific aspect of real estate would you like to explore?`}async function u(){try{let e=await (0,l.IO)(`
      SELECT * FROM ai_api_settings ORDER BY created_at DESC LIMIT 1
    `);if(0===e.length)throw Error("No AI API settings found");let t=e[0];return{provider:"deepseek",apiKey:t.deepseek_api_key||process.env.DEEPSEEK_API_KEY||"",model:t.deepseek_model||"deepseek-chat",temperature:parseFloat(t.deepseek_temperature||"0.7"),maxTokens:parseInt(t.deepseek_max_tokens||"1500")}}catch(e){return{provider:"deepseek",apiKey:process.env.DEEPSEEK_API_KEY||"",model:"deepseek-chat",temperature:.7,maxTokens:1500}}}async function d(e,t){try{return await m(e,t)}catch(e){return function(e){let t=e.toLowerCase();if(t.includes("investment")||t.includes("roi")||t.includes("business bay"))return`Dubai's real estate investment landscape offers exceptional opportunities:

**💰 High-Yield Areas:**
• Business Bay - 7-9% rental yields, prime location
• Dubai Marina - 6-8% yields, luxury waterfront living
• JVC - 8-10% yields, affordable entry point
• Dubai South - 9-12% yields, emerging area near Al Maktoum Airport

**📈 Investment Highlights:**
• No property tax or capital gains tax
• Strong rental demand from expat population
• Government initiatives supporting real estate growth
• Expo 2020 legacy infrastructure improvements

**🏗️ Ready vs Off-Plan:**
• Ready properties: Immediate rental income
• Off-plan: 15-25% potential capital appreciation

Which investment strategy interests you most - immediate rental income or long-term capital growth?`;if(t.includes("family")||t.includes("neighborhood")||t.includes("school")||t.includes("area")&&!t.includes("investment"))return`For families looking for the best neighborhoods in Dubai, I highly recommend these areas:

**🏡 Arabian Ranches** - Premium gated community with excellent schools like JESS Arabian Ranches and Ranches Primary School. Family-friendly with parks, golf course, and community center.

**🌟 Dubai Hills Estate** - Modern master-planned community featuring Dubai Hills Mall, parks, and top-rated schools. Great for families with children.

**🏘️ Jumeirah Village Circle (JVC)** - Affordable family option with good schools, parks, and easy access to major highways. Popular with young families.

**🎓 The Springs/The Meadows** - Established communities with mature landscaping, community pools, and proximity to quality schools.

These areas offer excellent amenities, safety, and educational facilities. Would you like specific property recommendations in any of these neighborhoods?`;if(t.includes("price")||t.includes("budget")||t.includes("cost")||t.includes("luxury"))return`Dubai's property market offers options across all budget ranges:

**💎 Luxury Segment (8M+ AED):**
• Downtown Dubai penthouses and high-floor apartments
• Palm Jumeirah villas and luxury apartments
• Dubai Marina premium towers with marina views

**🏠 Mid-Range (2-8M AED):**
• Business Bay modern apartments
• JVC family-friendly communities
• Dubai Hills Estate contemporary homes

**🌟 Affordable (800K-2M AED):**
• International City budget-friendly options
• Dubai South emerging developments
• Dubailand family communities

**💡 Payment Plans Available:**
• 10% down payment options
• 5-year post-handover payment plans
• Developer financing available

What's your budget range? I can show you the best options in that category.`;{if(t.includes("commercial")||t.includes("office")||t.includes("business"))return`Dubai's commercial real estate market is thriving with excellent opportunities:

**🏢 Prime Business Districts:**
• DIFC - Financial hub with premium office spaces (7-12% yields)
• Business Bay - Modern towers with flexible office solutions
• Dubai Internet City - Tech companies and startups
• JLT - Established business community with good connectivity

**📊 Commercial Investment Benefits:**
• Strong tenant demand from multinational companies
• Government support for business setup
• Tax-free environment attracting global businesses
• Strategic location connecting East and West

**🎯 Property Types:**
• Grade A office buildings
• Retail spaces in high-traffic areas
• Mixed-use developments
• Co-working and flexible office solutions

Are you looking for office space for your business or commercial investment opportunities?`;let e=[`As your Dubai real estate expert, I'm here to help you navigate this dynamic market! Dubai offers incredible opportunities whether you're buying your dream home or making a smart investment.

🏙️ **Popular Areas:** Downtown Dubai, Marina, Business Bay, JVC
🏡 **Property Types:** Luxury apartments, family villas, commercial spaces
💰 **Investment Benefits:** High rental yields, no property tax, strong capital growth

What specific aspect of Dubai real estate interests you most?`,`Welcome to Dubai's exciting property market! I specialize in helping clients find the perfect match for their needs and budget.

🌟 **Why Dubai Real Estate?**
• World-class infrastructure and amenities
• Strong rental market with high occupancy rates
• Government initiatives supporting property growth
• Strategic location for global business

Whether you're looking for a family home, luxury apartment, or investment property, I can guide you to the best options. What are you looking for?`,`Dubai's real estate market is full of opportunities! From luxury waterfront properties to family-friendly communities and high-yield investment options.

🎯 **I can help you with:**
• Property selection based on your lifestyle needs
• Investment analysis and ROI calculations
• Market insights and pricing trends
• Developer recommendations and project quality

Tell me more about what you're looking for, and I'll provide personalized recommendations!`];return e[Math.floor(Math.random()*e.length)]}}(t)}}async function m(e,t){let r=await fetch("https://api.deepseek.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${e.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:e.model,messages:[{role:"user",content:t}],temperature:e.temperature,max_tokens:e.maxTokens})});if(!r.ok){let e=await r.text();throw Error(`DeepSeek API error: ${r.statusText} - ${e}`)}let a=await r.json();return a.choices[0]?.message?.content||"I apologize, but I couldn't generate a response at the moment."}async function h(e){try{let{message:t,context:r}=await e.json();if(!t||0===t.trim().length)return n.NextResponse.json({error:"Message is required"},{status:400});let a=await u(),i=await p(t,r),o=n.NextResponse.json({success:!0,response:i,provider:a.provider,model:a.model,timestamp:new Date().toISOString()});return o.headers.set("Cache-Control","no-store, no-cache, must-revalidate, proxy-revalidate"),o.headers.set("Pragma","no-cache"),o.headers.set("Expires","0"),o.headers.set("Surrogate-Control","no-store"),o}catch(t){let e=t instanceof Error?t.message:"Unknown error";return n.NextResponse.json({error:"Failed to process request",details:e,response:c(e)},{status:500})}}async function f(){try{let e=await u(),t=!0,r=0,a=0;try{let e=await (0,l.IO)("SELECT COUNT(*) as count FROM projects"),t=await (0,l.IO)("SELECT COUNT(*) as count FROM developers");r=e[0]?.count||0,a=t[0]?.count||0}catch(e){t=!1}return n.NextResponse.json({status:t?"Expert AI service is running with DeepSeek":"Expert AI service running (database offline)",provider:e.provider,model:e.model,available_providers:["deepseek"],database_connected:t,projects_count:r,developers_count:a,api_key_configured:!!e.apiKey,timestamp:new Date().toISOString()})}catch(e){return n.NextResponse.json({status:"Expert AI service running (limited functionality)",provider:"deepseek",database_connected:!1,api_key_configured:!1,error:e instanceof Error?e.message:"Unknown error",timestamp:new Date().toISOString()},{status:200})}}let y=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/expert/route",pathname:"/api/expert",filename:"route",bundlePath:"app/api/expert/route"},resolvedPagePath:"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\api\\expert\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:g,staticGenerationAsyncStorage:b,serverHooks:v}=y,w="/api/expert/route";function x(){return(0,s.patchFetch)({serverHooks:v,staticGenerationAsyncStorage:b})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[8948,5972,3785,5802],()=>r(55711));module.exports=a})();