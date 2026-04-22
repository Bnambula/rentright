export const LISTINGS=[
  {id:1,name:"Tranquil Garden Studio",area:"Bukoto",price:420000,type:"Self-Contained",v:1,boost:1,pop:0,rating:4.9,conf:98,ready:1,beds:1,baths:1,sqm:32,img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80",desc:"Calm self-contained studio in gated Bukoto compound. UMEME prepaid meter, NWSC water, supermarket 5 min.",ll:"Sarah B.",phone:"0712345678",wa:"256712345678",fee:5000,agent:0,hostel:0},
  {id:2,name:"Bright Kisaasi Double Room",area:"Kisaasi",price:350000,type:"Double Room",v:1,boost:0,pop:1,rating:4.7,conf:91,ready:1,beds:1,baths:1,sqm:24,img:"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=700&q=80",desc:"Bright double room steps from main road. Taxi 1 min walk. Prepaid electricity, reliable water.",ll:"Grace N.",phone:"0701234567",wa:"256701234567",fee:5000,agent:1,agname:"James K.",hostel:0},
  {id:3,name:"Makerere Student Hostel",area:"Wandegeya",price:175000,type:"Hostel",v:1,boost:1,pop:0,rating:4.3,conf:84,ready:1,beds:1,baths:1,sqm:14,img:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80",desc:"Affordable hostel 2 mins from Makerere University. WiFi, kitchen, 24hr security.",ll:"Hostel Admin",phone:"0771234567",wa:"256771234567",fee:5000,agent:0,hostel:1,left:4},
  {id:4,name:"Spacious Ntinda Single",area:"Ntinda",price:280000,type:"Single Room",v:0,boost:0,pop:0,rating:4.1,conf:52,ready:0,beds:1,baths:1,sqm:20,img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80",desc:"Spacious single room in quiet family compound. Awaiting verification.",ll:"Peter M.",phone:"0789012345",wa:"256789012345",fee:5000,agent:0,hostel:0},
  {id:5,name:"Modern Makerere Bedsitter",area:"Makerere",price:240000,type:"Single Room",v:1,boost:0,pop:1,rating:4.5,conf:93,ready:1,beds:1,baths:1,sqm:18,img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",desc:"Modern bedsitter near Makerere campus. Quiet zone, reliable power.",ll:"James K.",phone:"0756789012",wa:"256756789012",fee:5000,agent:0,hostel:0},
  {id:6,name:"Executive Naguru 2BR",area:"Naguru",price:850000,type:"Self-Contained",v:1,boost:1,pop:0,rating:4.8,conf:97,ready:1,beds:2,baths:2,sqm:85,img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80",desc:"Executive 2-bedroom in Naguru hills. Generator, rooftop terrace, panoramic city views.",ll:"David R.",phone:"0712000006",wa:"256712000006",fee:5000,agent:1,agname:"Grace K.",hostel:0},
];

export const JOBS=[
  {id:"J1",cat:"Plumbing",col:"#1A5FAA",title:"Fix leaking pipe in kitchen",loc:"Kira, Wakiso",budget:45000,posted:"2h ago",urgent:1,tags:["Same day","Parts included"],client:"Aisha N.",clientPhone:"0712345678",desc:"Kitchen sink pipe burst at the joint under the cabinet. Water is pooling on the floor. Pipe diameter appears to be 1/2 inch. May need a replacement coupling or full pipe section.",status:"approved"},
  {id:"J2",cat:"Moving",col:"#2A5C46",title:"Move 1-bedroom Kisaasi to Ntinda",loc:"Kisaasi → Ntinda",budget:120000,posted:"5h ago",urgent:0,tags:["Truck needed","2 helpers"],client:"Brian M.",clientPhone:"0756789012",desc:"1BR apartment move. Sofa, double bed, 2 wardrobes, fridge, 43\" TV, 8 boxes miscellaneous. Saturday morning preferred. Estimate 4 hours including loading and unloading.",status:"approved"},
  {id:"J3",cat:"Electrical",col:"#D4853A",title:"Install 3 sockets plus ceiling fan",loc:"Wandegeya",budget:60000,posted:"1d ago",urgent:0,tags:["Residential","UMEME certified"],client:"Ruth K.",clientPhone:"0701234567",desc:"New rental house needs 3 double sockets in master bedroom and one ceiling fan mounted. UMEME prepaid meter already installed. Wiring must comply with UMEME standards. Certificate of completion required.",status:"approved"},
  {id:"J4",cat:"Cleaning",col:"#27AE60",title:"Full house deep clean 3 bedrooms",loc:"Naguru",budget:35000,posted:"3h ago",urgent:0,tags:["Move-in","Eco-friendly"],client:"Denis O.",clientPhone:"0789012345",desc:"3BR 2 bath house needs full deep clean before new tenant moves in. Kitchen degreasing, bathroom descaling, all windows inside and out, ceiling fans. Eco-friendly products preferred.",status:"approved"},
  {id:"J5",cat:"Security",col:"#7C3AED",title:"Night guard 3 month contract",loc:"Bukoto compound",budget:300000,posted:"1d ago",urgent:0,tags:["Monthly","Uniform provided"],client:"Sarah B.",clientPhone:"0723456789",desc:"Residential compound of 8 units requires a night guard from 7pm to 6am daily. Uniform and torch provided. Must have valid police clearance certificate. Contract renewable after 3 months.",status:"approved"},
  {id:"J6",cat:"Carpentry",col:"#B8960C",title:"Build wardrobe and bed frame",loc:"Ntinda",budget:200000,posted:"6h ago",urgent:0,tags:["Custom","2 weeks"],client:"Grace L.",clientPhone:"0745678901",desc:"4-door sliding wardrobe 2.4m wide × 2.1m tall and a queen bed frame with storage drawers underneath. Hardwood timber preferred. Client can supply timber or buy from carpenter. Timeline: 2 weeks.",status:"pending"},
];

export const PROVIDERS=[
  {id:"P1",name:"Aisha Nakato",type:"Laundry",area:"Kisaasi",dist:"0.8km",rating:4.9,reviews:47,price:"UGX 8,000/kg",available:1,trust:96,verified:1,jobs:47,bio:"Professional laundry with same-day turnaround. Free pickup within 2km.",specs:["UGX 8,000/kg","Min 3kg","Ironing included","Free pickup"],col:"#EBF3EE",ini:"A"},
  {id:"P2",name:"Brian Trucks Ltd",type:"Movers",area:"Ntinda",dist:"1.2km",rating:4.7,reviews:31,price:"UGX 80,000/trip",available:1,trust:91,verified:1,jobs:31,bio:"Licensed moving company. 3-ton covered truck.",specs:["3-ton covered lorry","2 helpers","Guard rails","GPS tracked"],col:"#EEF4FD",ini:"B"},
  {id:"P3",name:"Grace Clean Pro",type:"Cleaners",area:"Makerere",dist:"2.1km",rating:4.8,reviews:62,price:"UGX 25,000/room",available:1,trust:88,verified:1,jobs:62,bio:"Professional deep cleaning. Eco-friendly.",specs:["UGX 25,000/room","Eco-friendly","Deep clean","Move-in specialist"],col:"#F0FDF4",ini:"G"},
  {id:"P4",name:"Patrick Plumbing Pro",type:"Plumbers",area:"Bukoto",dist:"3.2km",rating:4.9,reviews:85,price:"UGX 35,000/visit",available:1,trust:94,verified:1,jobs:85,bio:"10 years experience. Emergency 24/7. UMEME certified.",specs:["Emergency +UGX 15K","Parts at cost","30-day warranty","Receipt"],col:"#F3E8FF",ini:"P"},
  {id:"P5",name:"James Electric",type:"Electricians",area:"Naguru",dist:"4.0km",rating:4.7,reviews:39,price:"UGX 30,000/visit",available:1,trust:90,verified:1,jobs:39,bio:"UMEME licensed. Solar installation.",specs:["UMEME licensed","Solar","Commercial","Insured"],col:"#FFF7ED",ini:"J"},
];

export const MOVING_PROVIDERS=[
  {id:"MV1",name:"Brian Trucks Ltd",type:"Full Removal",area:"Ntinda",phone:"0756789012",rating:4.7,reviews:31,price:"UGX 150,000/trip",available:1,capacity:"3-ton covered lorry",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",features:["Full Kampala","2 helpers","Guard rails","Same-day"],verified:1},
  {id:"MV2",name:"Kampala Movers Pro",type:"Full Removal",area:"Kisaasi",phone:"0701234567",rating:4.5,reviews:18,price:"UGX 120,000/trip",available:1,capacity:"2-ton pickup",img:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80",features:["Flatbed truck","Tarpaulin","Ropes","Budget"],verified:1},
  {id:"MV3",name:"SafeMove Uganda",type:"Vehicle Hire",area:"Wandegeya",phone:"0789012345",rating:4.8,reviews:45,price:"UGX 60,000/trip",available:1,capacity:"1-ton pickup",img:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&q=80",features:["Self-load","Tarpaulin","Flexible","City only"],verified:1},
];

export const LAND=[
  {id:"L1",name:"1 Acre Residential Plot",area:"Mukono",price:45000000,size:"1 acre",deed:"Mailo Land",img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80",fee:50000,feats:["Registered title","All-weather road","Flat terrain","Near highway"]},
  {id:"L2",name:"50x100ft Freehold Plot",area:"Wakiso",price:18000000,size:"50x100ft",deed:"Freehold",img:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",fee:30000,feats:["Freehold title","Near town council","Borehole on plot","Flat"]},
  {id:"L3",name:"Premium Hilltop Plot",area:"Kololo",price:280000000,size:"0.5 acres",deed:"Freehold",img:"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80",fee:100000,feats:["Freehold","Hilltop views","Commercial zoning","Prime Kololo"],prem:true},
];

export const HOSTELS=[
  {id:"H1",name:"Akamwesi Premium Hostel",area:"Banda",uni:"Kyambogo University",warden:"Mrs Sarah Nakato",phone:"0771234567",email:"akamwesi@hostel.ug",img:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80",tier:"premium",
   facilities:["WiFi 50Mbps","En-suite bathrooms","CCTV 24hr","Study room","Generator backup","Laundry room","Rooftop terrace","Security guards"],
   financials:{semester1:2500000,semester2:2400000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"Akamwesi Premium Hostel Ltd",accountNumber:"9030001234567"},
   rooms:[
     {num:"P101",type:"Single",sharing:"Alone",price:2500000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["En-suite","WiFi","AC","Study desk","TV"]},
     {num:"P102",type:"Single",sharing:"Alone",price:2500000,sem:"Sem 1 2025",status:"Booked",floor:"Ground",features:["En-suite","WiFi","AC","Study desk"]},
     {num:"P201",type:"Double",sharing:"2 students",price:1800000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["En-suite","WiFi","Study desk","AC"]},
     {num:"P301",type:"Single",sharing:"Alone",price:2600000,sem:"Sem 2 2025",status:"Available",floor:"Second",features:["En-suite","WiFi","AC","Balcony","City view"]},
   ]},
  {id:"H2",name:"ISBAT Student Lodge",area:"Lugogo",uni:"ISBAT University",warden:"Mr James Opio",phone:"0701345678",email:"isbat@lodge.ug",img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",tier:"mid",
   facilities:["WiFi 20Mbps","Study room","Security guard","24hr water","CCTV","Common kitchen"],
   financials:{semester1:1800000,semester2:1750000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"ISBAT Student Lodge",accountNumber:"9030007654321"},
   rooms:[
     {num:"S101",type:"Single",sharing:"Alone",price:1800000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["Shared bathroom","WiFi","Study desk"]},
     {num:"S102",type:"Single",sharing:"Alone",price:1800000,sem:"Sem 1 2025",status:"Booked",floor:"Ground",features:["Shared bathroom","WiFi"]},
     {num:"S201",type:"Double",sharing:"2 students",price:1200000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["Shared bathroom","WiFi","Study desk"]},
     {num:"S301",type:"Triple",sharing:"3 students",price:900000,sem:"Sem 1 2025",status:"Available",floor:"Second",features:["Shared bathroom","WiFi"]},
   ]},
  {id:"H3",name:"MUBs Budget Hostel",area:"Nakawa",uni:"Makerere University Business School",warden:"Ms Doreen Atim",phone:"0789234567",email:"mubs@hostel.ug",img:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&q=80",tier:"budget",
   facilities:["WiFi 10Mbps","Shared kitchen","Security guard","24hr water","Study room"],
   financials:{semester1:1200000,semester2:1150000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"MUBs Budget Hostel",accountNumber:"9030009876543"},
   rooms:[
     {num:"B101",type:"Single",sharing:"Alone",price:1200000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["Shared bathroom","WiFi"]},
     {num:"B201",type:"Double",sharing:"2 students",price:800000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["Shared bathroom","WiFi"]},
     {num:"B301",type:"Triple",sharing:"3 students",price:600000,sem:"Sem 1 2025",status:"Available",floor:"Second",features:["Shared bathroom","WiFi"]},
   ]},
  {id:"H4",name:"Ndejje Hilltop Residence",area:"Ndejje",uni:"Ndejje University",warden:"Mr Paul Mugisha",phone:"0756789234",email:"ndejje@residence.ug",img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80",tier:"mid",
   facilities:["WiFi 15Mbps","Study room","CCTV","24hr water","Security","Common room"],
   financials:{semester1:1500000,semester2:1450000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"Ndejje Hilltop Residence",accountNumber:"9030002345678"},
   rooms:[
     {num:"N101",type:"Single",sharing:"Alone",price:1500000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["Shared bathroom","WiFi","Study desk"]},
     {num:"N201",type:"Double",sharing:"2 students",price:1000000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["Shared bathroom","WiFi"]},
   ]},
  {id:"H5",name:"Nkumba Lakeview Lodge",area:"Nkumba",uni:"Nkumba University",warden:"Mrs Grace Tendo",phone:"0712345890",email:"nkumba@lakeview.ug",img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80",tier:"premium",
   facilities:["WiFi 30Mbps","Lake view rooms","Swimming pool","Study room","Generator","Security","CCTV","Laundry"],
   financials:{semester1:2200000,semester2:2100000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"Nkumba Lakeview Lodge",accountNumber:"9030003456789"},
   rooms:[
     {num:"L101",type:"Single",sharing:"Alone",price:2200000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["En-suite","WiFi","Lake view","AC"]},
     {num:"L201",type:"Double",sharing:"2 students",price:1600000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["Shared bathroom","WiFi","Lake view"]},
   ]},
  {id:"H6",name:"Must Mbarara Hostel",area:"Mbarara",uni:"Mbarara University of Science & Technology",warden:"Dr Peter Katureebe",phone:"0701678901",email:"must@hostel.ug",img:"https://images.unsplash.com/photo-1494526585095-c41746248156?w=700&q=80",tier:"mid",
   facilities:["WiFi 20Mbps","Study room","CCTV","24hr security","Common kitchen","Generator"],
   financials:{semester1:1600000,semester2:1550000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"Must Mbarara Hostel",accountNumber:"9030004567890"},
   rooms:[
     {num:"M101",type:"Single",sharing:"Alone",price:1600000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["Shared bathroom","WiFi","Study desk"]},
     {num:"M201",type:"Double",sharing:"2 students",price:1100000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["Shared bathroom","WiFi"]},
     {num:"M301",type:"Triple",sharing:"3 students",price:800000,sem:"Sem 1 2025",status:"Available",floor:"Second",features:["Shared bathroom","WiFi"]},
   ]},
  {id:"H7",name:"Gulu University Hostel",area:"Gulu",uni:"Gulu University",warden:"Mrs Agnes Oryem",phone:"0782345678",email:"gulu@hostel.ug",img:"https://images.unsplash.com/photo-1460317442991-0ec209397118?w=700&q=80",tier:"budget",
   facilities:["WiFi 10Mbps","Shared kitchen","Security guard","Study room","24hr water"],
   financials:{semester1:1000000,semester2:950000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"Gulu University Hostel",accountNumber:"9030005678901"},
   rooms:[
     {num:"G101",type:"Single",sharing:"Alone",price:1000000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["Shared bathroom","WiFi"]},
     {num:"G201",type:"Double",sharing:"2 students",price:700000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["Shared bathroom","WiFi"]},
   ]},
  {id:"H8",name:"Muni Arua Premium Hostel",area:"Arua",uni:"Muni University",warden:"Mr David Obitre",phone:"0756890123",email:"muni@hostel.ug",img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80",tier:"mid",
   facilities:["WiFi 15Mbps","Study room","Security","24hr water","CCTV","Common room"],
   financials:{semester1:1400000,semester2:1350000,bookingFee:80000,bankName:"Stanbic Bank",accountName:"Muni Arua Premium Hostel",accountNumber:"9030006789012"},
   rooms:[
     {num:"A101",type:"Single",sharing:"Alone",price:1400000,sem:"Sem 1 2025",status:"Available",floor:"Ground",features:["Shared bathroom","WiFi","Study desk"]},
     {num:"A201",type:"Double",sharing:"2 students",price:950000,sem:"Sem 1 2025",status:"Available",floor:"First",features:["Shared bathroom","WiFi"]},
   ]},
];

export const LAND_TIPS=[
  {n:1,title:"Search at Ministry of Lands",desc:"Verify the title holder before any payment. A search costs UGX 10,000.",risk:"high"},
  {n:2,title:"Physical inspection with surveyor",desc:"Visit with a registered surveyor to verify exact boundaries and flood risks.",risk:"high"},
  {n:3,title:"Obtain spousal consent",desc:"Under the Land Act, the sale is VOID without written spouse consent for matrimonial property.",risk:"high"},
  {n:4,title:"Verify not family land",desc:"Family land cannot be sold without all adult family member consent. Check LC1 records.",risk:"high"},
  {n:5,title:"File a caveat immediately",desc:"File a caveat at Ministry of Lands to prevent further transactions during your transfer.",risk:"med"},
  {n:6,title:"Hire a registered lawyer",desc:"Have a licensed Ugandan lawyer draft and witness the sale agreement.",risk:"high"},
  {n:7,title:"Never pay everything upfront",desc:"Hold 10–20% until the title is officially in your name at the Ministry of Lands.",risk:"high"},
  {n:8,title:"Initiate official titling",desc:"Land sold with only a sale agreement is vulnerable to fraud. Begin Land Registration.",risk:"med"},
  {n:9,title:"Consult LC1 and neighbours",desc:"Talk to the LC1 chairman and neighbours to confirm the seller's claim.",risk:"med"},
  {n:10,title:"Beware suspiciously cheap land",desc:"Cheap land is almost always in a legal dispute, flood zone, or fraudulent.",risk:"high"},
];

export const AREAS=["All Areas","Bukoto","Kisaasi","Ntinda","Wandegeya","Makerere","Naguru","Kololo","Muyenga","Banda","Nakawa","Lugogo","Mukono","Wakiso","Ndejje","Nkumba","Mbarara","Gulu","Arua"];
export const TYPES=["All Types","Self-Contained","Single Room","Double Room","Hostel","Shared Housing","Apartment","Studio"];
