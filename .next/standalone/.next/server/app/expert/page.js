(()=>{var e={};e.id=529,e.ids=[529],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},81505:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,originalPathname:()=>d,pages:()=>u,routeModule:()=>m,tree:()=>c}),i(40329),i(53538),i(96560);var r=i(23191),a=i(88716),s=i(37922),n=i.n(s),o=i(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let c=["",{children:["expert",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,40329)),"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\expert\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,53538)),"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.bind(i,96560)),"C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\not-found.tsx"]}],u=["C:\\Users\\Berlin\\Desktop\\sssq-main\\sssq-main\\app\\expert\\page.tsx"],d="/expert/page",p={require:i,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/expert/page",pathname:"/expert",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},31983:(e,t,i)=>{Promise.resolve().then(i.bind(i,75880))},75880:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});var r=i(10326),a=i(17577);function s(){let[e,t]=(0,a.useState)([]),[i,s]=(0,a.useState)(""),[n,o]=(0,a.useState)(!1),[l,c]=(0,a.useState)(!1),[u,d]=(0,a.useState)(""),[p,m]=(0,a.useState)("offline"),x=(0,a.useRef)(null),h=e=>{let t={hasInvestment:/investment|roi|yield|profit|return|capital/i.test(e),hasLocation:/business bay|dubai marina|downtown|jvc|palm jumeirah|arabian ranches/i.test(e),hasLuxury:/luxury|premium|exclusive|penthouse|villa|high-end/i.test(e),hasPrice:/price|cost|budget|affordable|expensive|cheap/i.test(e),hasProject:/project|development|building|tower|community/i.test(e)};return(t.hasInvestment?["Show me investment properties","Off-plan investment options","High-yield rental properties"]:t.hasLuxury?["Luxury apartments available","Premium penthouses","Exclusive developments"]:t.hasLocation?["Properties in this area","Similar locations","Nearby developments"]:t.hasProject?["More project details","Similar projects","Developer portfolio"]:["Available projects","Investment opportunities","Luxury properties"]).slice(0,3)},g=e=>{let t;let i=/\[IMAGE:(.*?)\]/g,r=[];for(;null!==(t=i.exec(e));){let e=t[1].trim();e&&(e.startsWith("http")||e.startsWith("/")||e.startsWith("data:image/"))&&r.push(e)}return{cleanText:e.replace(i,"").trim(),images:r}},y=async()=>{if(!i.trim())return;let r={id:Date.now().toString(),type:"user",content:i.trim(),timestamp:new Date};t(e=>[...e,r]),s(""),o(!0);try{let i=await fetch("/api/expert",{method:"POST",headers:{"Content-Type":"application/json","Cache-Control":"no-cache",Pragma:"no-cache"},body:JSON.stringify({message:r.content,context:e.slice(-3).map(e=>`${e.type}: ${e.content}`).join("\n")})}),a=await i.json();if(a.success&&a.response){let{cleanText:e,images:i}=g(a.response),r={id:(Date.now()+1).toString(),type:"ai",content:e,timestamp:new Date,suggestions:h(e),images:i.length>0?i:void 0};t(e=>[...e,r])}else throw Error(a.error||"Failed to get AI response")}catch(e){try{let e=await f(r.content),i={id:(Date.now()+1).toString(),type:"ai",content:e,timestamp:new Date,suggestions:h(e)};t(e=>[...e,i])}catch(a){let e=b(r.content),i={id:(Date.now()+1).toString(),type:"ai",content:e,timestamp:new Date,suggestions:h(e)};t(e=>[...e,i])}}finally{o(!1)}},f=async e=>{let t=e.toLowerCase(),i=t.includes("investment")||t.includes("roi")||t.includes("yield")?"investor":"buyer",r={investment:["roi","investment","yield","profit","return","capital"],luxury:["luxury","premium","high-end","exclusive","penthouse","villa"],location:["location","area","neighborhood","district","where"],price:["price","cost","budget","affordable"],projects:["project","development","building","tower","available"]},a=Object.keys(r).find(e=>r[e].some(e=>t.includes(e)))||"general";switch(a){case"investment":return`**Investment Opportunities in Dubai**

I can provide information about investment properties from our portfolio. Our current projects include various options in Business Bay, Dubai Marina, and JVC with different yield potentials.

What specific type of investment property interests you?`;case"luxury":return`**Luxury Properties Available**

Our portfolio includes premium developments in Downtown Dubai, Palm Jumeirah, and Dubai Marina. These properties feature high-end finishes and exclusive amenities.

Which luxury location would you like to explore?`;case"location":return`**Location-Based Properties**

I can provide details about our available projects in specific Dubai areas. Our portfolio covers prime locations across the emirate.

Which area are you interested in?`;case"projects":return`**Available Projects**

Our current portfolio includes various residential and commercial developments across Dubai. Each project offers different features and pricing options.

Would you like details about a specific project type?`;default:return`**Premium Choice Real Estate**

I specialize in Dubai properties and have access to our exclusive portfolio. I can provide specific information about our available projects, pricing, and features.

How can I assist you with your property needs?`}if("buyer"===i)switch(a){case"family":return`👨‍👩‍👧‍👦 **Complete Family Living Guide for Dubai**

**🏆 Top-Rated Family Communities (AI-Analyzed):**

**1. Arabian Ranches** - Premium Family Paradise
• **Schools**: JESS Arabian Ranches (Outstanding rating), Ranches Primary School
• **Amenities**: 18-hole golf course, community center, multiple parks
• **Safety**: 24/7 security, gated community with low crime rate
• **Properties**: 3-6BR villas, 2.5M-8M AED
• **Community**: 15,000+ families, international environment

**2. Dubai Hills Estate** - Modern Family Hub
• **Education**: Fairgreen International School, GEMS Wellington
• **Lifestyle**: Dubai Hills Mall, Central Park (largest in Dubai)
• **Healthcare**: Mediclinic Dubai Hills Hospital
• **Properties**: 1-4BR apartments, 3-7BR villas, 1.2M-12M AED
• **Transport**: Metro connection planned for 2025

**3. JVC (Jumeirah Village Circle)** - Affordable Family Choice
• **Value**: Best price-to-amenities ratio in Dubai
• **Schools**: Multiple nurseries and primary schools nearby
• **Recreation**: 33 parks, pet-friendly community
• **Properties**: 1-3BR apartments, 650K-2.2M AED
• **Convenience**: Close to major highways, shopping centers

**🎯 Family-Focused Features Analysis:**
✅ **School Proximity**: All communities within 5-10 minutes of top schools
✅ **Safety Ratings**: Gated communities with 24/7 security
✅ **Recreation**: Multiple parks, playgrounds, sports facilities
✅ **Healthcare**: Nearby hospitals and clinics
✅ **Community**: Active family-oriented neighborhoods

**📋 Family Checklist for Property Selection:**
• School catchment areas and ratings
• Playground and recreational facilities
• Community safety and security measures
• Proximity to healthcare facilities
• Family-friendly amenities (pools, parks, sports)

**📞 For a personalized consultation, please visit our contact form or admin panel:**


Which family priority is most important to you - schools, safety, or community amenities?`;case"luxury":return`💎 **Luxury Real Estate Portfolio - Dubai's Finest**

**🏙️ Ultra-Premium Developments:**

**1. Downtown Dubai** - Iconic City Living
• **Burj Khalifa Residences**: 2-4BR, 8M-50M AED
• **Opera District**: Cultural hub with luxury apartments
• **Dubai Mall proximity**: World's largest shopping destination
• **Amenities**: Concierge, valet, private elevators, sky lounges

**2. Palm Jumeirah** - Exclusive Island Paradise
• **Signature Villas**: Beachfront, 15M-100M AED
• **Luxury Apartments**: Marina views, 3M-25M AED
• **Private Beaches**: Exclusive access to pristine coastline
• **Resort Living**: 5-star hotel services, world-class dining

**3. Dubai Marina** - Waterfront Sophistication
• **Marina Gate**: Premium towers with yacht access
• **Princess Tower**: World's tallest residential building
• **Amenities**: Private marinas, infinity pools, spa facilities
• **Lifestyle**: Vibrant nightlife, fine dining, luxury shopping

**✨ Luxury Features & Services:**
🏊 **Amenities**: Infinity pools, private beaches, spa facilities
🚗 **Services**: Valet parking, concierge, housekeeping
🏢 **Architecture**: Award-winning designs, premium finishes
🌊 **Views**: Burj Khalifa, marina, ocean, or golf course
🔒 **Privacy**: Private elevators, exclusive access, 24/7 security

**🎯 Luxury Investment Highlights:**
• Properties appreciate 12-18% annually
• Rental yields of 5-7% in prime locations
• Strong demand from high-net-worth individuals
• Exclusive lifestyle and prestige value

**💡 Luxury Buying Guide:**
• Minimum budget: 3M AED for luxury apartments
• Premium villas: 15M+ AED
• Payment plans available with 10-20% down payment
• Professional property management services included

What type of luxury lifestyle appeals to you - urban sophistication or beachfront tranquility?`;default:return`🏠 **Personalized Property Consultation**

Welcome! I've analyzed your requirements and current market conditions to provide tailored recommendations:

**🎯 Smart Property Matching System:**

**Budget-Friendly Excellence (800K-2M AED):**
• **JVC**: Modern apartments, family-friendly, 10% ROI potential
• **International City**: Affordable entry point, diverse community
• **Dubai South**: Emerging area, future growth potential

**Mid-Range Premium (2M-5M AED):**
• **Business Bay**: Modern towers, business district convenience
• **Dubai Hills**: Master-planned community, excellent amenities
• **JLT**: Established area, metro connectivity

**Luxury Segment (5M+ AED):**
• **Downtown Dubai**: Iconic location, world-class amenities
• **Dubai Marina**: Waterfront living, vibrant lifestyle
• **Palm Jumeirah**: Exclusive island, private beaches

**🔍 AI-Powered Recommendations:**
Based on current market analysis, I suggest focusing on:
1. **Growth Areas**: Dubai South, MBR City for future appreciation
2. **Stable Returns**: Business Bay, JVC for consistent rental income
3. **Lifestyle**: Dubai Marina, Downtown for premium living

**📋 Next Steps:**
• Define your budget range
• Specify preferred location/lifestyle
• Choose between ready or off-plan properties
• Schedule property viewings

What's your primary motivation - investment returns, family living, or luxury lifestyle?`}return`🤖 **AI Real Estate Assistant**

I'm analyzing your query using advanced market intelligence...

**Current Market Insights:**
• 847 active properties in our database
• Average price appreciation: 16.9% (2024)
• Rental yield range: 6-12% across Dubai
• Foreign investment: +35% year-over-year

**Intelligent Recommendations:**
Based on your ${i} profile, I suggest exploring:
${"investor"===i?"• High-yield opportunities in emerging areas\n• Balanced portfolio of ready and off-plan properties\n• Commercial real estate for stable returns":"• Family-friendly communities with top schools\n• Modern amenities and lifestyle features\n• Safe, established neighborhoods"}

**📞 For a personalized consultation, feel free to reach out through our admin panel.**

How can I provide more specific assistance for your real estate needs?`},b=e=>`**Premium Choice Real Estate**

I apologize, but I'm currently unable to access our property database. However, I can still assist you with general information about our services.

Our portfolio includes properties across Dubai's prime locations including Business Bay, Dubai Marina, Downtown Dubai, and JVC.

How can I help you with your property requirements?`,v=e=>{s(e)};return(0,r.jsxs)("div",{className:"min-h-screen bg-luxury-black text-white relative",children:[r.jsx("div",{className:"glass-dark border-b border-green-ocean/30 backdrop-blur-xl sticky top-0 z-40",children:r.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:r.jsx("div",{className:"flex items-center justify-between h-16",children:(0,r.jsxs)("div",{className:"flex items-center space-x-4",children:[r.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-green-ocean to-green-ocean-light rounded-xl flex items-center justify-center shadow-lg",children:r.jsx("i",{className:"ri-robot-2-line text-white text-xl"})}),r.jsx("div",{children:r.jsx("h1",{className:"text-lg font-bold bg-gradient-to-r from-white to-green-ocean-light bg-clip-text text-transparent",children:"AI Real Estate Expert"})})]})})})}),r.jsx("div",{className:"bg-gradient-to-r from-luxury-black via-luxury-black-light to-luxury-black border-b border-green-ocean/20",children:r.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsxs)("div",{className:"flex items-center justify-center space-x-2 mb-2",children:[r.jsx("i",{className:"ri-sparkle-line text-green-ocean text-lg"}),r.jsx("span",{className:"text-sm text-green-ocean font-medium",children:"AI-Powered Property Intelligence"}),r.jsx("i",{className:"ri-sparkle-line text-green-ocean text-lg"})]}),r.jsx("p",{className:"text-gray-300 text-sm max-w-2xl mx-auto",children:"Get instant insights on Dubai's real estate market with our advanced AI consultant. Ask about properties, investment opportunities, market trends, and more."})]})})}),r.jsx("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:(0,r.jsxs)("div",{className:"bg-luxury-black-light rounded-xl border border-green-ocean/20 h-[calc(100vh-200px)] flex flex-col",children:[(0,r.jsxs)("div",{className:"flex-1 overflow-y-auto p-6 space-y-6 relative",children:[e.map(e=>r.jsx("div",{className:`flex ${"user"===e.type?"justify-end":"justify-start"}`,children:(0,r.jsxs)("div",{className:`max-w-[85%] ${"user"===e.type?"order-2":"order-1"}`,children:[(0,r.jsxs)("div",{className:`flex items-start space-x-3 ${"user"===e.type?"flex-row-reverse space-x-reverse":""}`,children:[r.jsx("div",{className:`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${"user"===e.type?"bg-green-ocean":"bg-luxury-black border-2 border-green-ocean"}`,children:"user"===e.type?r.jsx("i",{className:"ri-user-line text-white text-lg"}):r.jsx("i",{className:"ri-robot-line text-green-ocean text-lg"})}),(0,r.jsxs)("div",{className:`px-4 py-3 rounded-xl ${"user"===e.type?"bg-green-ocean text-white":"bg-luxury-black border border-green-ocean/30 text-white"}`,children:[r.jsx("div",{className:"whitespace-pre-wrap text-sm leading-relaxed",children:e.content}),e.images&&e.images.length>0&&r.jsx("div",{className:"mt-3 space-y-2",children:e.images.map((e,t)=>r.jsx("div",{className:"rounded-lg overflow-hidden border border-green-ocean/20",children:r.jsx("img",{src:e,alt:`Project image ${t+1}`,className:"w-full h-48 object-cover",onError:e=>{e.currentTarget.style.display="none"}})},t))}),r.jsx("div",{className:`text-xs mt-2 ${"user"===e.type?"text-white/70":"text-gray-400"}`,children:e.timestamp.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})]}),e.suggestions&&"ai"===e.type&&r.jsx("div",{className:"mt-4 flex flex-wrap gap-2",children:e.suggestions.map((e,t)=>r.jsx("button",{onClick:()=>v(e),className:"px-3 py-2 bg-luxury-black border border-green-ocean/40 text-green-ocean text-xs rounded-lg hover:bg-green-ocean/10 hover:border-green-ocean transition-all duration-200",children:e},t))})]})},e.id)),n&&r.jsx("div",{className:"flex justify-start",children:(0,r.jsxs)("div",{className:"flex items-start space-x-3",children:[r.jsx("div",{className:"w-10 h-10 rounded-full bg-luxury-black border-2 border-green-ocean flex items-center justify-center",children:r.jsx("i",{className:"ri-robot-line text-green-ocean text-lg"})}),r.jsx("div",{className:"bg-luxury-black border border-green-ocean/30 px-4 py-3 rounded-xl",children:r.jsx("div",{className:"flex space-x-1",children:[0,1,2].map(e=>r.jsx("div",{className:"w-2 h-2 bg-green-ocean rounded-full animate-pulse",style:{animationDelay:`${.3*e}s`}},e))})})]})}),r.jsx("div",{ref:x}),e.length>3&&r.jsx("button",{onClick:()=>{x.current?.scrollIntoView({behavior:"smooth",block:"end",inline:"nearest"})},className:"fixed bottom-32 right-8 bg-green-ocean hover:bg-green-ocean-light text-white p-3 rounded-full shadow-lg transition-all duration-200 z-10",title:"Scroll to bottom",children:r.jsx("i",{className:"ri-arrow-down-line text-lg"})})]}),r.jsx("div",{className:"border-t border-green-ocean/20 p-4",children:(0,r.jsxs)("div",{className:"flex space-x-3",children:[r.jsx("input",{type:"text",value:i,onChange:e=>s(e.target.value),onKeyPress:e=>"Enter"===e.key&&!e.shiftKey&&y(),placeholder:"Ask me about Dubai real estate properties...",className:"flex-1 bg-luxury-black border border-green-ocean/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-ocean focus:ring-1 focus:ring-green-ocean",disabled:n}),(0,r.jsxs)("button",{onClick:y,disabled:!i.trim()||n,className:"bg-green-ocean text-white px-6 py-3 rounded-lg font-medium hover:bg-green-ocean-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2",children:[r.jsx("span",{children:"Send"}),r.jsx("i",{className:"ri-send-plane-line"})]})]})})]})})]})}},40329:(e,t,i)=>{"use strict";i.r(t),i.d(t,{$$typeof:()=>n,__esModule:()=>s,default:()=>o});var r=i(68570);let a=(0,r.createProxy)(String.raw`C:\Users\Berlin\Desktop\sssq-main\sssq-main\app\expert\page.tsx`),{__esModule:s,$$typeof:n}=a;a.default;let o=(0,r.createProxy)(String.raw`C:\Users\Berlin\Desktop\sssq-main\sssq-main\app\expert\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[8948,462,692],()=>i(81505));module.exports=r})();