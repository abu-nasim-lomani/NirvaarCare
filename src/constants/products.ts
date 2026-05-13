// ──────────────────────────────────────────────────────────────────
// NirvaarCare Health Store — Product Data & Types
// ──────────────────────────────────────────────────────────────────

export interface Product {
    id: string;
    name: { en: string; bn: string };
    category: string;
    categoryName: { en: string; bn: string };
    image: string;                 // primary / thumbnail image (required, backward-compat)
    images?: string[];             // additional gallery images (optional)
    videoUrl?: string;             // YouTube embed or direct MP4 URL (optional)
    price: number;                 // BDT
    discount?: number;             // percent
    rating: number;
    reviewCount: number;
    inStock: boolean;
    isNew?: boolean;
    isFeatured?: boolean;
    shortDesc: { en: string; bn: string };
    description: { en: string; bn: string };
    features: { en: string; bn: string }[];
    specs?: { label: { en: string; bn: string }; value: string }[];
    howToUse?: { en: string; bn: string };
    tags?: string[];
}

export interface ProductCategory {
    id: string;
    name: { en: string; bn: string };
    icon: string;
}

// ── Categories ──────────────────────────────────────────────────────
export const productCategories: ProductCategory[] = [
    { id: "monitoring",    name: { en: "Monitoring & Diagnostics", bn: "মনিটরিং ও ডায়াগনস্টিক" }, icon: "Activity" },
    { id: "wearables",     name: { en: "Smart Wearables",           bn: "স্মার্ট ওয়্যারেবল" },        icon: "Watch" },
    { id: "therapy",       name: { en: "Therapy & Mobility",        bn: "থেরাপি ও গতিশীলতা" },        icon: "Zap" },
    { id: "respiratory",   name: { en: "Respiratory Care",          bn: "শ্বাসযন্ত্রের যত্ন" },         icon: "Wind" },
    { id: "smart-home",    name: { en: "Smart Home Health",         bn: "স্মার্ট হোম" },               icon: "Home" },
];

