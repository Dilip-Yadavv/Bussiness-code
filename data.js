/**
 * APEX ARCHITECTURAL METALWORKS & FABRICATION DATA
 * Real-world industrial specifications, realistic high-res architectural assets, and pricing.
 */
const DEFAULT_CONFIG = {
  shopName: "Apex Architectural Metalworks",
  tagline: "Custom Architectural Iron Grills, High-Security Gates & Precision Metal Facades",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  email: "studio@apexmetalworks.com",
  address: "Plot 42, Heavy Industrial Zone, Phase II, Highway Corridor",
  city: "Mumbai / Metro Hub - 400018",
  mapQuery: "Heavy Industrial Zone Phase 2 Highway",
  geminiApiKey: "",
  experienceYears: "22+",
  projectsCompleted: "4,200+",
  happyClients: "3,800+",
  rating: "4.95 / 5.0",
  workingHours: "Mon - Sat: 8:30 AM - 8:30 PM (Sunday Site Visits by Appointment)",
  aboutText: "Apex Architectural Metalworks is an ISO-aligned bespoke fabrication atelier specializing in heavy-gauge Mild Steel (MS 10G/12G), Hand-Forged Wrought Iron, Marine-Grade Stainless Steel (SS-316/304), and German CNC Laser Cut architectural installations with 7-tank zinc phosphating and 15-year weather-shield powder coating.",
  currencySymbol: "₹",
  
  // Real material rates per Sq. Ft.
  rates: {
    ms_standard: {
      name: "Mild Steel (MS 14-Gauge Solid Bar)",
      baseRateSqFt: 240,
      weightPerSqFt: 3.4,
      tensile: "380 MPa",
      antiBurglary: "Grade 3",
      description: "Solid 12mm x 12mm square bars with dual zinc chromate primer and baked enamel finish."
    },
    ms_heavy: {
      name: "Mild Steel (MS 10G/12G Heavy Armored)",
      baseRateSqFt: 310,
      weightPerSqFt: 4.8,
      tensile: "450 MPa",
      antiBurglary: "Grade 5 (High Security)",
      description: "Solid 16mm forged alloy bars designed for anti-pry ground floor safety doors & villas."
    },
    wrought_iron: {
      name: "Handcrafted Forged Wrought Iron",
      baseRateSqFt: 420,
      weightPerSqFt: 5.5,
      tensile: "420 MPa",
      antiBurglary: "Grade 4",
      description: "Master blacksmith scrollwork, vintage floral leaves, and hand-rubbed antique patinas."
    },
    ss_304: {
      name: "Marine Grade SS-304 Stainless Steel",
      baseRateSqFt: 490,
      weightPerSqFt: 3.9,
      tensile: "520 MPa",
      antiBurglary: "Grade 4",
      description: "100% Rust-proof, satin brushed or mirror chrome finish, ideal for high humidity coastal homes."
    },
    cnc_laser: {
      name: "CNC Precision Laser-Cut Steel (4mm-6mm)",
      baseRateSqFt: 560,
      weightPerSqFt: 5.2,
      tensile: "480 MPa",
      antiBurglary: "Grade 4",
      description: "Ultra-sharp fiber laser cut geometric/contemporary privacy screens with SS-304 top grips."
    }
  },

  // Finishing Options
  finishes: {
    primer_enamel: { 
      name: "Red Oxide Zinc Primer + Double Coat PU Enamel", 
      extraPerSqFt: 0,
      colorHex: "#1c1e24",
      warranty: "3 Years"
    },
    powder_coat: { 
      name: "7-Tank Zinc Phosphated Polyester Powder Coat (Matte Jet Black)", 
      extraPerSqFt: 50,
      colorHex: "#111216",
      warranty: "8 Years Rust-Free"
    },
    antique_patina: { 
      name: "Hand-Rubbed Antique Bronze / Burnished Copper Patina", 
      extraPerSqFt: 85,
      colorHex: "#8c6239",
      warranty: "6 Years"
    },
    pvd_gold: { 
      name: "PVD Titanium Champagne Gold / Rose Gold Finish", 
      extraPerSqFt: 140,
      colorHex: "#d4af37",
      warranty: "15 Years Non-Fading"
    }
  },

  // High-Resolution Curated Real Project Catalog
  products: [
    {
      id: "prod-1",
      title: "Monolith Minimalist Geometric Window Grill",
      category: "window",
      material: "MS 12G Solid Square Bar",
      priceRange: "₹240 - ₹290 / sq.ft",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      description: "Architectural linear vertical bars with concealed wall anchor plugs and seamless orbital welds. Matte black powder coating prevents all glare.",
      features: ["Solid 14mm Cold-Rolled Bars", "Concealed Wall Expansion Bolts", "Zero-Slag TIG Welds", "100% Anti-Pry Geometry"]
    },
    {
      id: "prod-2",
      title: "Château Forged Wrought Iron Double Entrance Gate",
      category: "gates",
      material: "Forged Wrought Iron & Solid Billet",
      priceRange: "₹420 - ₹540 / sq.ft",
      image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1200&q=80",
      description: "Monumental driveway gate featuring hand-twisted pickets, cast iron rosettes, grease-sealed brass bearing hinges, and Italian motor mounting brackets.",
      features: ["50mm x 50mm Structural Frame", "Heavy Ball Bearing Hinges", "Electric Strike Lock Ready", "Hot-Dip Galvanized Undercoat"]
    },
    {
      id: "prod-3",
      title: "Parametric CNC Laser Cut Privacy Balcony Railing",
      category: "balcony",
      material: "4mm Mild Steel + SS-304 Grip",
      priceRange: "₹480 - ₹620 / sq.ft",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      description: "Fiber-laser crafted geometric ventilation pattern offering 70% sightline privacy while allowing optimum sunlight and breeze for luxury penthouse terraces.",
      features: ["4mm German Laser Cut Sheet", "Stainless Steel 50mm Top Pipe", "Child-Safe Zero-Climb Facet", "10-Year Weather Coat"]
    },
    {
      id: "prod-4",
      title: "Fortress Multi-Bolt Iron Safety Security Door",
      category: "doors",
      material: "Armored MS 10G & SS Inset",
      priceRange: "₹340 - ₹460 / sq.ft",
      image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1200&q=80",
      description: "High-security main door grill with concealed deadbolt casing, anti-crowbar lip, and optional micro-mesh SS-304 mosquito barrier.",
      features: ["Concealed Lock Box Housing", "Heavy 3-Way Barrel Hinges", "Anti-Crowbar Perimeter Lip", "Stainless Steel Mosquito Screen"]
    },
    {
      id: "prod-5",
      title: "Cantilever Floating Glass & Black Steel Stair Railing",
      category: "stairs",
      material: "SS-304 & Matte Carbon Steel",
      priceRange: "₹380 - ₹520 / running ft",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      description: "Ultra-clean slimline balusters with radius corners and countersunk floor baseplates for luxury duplex residences and corporate offices.",
      features: ["Concealed Floor Stud Fixings", "Smooth Ergonomic Grip", "Strict 95mm Child Gap Code", "Mirror/Satin Finish Available"]
    },
    {
      id: "prod-6",
      title: "Aero-Wire High-Tensile SS-316 Invisible Grill",
      category: "window",
      material: "High-Tensile SS-316 Steel Cable",
      priceRange: "₹190 - ₹260 / sq.ft",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      description: "High-rise apartment invisible safety cables with 300kg tensile break threshold, offering complete fall protection without obstructing skyline views.",
      features: ["300kg Cable Break Load", "Marine-Grade SS-316 Alloy", "Integrated Intrusion Alarm Option", "Zero View Obstruction"]
    },
    {
      id: "prod-7",
      title: "Bi-Folding Automated Driveway Sliding Gate",
      category: "gates",
      material: "Heavy Gauge Tubular Steel & WPC Accents",
      priceRange: "₹480 - ₹650 / sq.ft",
      image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80",
      description: "Smooth tracked bi-folding cantilever gate tailored for tight urban driveways, compatible with Nice / Faac Italian automation systems.",
      features: ["Space-Saving 90° Bi-fold Track", "Italian Automation Ready", "Anti-Crush Safety Sensors", "Silent Polyurethane Rollers"]
    },
    {
      id: "prod-8",
      title: "Belgravia Belly-Curved Victorian Flower Pot Grill",
      category: "window",
      material: "Forged MS Bar & Cast Iron Rosettes",
      priceRange: "₹310 - ₹390 / sq.ft",
      image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=80",
      description: "Classical European window grill with a 9-inch belly protrusion to accommodate outdoor flower pots and planters with timeless elegance.",
      features: ["9-Inch Belly Planter Projection", "Heavy Cast Center Medallions", "High Wind & Storm Resistance", "Zinc-Phosphated Immersion"]
    }
  ],

  // Real Case Studies
  caseStudies: [
    {
      title: "Villa Solaria — 38 Bespoke Facade Grills & Main Gate",
      client: "Ar. Sneha Kulkarni Architects",
      location: "Palm Meadows Estate",
      specs: "MS 12G + 7-Tank Zinc Phosphated Matte Jet Black Powder Coating",
      area: "1,450 Sq. Ft. Total",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      duration: "14 Days On-Site Completion"
    },
    {
      title: "Skyline High-Rise — 92 Balcony Railings & Invisible Grills",
      client: "Meridian Developers",
      location: "Skyline Towers, Metro Corridor",
      specs: "Marine Grade SS-316 High-Tensile Cables & CNC Facade Panels",
      area: "3,200 Sq. Ft. Total",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      duration: "21 Days Turnaround"
    }
  ],

  // Testimonials
  testimonials: [
    {
      name: "Rajesh Sharma",
      role: "Homeowner, Green Valley Villa",
      text: "Got 12 window grills and an armored safety door made. The precision of the welds, the exact 12-gauge solid steel, and the matte powder coating is flawless. Completed before our housewarming!",
      rating: 5,
      date: "Verified Customer"
    },
    {
      name: "Ar. Sneha Kulkarni",
      role: "Lead Architect, Studio Kulkarni",
      text: "Apex is our default metal fabrication partner for high-end residential villas. Their laser accuracy, true gauge thickness, and structural anchoring give our clients absolute peace of mind.",
      rating: 5,
      date: "Verified Architect"
    },
    {
      name: "Vikram Malhotra",
      role: "Commercial Complex Director",
      text: "They fabricated and installed 140 running feet of heavy motorized entrance gates and perimeter railings. Superb engineering and prompt post-handover support.",
      rating: 5,
      date: "Verified Client"
    }
  ]
};