// ── Product Data ─────────────────────────────────────────────────────
export const productsData: Product[] = [

    // ── MONITORING & DIAGNOSTICS ─────────────────────────────────────

    {
        id: "bp-monitor",
        name: { en: "Smart BP Monitor", bn: "স্মার্ট বিপি মনিটর" },
        category: "monitoring",
        categoryName: { en: "Monitoring & Diagnostics", bn: "মনিটরিং ও ডায়াগনস্টিক" },
        image: "https://images.unsplash.com/photo-1631815588090-d1bcbe9b4b38?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600"
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 3200,
        discount: 10,
        rating: 4.8,
        reviewCount: 247,
        inStock: true,
        isFeatured: true,
        shortDesc: {
            en: "Clinically validated upper-arm blood pressure monitor with Bluetooth & app sync.",
            bn: "ক্লিনিক্যালি যাচাইকৃত আপার-আর্ম ব্লাড প্রেশার মনিটর, ব্লুটুথ ও অ্যাপ সিঙ্ক সহ।"
        },
        description: {
            en: "The NirvaarCare Smart BP Monitor delivers accurate systolic/diastolic readings with WHO-scale color coding. Large LCD display, memory for 60 readings, irregular heartbeat detection, and seamless Bluetooth sync with the NirvaarCare app.",
            bn: "নির্ভার কেয়ার স্মার্ট বিপি মনিটর সিস্টোলিক/ডায়াস্টোলিক রিডিং সঠিকভাবে প্রদান করে, WHO স্কেল রঙ-কোডিং সহ। বড় LCD ডিসপ্লে, ৬০টি রিডিং মেমোরি, অনিয়মিত হৃদস্পন্দন শনাক্তকরণ এবং ব্লুটুথ সিঙ্ক।"
        },
        features: [
            { en: "WHO blood pressure classification color coding", bn: "WHO রক্তচাপ শ্রেণীবিভাগ রং কোডিং" },
            { en: "60-reading memory with date/time stamp", bn: "তারিখ/সময় সহ ৬০টি রিডিং মেমোরি" },
            { en: "Irregular heartbeat detection alert", bn: "অনিয়মিত হৃদস্পন্দন সতর্কতা" },
            { en: "Bluetooth sync with smartphone app", bn: "স্মার্টফোন অ্যাপের সাথে ব্লুটুথ সিঙ্ক" },
        ],
        specs: [
            { label: { en: "Cuff Size", bn: "কাফ সাইজ" }, value: "22–42 cm" },
            { label: { en: "Pressure Range", bn: "প্রেশার রেঞ্জ" }, value: "20–280 mmHg" },
            { label: { en: "Power", bn: "পাওয়ার" }, value: "4×AA Battery / USB" },
            { label: { en: "Bluetooth", bn: "ব্লুটুথ" }, value: "BT 5.0" },
        ],
        tags: ["bp", "blood pressure", "heart", "monitoring"],
    },

    {
        id: "pulse-oximeter",
        name: { en: "Pulse Oximeter", bn: "পালস অক্সিমিটার" },
        category: "monitoring",
        categoryName: { en: "Monitoring & Diagnostics", bn: "মনিটরিং ও ডায়াগনস্টিক" },
        image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600",
        price: 1800,
        discount: 5,
        rating: 4.7,
        reviewCount: 189,
        inStock: true,
        isFeatured: true,
        shortDesc: {
            en: "Fingertip SpO₂ & pulse rate sensor with OLED display, 6-direction rotation.",
            bn: "ফিঙ্গারটিপ SpO₂ ও পালস রেট সেন্সর, OLED ডিসপ্লে ও ৬-দিক রোটেশন সহ।"
        },
        description: {
            en: "Medical-grade fingertip pulse oximeter with fast 5-second reading, dual-color LED, and low-battery alarm. Perfect for continuous monitoring at home.",
            bn: "মেডিকেল-গ্রেড ফিঙ্গারটিপ পালস অক্সিমিটার। মাত্র ৫ সেকেন্ডে রিডিং, ডুয়াল-কালার LED এবং লো-ব্যাটারি এলার্ম।"
        },
        features: [
            { en: "SpO₂ accuracy ±2% at 70–99%", bn: "SpO₂ নির্ভুলতা ±২% (৭০-৯৯%)" },
            { en: "Heart rate range: 25–250 BPM", bn: "হার্ট রেট রেঞ্জ: ২৫–২৫০ BPM" },
            { en: "OLED 6-direction auto-rotate display", bn: "OLED ৬-দিক অটো-রোটেট ডিসপ্লে" },
            { en: "Auto power-off in 8 seconds", bn: "৮ সেকেন্ডে অটো পাওয়ার-অফ" },
        ],
        specs: [
            { label: { en: "Accuracy", bn: "নির্ভুলতা" }, value: "SpO₂ ±2%, PR ±2 BPM" },
            { label: { en: "Display", bn: "ডিসপ্লে" }, value: "0.96\" OLED" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "2×AAA" },
            { label: { en: "Weight", bn: "ওজন" }, value: "30g" },
        ],
        tags: ["oxygen", "spo2", "pulse", "monitoring"],
    },

    {
        id: "glucometer",
        name: { en: "Smart Glucometer", bn: "স্মার্ট গ্লুকোমিটার" },
        category: "monitoring",
        categoryName: { en: "Monitoring & Diagnostics", bn: "মনিটরিং ও ডায়াগনস্টিক" },
        image: "https://images.unsplash.com/photo-1609878656840-9c4dd6f51cef?auto=format&fit=crop&q=80&w=600",
        price: 2500,
        rating: 4.6,
        reviewCount: 156,
        inStock: true,
        shortDesc: {
            en: "5-second blood glucose reading with 500-test memory and smart app logging.",
            bn: "৫ সেকেন্ডে রক্তের গ্লুকোজ পরিমাপ, ৫০০ টেস্ট মেমোরি ও স্মার্ট অ্যাপ লগিং।"
        },
        description: {
            en: "High-precision glucometer with tiny blood sample requirement (0.6 µL), no-coding strips, and comprehensive app logging for trend analysis.",
            bn: "উচ্চ-নির্ভুল গ্লুকোমিটার, মাত্র ০.৬ µL রক্ত প্রয়োজন, নো-কোডিং স্ট্রিপ এবং ট্রেন্ড বিশ্লেষণের জন্য অ্যাপ লগিং।"
        },
        features: [
            { en: "Only 0.6 µL blood sample required", bn: "মাত্র ০.৬ µL রক্তের নমুনা প্রয়োজন" },
            { en: "500-test memory with date/time", bn: "তারিখ/সময় সহ ৫০০ টেস্ট মেমোরি" },
            { en: "7/14/30-day average calculation", bn: "৭/১৪/৩০-দিনের গড় গণনা" },
            { en: "No-coding test strips", bn: "নো-কোডিং টেস্ট স্ট্রিপ" },
        ],
        specs: [
            { label: { en: "Range", bn: "রেঞ্জ" }, value: "20–600 mg/dL" },
            { label: { en: "Sample", bn: "নমুনা" }, value: "0.6 µL blood" },
            { label: { en: "Test Time", bn: "টেস্ট সময়" }, value: "5 seconds" },
            { label: { en: "Memory", bn: "মেমোরি" }, value: "500 tests" },
        ],
        tags: ["diabetes", "glucose", "blood sugar"],
    },

    {
        id: "infrared-thermometer",
        name: { en: "Infrared Thermometer", bn: "ইনফ্রারেড থার্মোমিটার" },
        category: "monitoring",
        categoryName: { en: "Monitoring & Diagnostics", bn: "মনিটরিং ও ডায়াগনস্টিক" },
        image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600",
        price: 1200,
        discount: 15,
        rating: 4.5,
        reviewCount: 312,
        inStock: true,
        isNew: true,
        shortDesc: {
            en: "Non-contact forehead thermometer, 1-second reading, fever alarm & memory.",
            bn: "নন-কন্টাক্ট ফোরহেড থার্মোমিটার, ১ সেকেন্ড রিডিং, জ্বর এলার্ম ও মেমোরি।"
        },
        description: {
            en: "Medical-grade non-contact thermometer with 1-second forehead scan, color-coded fever alert, and 50-reading memory. Safe for all ages.",
            bn: "মেডিকেল-গ্রেড নন-কন্টাক্ট থার্মোমিটার, ১ সেকেন্ড ফোরহেড স্ক্যান, কালার-কোডেড জ্বর সতর্কতা এবং ৫০ রিডিং মেমোরি।"
        },
        features: [
            { en: "1-second non-contact forehead reading", bn: "১ সেকেন্ড নন-কন্টাক্ট পরিমাপ" },
            { en: "Color-coded fever alert (green/orange/red)", bn: "কালার-কোডেড জ্বর সতর্কতা" },
            { en: "50-reading memory", bn: "৫০ রিডিং মেমোরি" },
            { en: "Object temperature mode", bn: "অবজেক্ট তাপমাত্রা মোড" },
        ],
        specs: [
            { label: { en: "Range", bn: "রেঞ্জ" }, value: "32–42.9°C" },
            { label: { en: "Accuracy", bn: "নির্ভুলতা" }, value: "±0.2°C" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "2×AA" },
            { label: { en: "Distance", bn: "দূরত্ব" }, value: "3–5 cm" },
        ],
        tags: ["thermometer", "fever", "temperature", "contactless"],
    },

    {
        id: "cgm",
        name: { en: "Continuous Glucose Monitor (CGM)", bn: "কন্টিনিউয়াস গ্লুকোজ মনিটর (CGM)" },
        category: "monitoring",
        categoryName: { en: "Monitoring & Diagnostics", bn: "মনিটরিং ও ডায়াগনস্টিক" },
        image: "https://images.unsplash.com/photo-1631217872873-d2dfdc4d3c2c?auto=format&fit=crop&q=80&w=600",
        price: 12000,
        rating: 4.9,
        reviewCount: 78,
        inStock: true,
        isFeatured: true,
        isNew: true,
        shortDesc: {
            en: "14-day wear continuous glucose sensor with real-time alerts and app-based trends.",
            bn: "১৪ দিন পরিধানযোগ্য কন্টিনিউয়াস গ্লুকোজ সেন্সর, রিয়েল-টাইম এলার্ট ও অ্যাপ ট্রেন্ড সহ।"
        },
        description: {
            en: "State-of-the-art CGM sensor for diabetes management. Reads glucose every 5 minutes, sends alerts when levels drop or spike, and syncs live to app and family.",
            bn: "ডায়াবেটিস ম্যানেজমেন্টের জন্য অত্যাধুনিক CGM সেন্সর। প্রতি ৫ মিনিটে গ্লুকোজ পড়ে, লেভেল কমলে বা বাড়লে এলার্ট পাঠায়।"
        },
        features: [
            { en: "14-day continuous wear sensor", bn: "১৪ দিন পরিধানযোগ্য সেন্সর" },
            { en: "5-minute glucose reading intervals", bn: "প্রতি ৫ মিনিটে গ্লুকোজ রিডিং" },
            { en: "High/low glucose smart alerts", bn: "হাই/লো গ্লুকোজ স্মার্ট এলার্ট" },
            { en: "Family sharing / remote monitoring", bn: "পরিবার শেয়ারিং / রিমোট মনিটরিং" },
        ],
        specs: [
            { label: { en: "Sensor Life", bn: "সেন্সর মেয়াদ" }, value: "14 days" },
            { label: { en: "Range", bn: "রেঞ্জ" }, value: "40–500 mg/dL" },
            { label: { en: "Accuracy", bn: "নির্ভুলতা" }, value: "MARD <9%" },
            { label: { en: "Connectivity", bn: "সংযোগ" }, value: "NFC / BT 5.0" },
        ],
        tags: ["cgm", "diabetes", "continuous", "glucose"],
    },

    // ── SMART WEARABLES ─────────────────────────────────────────────

    {
        id: "smart-ring",
        name: { en: "Smart Ring", bn: "স্মার্ট রিং" },
        category: "wearables",
        categoryName: { en: "Smart Wearables", bn: "স্মার্ট ওয়্যারেবল" },
        image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=600",
        price: 18000,
        rating: 4.7,
        reviewCount: 94,
        inStock: true,
        isNew: true,
        isFeatured: true,
        shortDesc: {
            en: "Titanium health ring tracking SpO₂, HRV, sleep, stress & body temperature 24/7.",
            bn: "টাইটানিয়াম হেলথ রিং — SpO₂, HRV, ঘুম, স্ট্রেস ও শরীরের তাপমাত্রা ২৪/৭ ট্র্যাক করে।"
        },
        description: {
            en: "A premium titanium smart ring with industry-leading health sensors. Track heart rate, blood oxygen, sleep stages, stress, and temperature with up to 7-day battery.",
            bn: "প্রিমিয়াম টাইটানিয়াম স্মার্ট রিং। হার্ট রেট, ব্লাড অক্সিজেন, ঘুমের পর্যায়, স্ট্রেস ও তাপমাত্রা ট্র্যাক করুন, ৭ দিন পর্যন্ত ব্যাটারি।"
        },
        features: [
            { en: "24/7 heart rate & SpO₂ tracking", bn: "২৪/৭ হার্ট রেট ও SpO₂ ট্র্যাকিং" },
            { en: "Advanced sleep stage analysis", bn: "উন্নত ঘুমের পর্যায় বিশ্লেষণ" },
            { en: "Stress & recovery score", bn: "স্ট্রেস ও রিকভারি স্কোর" },
            { en: "Up to 7-day battery life", bn: "৭ দিন পর্যন্ত ব্যাটারি" },
        ],
        specs: [
            { label: { en: "Material", bn: "উপাদান" }, value: "Titanium" },
            { label: { en: "Water Resistance", bn: "জলরোধী" }, value: "IP68 (100m)" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "Up to 7 days" },
            { label: { en: "Sizes", bn: "সাইজ" }, value: "6–13 (US)" },
        ],
        tags: ["ring", "wearable", "sleep", "hrv", "health tracking"],
    },

    {
        id: "health-watch",
        name: { en: "Health Monitoring Watch", bn: "হেলথ মনিটরিং ওয়াচ" },
        category: "wearables",
        categoryName: { en: "Smart Wearables", bn: "স্মার্ট ওয়্যারেবল" },
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
        price: 8500,
        discount: 12,
        rating: 4.6,
        reviewCount: 203,
        inStock: true,
        isFeatured: true,
        shortDesc: {
            en: "Multi-parameter health watch with ECG, SpO₂, BP estimation & fall detection.",
            bn: "ECG, SpO₂, BP অনুমান ও ফল ডিটেকশন সহ মাল্টি-প্যারামিটার হেলথ ওয়াচ।"
        },
        description: {
            en: "A comprehensive health wristband designed for elderly care. Monitors ECG, blood oxygen, estimated blood pressure, step count, and includes an emergency SOS button.",
            bn: "বয়স্কদের যত্নের জন্য ডিজাইন করা বহুমুখী হেলথ রিস্টব্যান্ড। ECG, রক্তের অক্সিজেন, আনুমানিক রক্তচাপ, স্টেপ কাউন্ট মনিটর করে এবং জরুরি SOS বোতাম অন্তর্ভুক্ত।"
        },
        features: [
            { en: "Single-lead ECG with report export", bn: "সিঙ্গেল-লিড ECG রিপোর্ট এক্সপোর্ট" },
            { en: "SpO₂, HR & BP estimation", bn: "SpO₂, HR ও BP অনুমান" },
            { en: "Fall detection & SOS alert", bn: "ফল ডিটেকশন ও SOS এলার্ট" },
            { en: "1.96\" AMOLED always-on display", bn: "১.৯৬\" AMOLED সর্বদা-চালু ডিসপ্লে" },
        ],
        specs: [
            { label: { en: "Display", bn: "ডিসপ্লে" }, value: "1.96\" AMOLED" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "Up to 10 days" },
            { label: { en: "Water Resistance", bn: "জলরোধী" }, value: "ATM5" },
            { label: { en: "GPS", bn: "GPS" }, value: "Built-in" },
        ],
        tags: ["smartwatch", "ecg", "fall detection", "elderly"],
    },

    {
        id: "sos-device",
        name: { en: "SOS Device", bn: "SOS ডিভাইস" },
        category: "wearables",
        categoryName: { en: "Smart Wearables", bn: "স্মার্ট ওয়্যারেবল" },
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600",
        price: 4500,
        rating: 4.8,
        reviewCount: 167,
        inStock: true,
        isFeatured: true,
        shortDesc: {
            en: "One-press GPS emergency alert device with 4G SIM, fall detection & two-way call.",
            bn: "এক চাপে GPS জরুরি এলার্ট ডিভাইস, 4G SIM, ফল ডিটেকশন ও দ্বি-মুখী কল।"
        },
        description: {
            en: "A compact personal safety device specially designed for elderly and vulnerable individuals. Press SOS to instantly alert 5 emergency contacts with GPS location.",
            bn: "বয়স্ক ও দুর্বল ব্যক্তিদের জন্য বিশেষভাবে ডিজাইন করা কমপ্যাক্ট সেফটি ডিভাইস। SOS চাপলেই GPS সহ ৫টি জরুরি কন্টাক্টে এলার্ট পাঠায়।"
        },
        features: [
            { en: "One-press SOS emergency alert", bn: "এক চাপে SOS জরুরি এলার্ট" },
            { en: "GPS + LBS real-time location", bn: "GPS + LBS রিয়েল-টাইম লোকেশন" },
            { en: "Two-way voice call", bn: "দ্বি-মুখী ভয়েস কল" },
            { en: "Automatic fall detection", bn: "স্বয়ংক্রিয় ফল ডিটেকশন" },
        ],
        specs: [
            { label: { en: "Network", bn: "নেটওয়ার্ক" }, value: "4G LTE" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "72 hrs standby" },
            { label: { en: "Water Resistance", bn: "জলরোধী" }, value: "IP67" },
            { label: { en: "Weight", bn: "ওজন" }, value: "38g" },
        ],
        tags: ["sos", "emergency", "gps", "safety", "elderly"],
    },

    // ── THERAPY & MOBILITY ──────────────────────────────────────────

    {
        id: "knee-massager",
        name: { en: "Smart Knee Massager", bn: "স্মার্ট নি ম্যাসাজার" },
        category: "therapy",
        categoryName: { en: "Therapy & Mobility", bn: "থেরাপি ও গতিশীলতা" },
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
        price: 6800,
        discount: 8,
        rating: 4.5,
        reviewCount: 112,
        inStock: true,
        shortDesc: {
            en: "3-in-1 knee massager with heat therapy, vibration & red light for joint pain relief.",
            bn: "৩-ইন-১ নি ম্যাসাজার — হিট থেরাপি, ভাইব্রেশন ও রেড লাইট দিয়ে জয়েন্ট ব্যথা উপশম।"
        },
        description: {
            en: "Clinically designed knee massager combining infrared heat, vibration massage, and red light therapy to relieve arthritis, joint pain, and knee stiffness effectively.",
            bn: "ক্লিনিক্যালি ডিজাইন করা নি ম্যাসাজার। ইনফ্রারেড তাপ, ভাইব্রেশন ম্যাসাজ এবং রেড লাইট থেরাপি একত্রে আর্থ্রাইটিস, জয়েন্ট ব্যথা ও হাঁটু শক্ততা কমায়।"
        },
        features: [
            { en: "3-mode: heat / vibration / red light", bn: "৩-মোড: তাপ / ভাইব্রেশন / রেড লাইট" },
            { en: "Adjustable temperature 40–50°C", bn: "তাপমাত্রা সমন্বয়যোগ্য ৪০–৫০°C" },
            { en: "Wireless, rechargeable battery", bn: "ওয়্যারলেস, রিচার্জেবল ব্যাটারি" },
            { en: "360° wrap-around design", bn: "৩৬০° র‍্যাপ-অ্যারাউন্ড ডিজাইন" },
        ],
        specs: [
            { label: { en: "Modes", bn: "মোড" }, value: "3 (Heat/Vibration/Light)" },
            { label: { en: "Temperature", bn: "তাপমাত্রা" }, value: "40–50°C" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "2000 mAh" },
            { label: { en: "Size", bn: "সাইজ" }, value: "Adjustable (fits most)" },
        ],
        tags: ["knee", "massager", "heat therapy", "arthritis", "joint pain"],
    },

    {
        id: "back-heating-belt",
        name: { en: "Smart Back Heating Belt", bn: "স্মার্ট ব্যাক হিটিং বেল্ট" },
        category: "therapy",
        categoryName: { en: "Therapy & Mobility", bn: "থেরাপি ও গতিশীলতা" },
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600",
        price: 5200,
        rating: 4.4,
        reviewCount: 88,
        inStock: true,
        shortDesc: {
            en: "Far-infrared heated lumbar belt for back pain, muscle relaxation & posture support.",
            bn: "ফার-ইনফ্রারেড হিটেড কটিদেশীয় বেল্ট — পিঠের ব্যথা, পেশী শিথিলায়ন ও ভঙ্গি সমর্থনের জন্য।"
        },
        description: {
            en: "Far-infrared heated back belt with vibration massage for chronic lower back pain, sciatica, and muscle stiffness. Adjustable for all waist sizes.",
            bn: "দীর্ঘস্থায়ী পিঠের নিচের ব্যথা, সায়াটিকা এবং পেশী শক্তির জন্য ফার-ইনফ্রারেড হিটেড ব্যাক বেল্ট।"
        },
        features: [
            { en: "Far-infrared deep heat therapy", bn: "ফার-ইনফ্রারেড গভীর তাপ থেরাপি" },
            { en: "5 vibration massage modes", bn: "৫টি ভাইব্রেশন ম্যাসাজ মোড" },
            { en: "Adjustable waist strap 80–130cm", bn: "৮০–১৩০ সেমি সমন্বয়যোগ্য কোমর স্ট্র্যাপ" },
            { en: "Auto shut-off in 30 minutes", bn: "৩০ মিনিটে অটো শাট-অফ" },
        ],
        specs: [
            { label: { en: "Heat Zones", bn: "তাপ অঞ্চল" }, value: "3 zones" },
            { label: { en: "Temperature", bn: "তাপমাত্রা" }, value: "38–55°C" },
            { label: { en: "Power", bn: "পাওয়ার" }, value: "USB-C rechargeable" },
            { label: { en: "Waist", bn: "কোমর" }, value: "80–130 cm" },
        ],
        tags: ["back pain", "lumbar", "heat", "massage", "posture"],
    },

    {
        id: "walking-stick",
        name: { en: "Smart Walking Stick", bn: "স্মার্ট ওয়াকিং স্টিক" },
        category: "therapy",
        categoryName: { en: "Therapy & Mobility", bn: "থেরাপি ও গতিশীলতা" },
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
        price: 7500,
        rating: 4.6,
        reviewCount: 67,
        inStock: true,
        shortDesc: {
            en: "Foldable aluminium walking stick with LED light, SOS button & heart rate sensor.",
            bn: "ভাঁজযোগ্য অ্যালুমিনিয়াম ওয়াকিং স্টিক, LED লাইট, SOS বোতাম ও হার্ট রেট সেন্সর সহ।"
        },
        description: {
            en: "A technologically advanced foldable walking stick for elderly independence. Integrated LED torch, one-press SOS, and built-in heart rate monitor in the handle.",
            bn: "বয়স্কদের স্বাধীনতার জন্য প্রযুক্তিগতভাবে উন্নত ভাঁজযোগ্য ওয়াকিং স্টিক। LED টর্চ, এক-চাপ SOS এবং হাতলে বিল্ট-ইন হার্ট রেট মনিটর।"
        },
        features: [
            { en: "4-section adjustable height 85–95cm", bn: "৪-অংশ সমন্বয়যোগ্য উচ্চতা ৮৫–৯৫ সেমি" },
            { en: "Built-in LED flashlight", bn: "বিল্ট-ইন LED ফ্ল্যাশলাইট" },
            { en: "One-press SOS GPS alert", bn: "এক-চাপ SOS GPS এলার্ট" },
            { en: "Heart rate sensor on handle", bn: "হাতলে হার্ট রেট সেন্সর" },
        ],
        specs: [
            { label: { en: "Material", bn: "উপাদান" }, value: "Aluminium Alloy" },
            { label: { en: "Max Load", bn: "সর্বোচ্চ ভার" }, value: "100 kg" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "USB-C, 30 days" },
            { label: { en: "Weight", bn: "ওজন" }, value: "380g" },
        ],
        tags: ["walking stick", "cane", "elderly mobility", "fall prevention"],
    },

    {
        id: "shower-chair",
        name: { en: "Shower Chair", bn: "শাওয়ার চেয়ার" },
        category: "therapy",
        categoryName: { en: "Therapy & Mobility", bn: "থেরাপি ও গতিশীলতা" },
        image: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=600",
        price: 3800,
        rating: 4.3,
        reviewCount: 45,
        inStock: true,
        shortDesc: {
            en: "Anti-slip adjustable height shower chair with armrests for safe elderly bathing.",
            bn: "অ্যান্টি-স্লিপ সমন্বয়যোগ্য উচ্চতার শাওয়ার চেয়ার, আর্মরেস্ট সহ বয়স্কদের নিরাপদ গোসলের জন্য।"
        },
        description: {
            en: "Medical-grade shower chair with rubberized anti-slip legs, padded seat, removable armrests, and adjustable height. Supports up to 150 kg.",
            bn: "চিকিৎসা-গ্রেড শাওয়ার চেয়ার। রাবারযুক্ত অ্যান্টি-স্লিপ পা, প্যাডেড আসন, অপসারণযোগ্য আর্মরেস্ট এবং সমন্বয়যোগ্য উচ্চতা।"
        },
        features: [
            { en: "Anti-slip rubber feet", bn: "অ্যান্টি-স্লিপ রাবার পা" },
            { en: "150 kg weight capacity", bn: "১৫০ কেজি ওজন ক্ষমতা" },
            { en: "Height adjustable 40–50cm", bn: "উচ্চতা সমন্বয়যোগ্য ৪০–৫০ সেমি" },
            { en: "Removable armrests & backrest", bn: "অপসারণযোগ্য আর্মরেস্ট ও পিঠের হেলান" },
        ],
        specs: [
            { label: { en: "Material", bn: "উপাদান" }, value: "Aluminium Frame" },
            { label: { en: "Capacity", bn: "ক্ষমতা" }, value: "150 kg" },
            { label: { en: "Height", bn: "উচ্চতা" }, value: "40–50 cm" },
            { label: { en: "Weight", bn: "ওজন" }, value: "2.5 kg" },
        ],
        tags: ["shower chair", "bathroom safety", "elderly", "disability"],
    },

    {
        id: "light-therapy",
        name: { en: "Home-Based Light Therapy Machine", bn: "হোম বেইসড লাইট থেরাপি মেশিন" },
        category: "therapy",
        categoryName: { en: "Therapy & Mobility", bn: "থেরাপি ও গতিশীলতা" },
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600",
        price: 15000,
        discount: 5,
        rating: 4.5,
        reviewCount: 54,
        inStock: true,
        isNew: true,
        shortDesc: {
            en: "Multi-mode LED + TENS pain relief therapy panel for muscle & joint therapy at home.",
            bn: "মাল্টি-মোড LED + TENS ব্যথা উপশম থেরাপি প্যানেল — ঘরে পেশী ও জয়েন্ট থেরাপির জন্য।"
        },
        description: {
            en: "Professional-grade home therapy device combining red/infrared LED light therapy and TENS electrical stimulation for pain management, wound healing, and muscle recovery.",
            bn: "পেশাদার-গ্রেড হোম থেরাপি ডিভাইস। রেড/ইনফ্রারেড LED লাইট থেরাপি এবং টেনস ইলেকট্রিক্যাল স্টিমুলেশন একত্রে ব্যথা ব্যবস্থাপনা, ক্ষত নিরাময় এবং পেশী পুনরুদ্ধারের জন্য।"
        },
        features: [
            { en: "630nm Red + 850nm Near-infrared LEDs", bn: "৬৩০nm রেড + ৮৫০nm নিয়ার-ইনফ্রারেড LED" },
            { en: "TENS EMS muscle stimulation", bn: "টেনস EMS পেশী উদ্দীপনা" },
            { en: "Timer control 5–30 minutes", bn: "৫–৩০ মিনিট টাইমার কন্ট্রোল" },
            { en: "8 therapy programs for different needs", bn: "বিভিন্ন প্রয়োজনের জন্য ৮টি থেরাপি প্রোগ্রাম" },
        ],
        specs: [
            { label: { en: "Light Types", bn: "আলোর ধরন" }, value: "Red 630nm + NIR 850nm" },
            { label: { en: "Coverage", bn: "আবরণ" }, value: "30cm × 45cm panel" },
            { label: { en: "Power", bn: "পাওয়ার" }, value: "150W" },
            { label: { en: "Programs", bn: "প্রোগ্রাম" }, value: "8 auto programs" },
        ],
        tags: ["light therapy", "red light", "tens", "pain relief", "physiotherapy"],
    },

    // ── RESPIRATORY CARE ───────────────────────────────────────────

    {
        id: "smart-nebulizer",
        name: { en: "Smart Nebulizer", bn: "স্মার্ট নেবুলাইজার" },
        category: "respiratory",
        categoryName: { en: "Respiratory Care", bn: "শ্বাসযন্ত্রের যত্ন" },
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600",
        price: 4200,
        discount: 10,
        rating: 4.6,
        reviewCount: 134,
        inStock: true,
        shortDesc: {
            en: "Silent mesh nebulizer with 30μm particle size, rechargeable & app-connected.",
            bn: "সাইলেন্ট মেশ নেবুলাইজার, ৩০μm কণার আকার, রিচার্জেবল ও অ্যাপ-সংযুক্ত।"
        },
        description: {
            en: "Ultra-quiet mesh nebulizer ideal for asthma, COPD, and upper respiratory treatments. Portable, USB-rechargeable with smart session tracking app.",
            bn: "হাঁপানি, COPD এবং উপরের শ্বাসযন্ত্রের চিকিৎসার জন্য আদর্শ অতি-শান্ত মেশ নেবুলাইজার।"
        },
        features: [
            { en: "Vibrating mesh technology (silent ≤26dB)", bn: "ভাইব্রেটিং মেশ টেকনোলজি (সাইলেন্ট ≤২৬dB)" },
            { en: "30μm fine particle MMAD", bn: "৩০μm সূক্ষ্ম কণা MMAD" },
            { en: "App-track medication sessions", bn: "অ্যাপে ঔষধ সেশন ট্র্যাক" },
            { en: "USB-C rechargeable battery", bn: "USB-C রিচার্জেবল ব্যাটারি" },
        ],
        specs: [
            { label: { en: "Noise Level", bn: "শব্দ মাত্রা" }, value: "≤26 dB" },
            { label: { en: "Particle Size", bn: "কণার আকার" }, value: "30 μm MMAD" },
            { label: { en: "Drug Cup", bn: "ড্রাগ কাপ" }, value: "7 mL" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "2500 mAh" },
        ],
        tags: ["nebulizer", "asthma", "copd", "respiratory", "inhaler"],
    },

    {
        id: "smart-concentrator",
        name: { en: "Smart Oxygen Concentrator", bn: "স্মার্ট অক্সিজেন কনসেনট্রেটর" },
        category: "respiratory",
        categoryName: { en: "Respiratory Care", bn: "শ্বাসযন্ত্রের যত্ন" },
        image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&q=80&w=600",
        price: 45000,
        rating: 4.8,
        reviewCount: 42,
        inStock: true,
        isFeatured: true,
        shortDesc: {
            en: "5L/min home oxygen concentrator with real-time purity display, alarm & app monitoring.",
            bn: "৫ লি/মিনিট হোম অক্সিজেন কনসেনট্রেটর, রিয়েল-টাইম বিশুদ্ধতা ডিসপ্লে, এলার্ম ও অ্যাপ মনিটরিং।"
        },
        description: {
            en: "Medical-grade 5L home oxygen concentrator with 93±3% purity, low-noise operation, and smart alerts if purity drops. Remote monitoring via app for caregivers.",
            bn: "মেডিকেল-গ্রেড ৫ লিটার হোম অক্সিজেন কনসেনট্রেটর, ৯৩±৩% বিশুদ্ধতা, কম-শব্দ অপারেশন।"
        },
        features: [
            { en: "93±3% oxygen purity guaranteed", bn: "৯৩±৩% অক্সিজেন বিশুদ্ধতা নিশ্চিত" },
            { en: "Flow 1–5 L/min adjustable", bn: "প্রবাহ ১–৫ লি/মিনিট সমন্বয়যোগ্য" },
            { en: "Purity alarm if below 82%", bn: "৮২% এর নিচে হলে বিশুদ্ধতা এলার্ম" },
            { en: "Wi-Fi remote monitoring for caregivers", bn: "কেয়ারগিভারের জন্য Wi-Fi রিমোট মনিটরিং" },
        ],
        specs: [
            { label: { en: "Flow Rate", bn: "প্রবাহ হার" }, value: "1–5 L/min" },
            { label: { en: "Purity", bn: "বিশুদ্ধতা" }, value: "93 ± 3%" },
            { label: { en: "Noise", bn: "শব্দ" }, value: "≤45 dB" },
            { label: { en: "Power", bn: "পাওয়ার" }, value: "220V AC, 300W" },
        ],
        tags: ["oxygen", "concentrator", "copd", "respiratory", "home oxygen"],
    },

    {
        id: "cpap-machine",
        name: { en: "CPAP Machine", bn: "CPAP মেশিন" },
        category: "respiratory",
        categoryName: { en: "Respiratory Care", bn: "শ্বাসযন্ত্রের যত্ন" },
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600",
        price: 35000,
        rating: 4.7,
        reviewCount: 56,
        inStock: true,
        shortDesc: {
            en: "Auto CPAP with heated humidifier, sleep data app sync & ramp pressure feature.",
            bn: "অটো CPAP, হিটেড হিউমিডিফায়ার, ঘুমের ডেটা অ্যাপ সিঙ্ক ও র‍্যাম্প প্রেশার ফিচার সহ।"
        },
        description: {
            en: "Advanced Auto-CPAP therapy device with integrated heated humidifier for sleep apnea treatment. Intelligent pressure auto-adjustment and detailed compliance reporting.",
            bn: "স্লিপ অ্যাপনিয়া চিকিৎসার জন্য ইন্টিগ্রেটেড হিটেড হিউমিডিফায়ার সহ উন্নত অটো-CPAP থেরাপি ডিভাইস।"
        },
        features: [
            { en: "Auto-adjusting pressure 4–20 cmH₂O", bn: "অটো-সমন্বয় প্রেশার ৪–২০ cmH₂O" },
            { en: "Integrated heated humidifier", bn: "ইন্টিগ্রেটেড হিটেড হিউমিডিফায়ার" },
            { en: "Smart sleep data app sync", bn: "স্মার্ট ঘুমের ডেটা অ্যাপ সিঙ্ক" },
            { en: "Ramp feature for comfort start", bn: "কমফোর্ট স্টার্টের জন্য র‍্যাম্প ফিচার" },
        ],
        specs: [
            { label: { en: "Pressure Range", bn: "প্রেশার রেঞ্জ" }, value: "4–20 cmH₂O" },
            { label: { en: "Humidifier", bn: "হিউমিডিফায়ার" }, value: "Heated, 7 levels" },
            { label: { en: "Noise", bn: "শব্দ" }, value: "≤28 dB" },
            { label: { en: "Data", bn: "ডেটা" }, value: "12 months onboard" },
        ],
        tags: ["cpap", "sleep apnea", "snoring", "respiratory"],
    },

    // ── SMART HOME HEALTH ───────────────────────────────────────────

    {
        id: "smart-scale",
        name: { en: "Smart Body Scale", bn: "স্মার্ট বডি স্কেল" },
        category: "smart-home",
        categoryName: { en: "Smart Home Health", bn: "স্মার্ট হোম" },
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600",
        price: 3500,
        discount: 20,
        rating: 4.5,
        reviewCount: 178,
        inStock: true,
        shortDesc: {
            en: "17-metric smart scale with BMI, body fat, muscle mass & trending app sync.",
            bn: "১৭-মেট্রিক স্মার্ট স্কেল — BMI, বডি ফ্যাট, পেশীর ভর ও ট্রেন্ডিং অ্যাপ সিঙ্ক সহ।"
        },
        description: {
            en: "Professional-grade bioelectrical impedance smart scale measuring 17 body composition metrics. Supports unlimited user profiles, syncs trends to app, and detects pregnancy mode.",
            bn: "পেশাদার-গ্রেড বায়োইলেকট্রিক্যাল ইমপিডেন্স স্মার্ট স্কেল যা ১৭টি বডি কম্পোজিশন মেট্রিক্স পরিমাপ করে।"
        },
        features: [
            { en: "17 body metrics via BIA technology", bn: "BIA প্রযুক্তিতে ১৭টি বডি মেট্রিক্স" },
            { en: "Unlimited user profiles", bn: "সীমাহীন ব্যবহারকারী প্রোফাইল" },
            { en: "Bluetooth + Wi-Fi app sync", bn: "ব্লুটুথ + Wi-Fi অ্যাপ সিঙ্ক" },
            { en: "Pregnancy & athlete modes", bn: "গর্ভাবস্থা ও অ্যাথলেট মোড" },
        ],
        specs: [
            { label: { en: "Capacity", bn: "ক্ষমতা" }, value: "180 kg / 0.1 kg" },
            { label: { en: "Metrics", bn: "মেট্রিক্স" }, value: "17 body metrics" },
            { label: { en: "Technology", bn: "প্রযুক্তি" }, value: "BIA 8-electrode" },
            { label: { en: "Connectivity", bn: "সংযোগ" }, value: "BT 5.0 + Wi-Fi" },
        ],
        tags: ["scale", "weight", "bmi", "body fat", "smart scale"],
    },

    {
        id: "smart-pillbox",
        name: { en: "Smart Pill Box", bn: "স্মার্ট পিল বক্স" },
        category: "smart-home",
        categoryName: { en: "Smart Home Health", bn: "স্মার্ট হোম" },
        image: "https://images.unsplash.com/photo-1584308666744-24d5e45a557b?auto=format&fit=crop&q=80&w=600",
        price: 2800,
        rating: 4.4,
        reviewCount: 91,
        inStock: true,
        isNew: true,
        shortDesc: {
            en: "7-day automatic pill dispenser with alarm, missed dose alert & caregiver notification.",
            bn: "৭ দিনের স্বয়ংক্রিয় পিল ডিসপেন্সার, এলার্ম, মিসড ডোজ সতর্কতা ও কেয়ারগিভার বিজ্ঞপ্তি সহ।"
        },
        description: {
            en: "Smart automated pill box supporting up to 28 compartments (4×/day for 7 days) with audio alarm, missed-dose family notification via app.",
            bn: "স্মার্ট অটোমেটেড পিল বক্স, ২৮ কম্পার্টমেন্ট পর্যন্ত সমর্থন (৭ দিনের জন্য দিনে ৪ বার), অডিও এলার্ম, মিসড ডোজ পরিবার বিজ্ঞপ্তি।"
        },
        features: [
            { en: "28 compartments (7-day × 4 times/day)", bn: "২৮ কম্পার্টমেন্ট (৭ দিন × ৪ বার)" },
            { en: "Audible alarm + LED dose indicator", bn: "শ্রাব্য এলার্ম + LED ডোজ সূচক" },
            { en: "App reminder & compliance tracking", bn: "অ্যাপ রিমাইন্ডার ও কমপ্লায়েন্স ট্র্যাকিং" },
            { en: "Caregiver missed-dose SMS/app alert", bn: "কেয়ারগিভার মিসড ডোজ SMS/অ্যাপ এলার্ট" },
        ],
        specs: [
            { label: { en: "Compartments", bn: "কম্পার্টমেন্ট" }, value: "28 (4×/day, 7 days)" },
            { label: { en: "Alarm", bn: "এলার্ম" }, value: "Audible + LED" },
            { label: { en: "Connectivity", bn: "সংযোগ" }, value: "Bluetooth + Wi-Fi" },
            { label: { en: "Power", bn: "পাওয়ার" }, value: "USB-C / 4×AA" },
        ],
        tags: ["pillbox", "medication reminder", "elderly care", "smart dispenser"],
    },

    {
        id: "smart-hydration-bottle",
        name: { en: "Smart Hydration Bottle", bn: "স্মার্ট হাইড্রেশন বোতল" },
        category: "smart-home",
        categoryName: { en: "Smart Home Health", bn: "স্মার্ট হোম" },
        image: "https://images.unsplash.com/photo-1581236789895-c30c879e5168?auto=format&fit=crop&q=80&w=600",
        price: 2200,
        discount: 8,
        rating: 4.3,
        reviewCount: 73,
        inStock: true,
        shortDesc: {
            en: "550ml smart bottle tracking hydration, temperature display & drink reminder vibration.",
            bn: "৫৫০মিলি স্মার্ট বোতল — হাইড্রেশন ট্র্যাকিং, তাপমাত্রা ডিসপ্লে ও ড্রিংক রিমাইন্ডার ভাইব্রেশন সহ।"
        },
        description: {
            en: "A smart stainless steel water bottle with LED temperature display, daily hydration goal tracking, and gentle glow reminder to drink water on schedule.",
            bn: "স্মার্ট স্টেইনলেস স্টিল ওয়াটার বোতল, LED তাপমাত্রা ডিসপ্লে, দৈনিক হাইড্রেশন লক্ষ্য ট্র্যাকিং এবং সময়মতো পানি পান করার মৃদু গ্লো রিমাইন্ডার।"
        },
        features: [
            { en: "LED temperature display (°C/°F)", bn: "LED তাপমাত্রা ডিসপ্লে (°C/°F)" },
            { en: "Hydration goal tracking & reminders", bn: "হাইড্রেশন লক্ষ্য ট্র্যাকিং ও রিমাইন্ডার" },
            { en: "Bluetooth app sync", bn: "ব্লুটুথ অ্যাপ সিঙ্ক" },
            { en: "Double-wall vacuum insulation 12hr", bn: "ডাবল-ওয়াল ভ্যাকুয়াম ইনসুলেশন ১২ ঘণ্টা" },
        ],
        specs: [
            { label: { en: "Capacity", bn: "ক্ষমতা" }, value: "550 mL" },
            { label: { en: "Material", bn: "উপাদান" }, value: "18/8 Stainless Steel" },
            { label: { en: "Insulation", bn: "ইনসুলেশন" }, value: "Cold 24hr / Hot 12hr" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "Wireless charging" },
        ],
        tags: ["hydration", "water bottle", "smart bottle", "health"],
    },

    {
        id: "smart-temperature",
        name: { en: "Smart Temperature Sensor", bn: "স্মার্ট তাপমাত্রা সেন্সর" },
        category: "smart-home",
        categoryName: { en: "Smart Home Health", bn: "স্মার্ট হোম" },
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
        price: 1500,
        rating: 4.4,
        reviewCount: 67,
        inStock: true,
        isNew: true,
        shortDesc: {
            en: "Room & body temp/humidity sensor with comfort index alert & app history logging.",
            bn: "রুম ও বডি তাপমাত্রা/আর্দ্রতা সেন্সর, কমফোর্ট ইনডেক্স এলার্ট ও অ্যাপ হিস্ট্রি লগিং সহ।"
        },
        description: {
            en: "Dual-mode smart sensor monitoring room and body temperature with humidity index. Sends comfort alerts when temperature or humidity falls outside healthy range.",
            bn: "ডুয়াল-মোড স্মার্ট সেন্সর। রুম ও বডি তাপমাত্রা আর্দ্রতা সূচক সহ মনিটর করে এবং কমফোর্ট এলার্ট পাঠায়।"
        },
        features: [
            { en: "Room + body temperature measurement", bn: "রুম + বডি তাপমাত্রা পরিমাপ" },
            { en: "Humidity comfort index alert", bn: "আর্দ্রতা কমফোর্ট ইনডেক্স এলার্ট" },
            { en: "30-day historical data in app", bn: "অ্যাপে ৩০ দিনের ঐতিহাসিক ডেটা" },
            { en: "Works with Alexa & Google Home", bn: "Alexa ও Google Home এর সাথে কাজ করে" },
        ],
        specs: [
            { label: { en: "Temp Range", bn: "তাপ রেঞ্জ" }, value: "-10 to 60°C" },
            { label: { en: "Accuracy", bn: "নির্ভুলতা" }, value: "±0.3°C, ±3% RH" },
            { label: { en: "Connectivity", bn: "সংযোগ" }, value: "Zigbee / Wi-Fi" },
            { label: { en: "Battery", bn: "ব্যাটারি" }, value: "CR2032 (12 months)" },
        ],
        tags: ["temperature", "humidity", "smart home", "environment"],
    },
];
