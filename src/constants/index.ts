export interface NavLink {
    name: string;
    nameEn: string;
    href: string;
}

export const navLinks: NavLink[] = [
    { name: "হোম",             nameEn: "Home",           href: "#home" },
    { name: "আমাদের পরিচয়",    nameEn: "Who We Are",     href: "#about" },
    { name: "সেবাসমূহ",        nameEn: "Services",       href: "#services" },
    { name: "কিভাবে কাজ করি",  nameEn: "How It Works",   href: "#how-it-works" },
    { name: "কেন আমরা",        nameEn: "Why Choose Us",  href: "#why-choose-us" },
    { name: "রিভিউ",           nameEn: "Reviews",        href: "#testimonials" },
    { name: "যোগাযোগ",         nameEn: "Contact Us",     href: "#contact" },
];

// ───── Trust Banner ────────────────────────────────────────────────────────

export interface TrustItem {
    id: number;
    icon: string;
    number: string;
    enNumber: string;
    text: { bn: string; en: string };
    sub: { bn: string; en: string };
}

export const trustBannerData: TrustItem[] = [
    {
        id: 1,
        icon: "heart",
        number: "৫০০+",
        enNumber: "500+",
        text: { bn: "পরিবারের নির্ভরতা", en: "Families Trust Us" },
        sub: { bn: "যারা আমাদের ওপর আস্থা রেখেছেন", en: "Who rely on our care daily" }
    },
    {
        id: 2,
        icon: "shield-check",
        number: "১০০%",
        enNumber: "100%",
        text: { bn: "ভেরিফাইড স্টাফ", en: "Verified Caregivers" },
        sub: { bn: "পুলিশ ভেরিফাইড ও ট্রেইনড", en: "Police verified & trained" }
    },
    {
        id: 3,
        icon: "stethoscope",
        number: "৩০+",
        enNumber: "30+",
        text: { bn: "বিশেষজ্ঞ চিকিৎসক", en: "Specialist Doctors" },
        sub: { bn: "সার্বক্ষণিক মেডিকেল সাপোর্টে", en: "Round-the-clock medical support" }
    }
];

// ───── About Us ────────────────────────────────────────────────────────────

export const aboutData = {
    badge: { bn: "আমাদের ভাবনা", en: "Our Philosophy" },
    tagline: { 
        bn: "আপনার প্রিয়জন থাকুন আমাদের বিশ্বস্ত ও আন্তরিক যত্নে।", 
        en: "Your loved ones are in our trusted and attentive care." 
    },
    vision: {
        title: { bn: "ভিশন", en: "Vision" },
        text: { bn: "বাংলাদেশে বয়স্ক বাবা–মা ও প্রিয়জনদের জন্য নিরাপদ, সম্মানজনক ও মানবিক যত্ন নিশ্চিত করে একটি বিশ্বস্ত ও নির্ভরযোগ্য কেয়ারগিভিং সেবার মানদণ্ড প্রতিষ্ঠা করা।", en: "To establish a trusted and reliable caregiving standard by ensuring safe, respectful, and humane care for elderly parents in Bangladesh." }
    },
    mission: {
        title: { bn: "মিশন", en: "Mission" },
        text: { bn: "প্রশিক্ষিত কেয়ারগিভার, পেশাদার স্বাস্থ্যসেবা সমন্বয়, প্রযুক্তিনির্ভর যোগাযোগ এবং মানবিক সহায়তার মাধ্যমে বয়স্ক প্রিয়জনদের নিরাপদ ও সম্মানজনক জীবনযাপন নিশ্চিত করা এবং পরিবারকে নিশ্চিন্ততা প্রদান করা।", en: "To ensure a safe and dignified life for elderly loved ones through trained caregivers, healthcare coordination, and humane support." }
    },
    philosophyParagraphs: [
        {
            bn: "জীবন ও জীবিকার প্রয়োজনে আজ অনেকেই দেশ ছেড়ে বিদেশে, অথবা নিজের শহর থেকে দূরে অন্য কোথাও বসবাস করছেন। চাইলেও তাদের প্রয়োজনে সবসময় পাশে থাকা সম্ভব হয় না। তাই দূরে থেকে সবসময় চিন্তা আবর্তিত হয় বাবা-মা ও প্রিয়জনদের কেন্দ্র করে। বয়স্ক বাবা–মা এবং প্রিয়জনেরা ঠিক আছেন তো? তাদের প্রয়োজনীয় গুরুত্বপূর্ণ সেবা গুলো ঠিক মতো পাচ্ছেন কি? মনে,কেউ যদি থাকতো তাদের কাছে প্রয়োজনীয় সেবাগুলো যত্ন নিয়ে পৌঁছে দিতো! এই ভাবনা, দায়বদ্ধতা এবং জীবন বাস্তবতার অনুভূতি থেকেই নির্ভার কেয়ার–এর যাত্রা শুরু। নির্ভার কেয়ার এমন একটি সেবা, যেখানে আমরা শুধু দায়িত্ব পালন করি না, আমরা মানুষের পাশে দাঁড়াই। বাংলাদেশে বসবাসরত বয়স্ক বাবা–মা এবং প্রিয়জনদের জন্য আমরা নিশ্চিত করি নিরাপদ, সম্মানজনক এবং আন্তরিক সহায়তা, যেন তারা কখনোই একাকী, অসহায় ও অবহেলিত অনুভব সামাজিক অনুভব না করেন।",
            en: "Driven by the necessities of life and career, many today live abroad or far from their hometowns. Even with the desire, it is not always possible to be by their side when needed. Therefore, from afar, thoughts constantly revolve around parents and loved ones. Are they okay? Are they properly receiving the important services they need? The thought arises—if only someone were there to carefully deliver the necessary services to them!"
        },
        {
            bn: "আমাদের প্রদত্ত সেবার মাধ্যমে আমরা বয়োবৃদ্ধ বাবা–মা ও প্রিয়জনদের জন্য চিকিৎসা সংক্রান্ত সেবা গুলোর সমন্বয় করি থাকি। ডাক্তার ও হাসপাতাল ভিজিটের ব্যবস্থা করা সহ প্রয়োজনে ঘরে বসেই মেডিকেল টেস্ট ও রিপোর্ট ব্যবস্থাপনা নিশ্চিতকরণ করা হয়। পাশাপাশি প্রশিক্ষিত কেয়ারগিভার ও নার্সিং সেবার ব্যবস্থা প্রদান। প্রয়োজনে অ্যাটেনডেন্ট সহায়তা প্রদান করা হয়। প্রযুক্তির সঠিক ব্যবহার করে পরিবারের সদস্যদের স্বচ্ছ ও নিয়মিত আপডেট প্রদান করা এই প্রদত্ত সেবার অন্যতম বৈশিষ্ট্য। যেকোনো জরুরি পরিস্থিতিতে আমরা দ্রুত ও সমন্বিতভাবে প্রয়োজনীয় সেবা সহায়তা নিশ্চিত করতে সবসময় পাশে আছি।",
            en: "Through our provided services, we coordinate medical-related services for elderly parents and loved ones. This includes arranging doctor and hospital visits, and if needed, ensuring home-based medical test and report management. Alongside, we provide trained caregiver and nursing services... In any emergency situation, we are always by your side to quickly and cohesively ensure necessary service support."
        },
        {
            bn: "নির্ভার কেয়ার পরিচালিত হয় অভিজ্ঞ পেশাজীবীদের একটি দল এবং সম্মানিত চিকিৎসকদের পরামর্শে। আমরা পেশাদারীত্ব ও দক্ষতার সাথে মানবিক যত্নসমূহকে একত্রিত করি—কারণ আমরা বিশ্বাস করি, যত্ন শুধু একটি সেবা নয়, এটি একটি সম্পর্ক।",
            en: "Nirvaar Care is operated by a team of experienced professionals and guided by respected physicians. We integrate humane care with professionalism and efficiency—because we believe care is not just a service, it is a relationship."
        },
        {
            bn: "আপনি পৃথিবীর যেখানেই থাকুন বিদেশে, অন্য শহরে বা ব্যস্ত জীবনের মাঝে, নির্ভার কেয়ার নিশ্চিত করে আপনার প্রিয় মানুষরা সঠিক সময়ে সঠিক যত্ন পাচ্ছেন। কারণ আমাদের কাছে তারা শুধু একজন সেবাগ্রহীতা নন, তারা পরিবার। তাই নিশ্চিন্ত থাকুন, আপনার প্রিয়জনেরা আছেন নিরাপদে, আন্তরিক যত্নে, এবং কখনোই একা নন।",
            en: "Wherever you are in the world—abroad, in another city, or amidst a busy life—Nirvaar Care ensures your loved ones receive the right care at the right time. Because to us, they are not just clients, they are family. So rest assured, your loved ones are safe, in attentive care, and never alone."
        }
    ],
    image1: "/images/hero/mental-wellness.jpg",
    image2: "/images/hero/diagnostic-service.jpg",
    yearsExperience: { bn: "৫+", en: "5+" },
    experienceText: { bn: "বছরের অভিজ্ঞতা", en: "Years of Trust" }
};

// ───── Our Services ────────────────────────────────────────────────────────

export const servicesData = {
    badge: { bn: "আমাদের সেবাসমূহ", en: "Our Services" },
    title: { bn: "আপনার প্রিয়জনের জন্য আমাদের বিশেষায়িত সেবা", en: "Specialized Care for Your Loved Ones" },
    items: [
        {
            id: 1,
            icon: "Activity",
            title: { bn: "ডায়াগনস্টিক ও মেডিকেল পরীক্ষা সংক্রান্ত সেবা", en: "Diagnostic & Medical Test Support Services" },
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
            description: { 
                bn: "ঘরে বসেই প্রয়োজনীয় গুরুত্বপূর্ণ মেডিকেল পরীক্ষা করার সহায়তা।", 
                en: "Assistance in arranging important medical tests from the comfort of home when possible." 
            },
            extended: {
                videoUrl: "",
                tagline: { bn: "আপনার স্বাস্থ্য আমাদের দায়িত্ব", en: "Your health is our responsibility" },
                benefits: [
                    { icon: "home", bn: "ঘরে বসেই প্রয়োজনীয় গুরুত্বপূর্ণ মেডিকেল পরীক্ষা করার সহায়তা।", en: "Assistance in arranging important medical tests from the comfort of home when possible." },
                    { icon: "search", bn: "প্রয়োজন অনুযায়ী উপযুক্ত ডায়াগনস্টিক সেন্টার নির্ধারণ ও সময় নির্ধারণে সহায়তা।", en: "Support in selecting suitable diagnostic centers and scheduling appointments as needed." },
                    { icon: "escort", bn: "ডায়াগনস্টিক সেন্টারে নেওয়া আনার ব্যবস্থা এবং পরীক্ষার পুরো প্রক্রিয়ায় নির্ভরযোগ্য অ্যাটেনডেন্টের তত্ত্বাবধান ও সহায়তা প্রদান।", en: "Arrangement of transportation to and from diagnostic centers, along with supervision by a reliable attendant throughout the process." },
                    { icon: "file", bn: "পরীক্ষার রিপোর্ট সংগ্রহ করে পৌঁছে দেওয়া এবং প্রয়োজনে ডক্টরের পরামর্শ গ্রহনে সহায়তা।", en: "Collection and delivery of medical reports, and assistance in consulting doctors if required." }
                ],
                steps: []
            }
        },
        {
            id: 2,
            icon: "Stethoscope",
            title: { bn: "চিকিৎসক সম্পর্কিত সেবা", en: "Doctor Consultation Support Services" },
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
            description: { 
                bn: "রোগের ধরন অনুযায়ী উপযুক্ত চিকিৎসক নির্বাচন করতে সহায়তা।", 
                en: "Assistance in selecting appropriate doctors based on the patient’s condition." 
            },
            extended: {
                videoUrl: "",
                tagline: { bn: "সেরা চিকিৎসকের পরামর্শ", en: "The best medical advice" },
                benefits: [
                    { icon: "search", bn: "রোগের ধরন অনুযায়ী উপযুক্ত চিকিৎসক নির্বাচন করতে সহায়তা।", en: "Assistance in selecting appropriate doctors based on the patient’s condition." },
                    { icon: "calendar", bn: "চিকিৎসকের সাথে সরাসরি সাক্ষাতের সময় (অ্যাপয়েন্টমেন্ট) নির্ধারণে সহায়তা।", en: "Help in scheduling appointments with doctors." },
                    { icon: "escort", bn: "চিকিৎসকের কাছে যাতায়াত থেকে চিকিৎসা গ্রহণ পর্যন্ত পুরো প্রক্রিয়ায় সার্বিক সহযোগিতা নিশ্চিত করা।", en: "End-to-end support throughout the consultation process, including transportation arrangements if needed." },
                    { icon: "video", bn: "ঘরে বসেই অনলাইন বা ভিডিও কনফারেন্সের মাধ্যমে চিকিৎসকের পরামর্শ গ্রহণ।", en: "Assistance in arranging online or video consultations from home." },
                    { icon: "car", bn: "প্রয়োজন অনুযায়ী চিকিৎসকের কাছে যাতায়াতের জন্য পরিবহন ব্যবস্থায় সহায়তা প্রদান।", en: "Coordination of transportation to visit doctors when required." },
                    { icon: "user", bn: "চিকিৎসকের পরামর্শ গ্রহণের পুরো প্রক্রিয়ায় সমন্বয় ও ব্যবস্থাপনার জন্য একজন সহযোগি প্রদান।", en: "Providing a dedicated assistant to coordinate the entire consultation process." }
                ],
                steps: []
            }
        },
        {
            id: 3,
            icon: "Pill",
            title: { bn: "ঔষধ সংক্রান্ত সেবা", en: "Medication Support Services" },
            image: "https://images.unsplash.com/photo-1584308666744-24d5e45a557b?auto=format&fit=crop&q=80&w=800",
            description: { 
                bn: "প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় ঔষধের চাহিদা নির্ধারণে সহায়তা।", 
                en: "Assistance in identifying required medications based on prescriptions." 
            },
            extended: {
                videoUrl: "",
                tagline: { bn: "সঠিক ঔষধ, সঠিক সময়ে", en: "The right medicine, on time" },
                benefits: [
                    { icon: "file", bn: "প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় ঔষধের চাহিদা নির্ধারণে সহায়তা।", en: "Assistance in identifying required medications based on prescriptions." },
                    { icon: "delivery", bn: "নির্ভরযোগ্য ফার্মেসি থেকে প্রয়োজনীয় ঔষধ সংগ্রহ এবং দ্রুততম সময়ে আপনার ঠিকানায় পৌঁছে দেওয়ার সুব্যবস্থা।", en: "Collection of medicines from reliable pharmacies and timely delivery to the patient’s address." },
                    { icon: "clock", bn: "প্রেসক্রিপশন অনুযায়ী সঠিক নিয়মে ঔষধ সেবন নিশ্চিতকরণে নিয়মিত পর্যবেক্ষণ সহায়তা।", en: "Support in ensuring medications are taken correctly according to prescription guidelines." },
                    { icon: "phone", bn: "প্রয়োজনে চিকিৎসকের সাথে যোগাযোগ করে ঔষধ সংক্রান্ত পরামর্শ বা পরিবর্তনের সমন্বয় করা।", en: "Coordination with doctors when medication adjustments or advice are needed." }
                ],
                steps: []
            }
        },
        {
            id: 4,
            icon: "Ambulance",
            title: { bn: "জরুরি পরিস্থিতি সংক্রান্ত সেবা", en: "Emergency Support Services" },
            image: "https://images.unsplash.com/photo-1587559070757-f72a388edbba?auto=format&fit=crop&q=80&w=800",
            description: { 
                bn: "জরুরি পরিস্থিতিতে রোগীর অবস্থা মূল্যায়ন করে দ্রুত প্রয়োজনীয় সহায়তা ও সমন্বয়ের ব্যবস্থা করা।", 
                en: "Assessment of patient condition in emergency situations and arrangement of immediate assistance." 
            },
            extended: {
                videoUrl: "",
                tagline: { bn: "সংকটের মুহূর্তে আপনার প্রথম ভরসা", en: "Your first call in a crisis" },
                benefits: [
                    { icon: "activity", bn: "জরুরি পরিস্থিতিতে রোগীর অবস্থা মূল্যায়ন করে দ্রুত প্রয়োজনীয় সহায়তা ও সমন্বয়ের ব্যবস্থা করা।", en: "Assessment of patient condition in emergency situations and arrangement of immediate assistance." },
                    { icon: "ambulance", bn: "প্রয়োজন অনুযায়ী দ্রুত অ্যাম্বুলেন্সের ব্যবস্থা করা।", en: "Arrangement of ambulance services when required." },
                    { icon: "escort", bn: "রোগীকে দ্রুত ও নিরাপদে হাসপাতালে নিয়ে যাওয়ার জন্য প্রয়োজনীয় সহায়তা প্রদান।", en: "Support in safely transporting the patient to hospital." },
                    { icon: "file", bn: "হাসপাতালে দ্রুত ভর্তি প্রক্রিয়ায় সহায়তা করা।", en: "Assistance with hospital admission procedures." },
                    { icon: "users", bn: "জরুরি চিকিৎসা সেবার পুরো প্রক্রিয়ায় সার্বিক তত্ত্বাবধান ও সমন্বয় করা।", en: "Overall coordination and supervision throughout emergency treatment processes." },
                    { icon: "user", bn: "রোগীর প্রয়োজন অনুযায়ী অ্যাটেনডেন্ট সেবা প্রদান করা।", en: "Provision of attendant support when needed." },
                    { icon: "phone", bn: "রোগীর পরিবারের সদস্যদের প্রয়োজনীয় তথ্য ও রোগীর বর্তমান অবস্থা সম্পর্কে নিয়মিত অবহিতকরন সেবা।", en: "Regular updates to family members regarding the patient’s condition." }
                ],
                steps: []
            }
        },
        {
            id: 5,
            icon: "ShoppingBag",
            title: { bn: "দৈনন্দিন প্রয়োজন-সংক্রান্ত সেবা", en: "Daily Living Assistance Services" },
            image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80&w=800",
            description: { 
                bn: "দৈনন্দিন প্রয়োজনীয় বাজার বা কেনাকাটা করতে সহায়তা প্রদান।", 
                en: "Assistance with daily shopping or necessary purchases." 
            },
            extended: {
                videoUrl: "",
                tagline: { bn: "আপনার দৈনন্দিন প্রয়োজনে সঙ্গী", en: "A companion for your daily needs" },
                benefits: [
                    { icon: "shopping", bn: "দৈনন্দিন প্রয়োজনীয় বাজার বা কেনাকাটা করতে সহায়তা প্রদান।", en: "Assistance with daily shopping or necessary purchases." },
                    { icon: "home", bn: "আত্মীয়-স্বজনের বাড়ি বা পরিচিতদের কাছে যাতায়াতের জন্য সহায়তা করা।", en: "Support for visiting relatives or acquaintances when required." },
                    { icon: "car", bn: "মার্কেট, শপিং মল বা অন্যান্য প্রয়োজনীয় স্থানে যাতায়াতের ব্যবস্থা করা।", en: "Arrangement of transportation to markets, shopping malls, or other necessary places." },
                    { icon: "building", bn: "ব্যাংক, আর্থিক প্রতিষ্ঠান বা প্রয়োজনীয় অফিসে যাওয়ার জন্য সহায়তা প্রদান।", en: "Assistance with visits to banks, financial institutions, or important offices." },
                    { icon: "shield", bn: "নিরাপদ যাতায়াতের জন্য প্রয়োজন অনুযায়ী পরিবহনের ব্যবস্থা করা।", en: "Arrangement of safe transportation as needed." },
                    { icon: "user", bn: "প্রয়োজনে সার্বিক সহযোগিতা ও তত্ত্বাবধানে আন্তরিক ও নির্ভরযোগ্য অ্যাটেনডেন্ট সেবা প্রদান।", en: "Providing reliable attendants for daily support and supervision when required." }
                ],
                steps: []
            }
        },
        {
            id: 6,
            icon: "HeartHandshake",
            title: { bn: "মানসিক সঙ্গ ও সুস্থতা সংক্রান্ত সেবা", en: "Emotional Companionship & Well-being Support" },
            image: "https://images.unsplash.com/photo-1529156069898-49953eb1f5ce?auto=format&fit=crop&q=80&w=800",
            description: { 
                bn: "রোগী বা প্রবীণ ব্যক্তির সাথে সময় কাটানো, সঙ্গ দেওয়া ও গল্প করা।", 
                en: "Spending quality time with elderly individuals or patients, offering companionship and conversation." 
            },
            extended: {
                videoUrl: "",
                tagline: { bn: "মানসিক প্রফুল্লতার জন্য একজন বন্ধু", en: "A friend for emotional well-being" },
                benefits: [
                    { icon: "heart", bn: "রোগী বা প্রবীণ ব্যক্তির সাথে সময় কাটানো, সঙ্গ দেওয়া ও গল্প করা।", en: "Spending quality time with elderly individuals or patients, offering companionship and conversation." },
                    { icon: "book", bn: "বই, পত্রিকা বা অন্যান্য পড়ার উপকরণ পড়ে শোনানো।", en: "Reading books, newspapers, or other materials aloud when needed." },
                    { icon: "users", bn: "প্রয়োজনে কাউন্সেলিং বা মানসিক সহায়তার ব্যবস্থা করা।", en: "Arranging counseling or emotional support services if required." },
                    { icon: "sun", bn: "নিয়মিত আন্তরিক আলাপচারিতা ও সহায়ক কার্যক্রমের মাধ্যমে একাকীত্ব কমানো এবং মানসিক স্বস্তি ও প্রফুল্লতা বজায় রাখতে সহায়তা।", en: "Helping reduce loneliness through regular communication and supportive engagement, promoting emotional comfort and positivity." }
                ],
                steps: []
            }
        }
    ]
};

// ───── How It Works (Process Steps) ────────────────────────────────────────

export const processData = {
    badge: { bn: "আমাদের কাজের ধাপ", en: "How It Works" },
    title: { bn: "মাত্র ৪টি সহজ ধাপে আমাদের সেবা গ্রহণ করুন", en: "Get Our Care in 4 Simple Steps" },
    steps: [
        {
            id: 1,
            icon: "PhoneCall",
            title: { bn: "যোগাযোগ ও আলোচনা", en: "Contact & Consult" },
            description: { 
                bn: "আমাদের হেল্পলাইনে কল করুন এবং আপনার রোগীর বর্তমান সার্বিক অবস্থা ও প্রয়োজনীয়তা নিয়ে বিস্তারিত আলোচনা করুন।", 
                en: "Call our helpline and discuss your patient's current overall condition and requirements in detail." 
            }
        },
        {
            id: 2,
            icon: "ClipboardCheck",
            title: { bn: "সমস্যা মূল্যায়ন (Assessment)", en: "Patient Assessment" },
            description: { 
                bn: "আমাদের বিশেষজ্ঞ দল রোগীর শারীরিক ও মানসিক অবস্থা যাচাই করে সঠিক সেবার পরিধি নির্ধারণ করবেন।", 
                en: "Our expert team will evaluate the patient's physical and mental state to determine the scope of care." 
            }
        },
        {
            id: 3,
            icon: "FileEdit",
            title: { bn: "কাস্টম কেয়ার প্ল্যান", en: "Custom Care Plan" },
            description: { 
                bn: "মূল্যায়নের ওপর ভিত্তি করে সম্পূর্ণ কাস্টমাইজড একটি কেয়ার প্ল্যান ও সঠিক কেয়ারগিভার নির্বাচন করা হবে।", 
                en: "A fully customized care plan will be created and the right caregiver will be selected based on the assessment." 
            }
        },
        {
            id: 4,
            icon: "HeartHandshake",
            title: { bn: "নিশ্চিন্ত সেবা শুরু", en: "Care Starts" },
            description: { 
                bn: "আমাদের ডেডিকেটেড কেয়ারগিভার কাজ শুরু করবেন এবং আমরা নিয়মিত সেবার মান পর্যবেক্ষণ ও সমন্বয় করব।", 
                en: "Our dedicated caregiver begins their work, and we continuously monitor and coordinate the quality of care." 
            }
        }
    ]
};

// ───── Why Choose Us ───────────────────────────────────────────────────────

export const whyChooseData = {
    badge: { bn: "আমরা যেমন", en: "Our Promise" },
    title: { bn: "আপনার প্রিয়জনের নিরাপত্তা আমাদের প্রতিশ্রুতি", en: "Caring Hands You Can Trust" },
    subtitle: { 
        bn: "", 
        en: "" 
    },
    listTitle: { bn: "যেসব বিষয়ে আমরা সর্বোচ্চ গুরুত্ব দিয়ে থাকি", en: "What We Prioritize" },
    features: [
        {
            id: 1,
            icon: "ShieldCheck",
            image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800",
            title: { bn: "যাচাইকৃত ও দায়িত্বশীল কেয়ারগিভার", en: "Careful selection of verified and responsible caregivers" },
            description: { bn: "", en: "" }
        },
        {
            id: 2,
            icon: "ActivityPulse",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
            title: { bn: "প্রয়োজন অনুযায়ী প্রশিক্ষণ ও দক্ষতা", en: "Ensuring necessary training and practical caregiving skills" },
            description: { bn: "", en: "" }
        },
        {
            id: 3,
            icon: "Eye",
            image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800",
            title: { bn: "ভদ্র, সহানুভূতিশীল ও সম্মানজনক আচরণ", en: "Polite, respectful, and compassionate behavior" },
            description: { bn: "", en: "" }
        },
        {
            id: 4,
            icon: "Clock",
            image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800",
            title: { bn: "পরিবারের সাথে স্বচ্ছ যোগাযোগ", en: "Transparent and regular communication with family members" },
            description: { bn: "", en: "" }
        },
        {
            id: 5,
            icon: "Heart",
            image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800",
            title: { bn: "নিরাপত্তা, মর্যাদা ও গোপনীয়তা রক্ষা", en: "Protection of the patient’s safety, dignity, and privacy" },
            description: { bn: "", en: "" }
        },
        {
            id: 6,
            icon: "Activity",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
            title: { bn: "প্রয়োজন হলে দ্রুত সহায়তা ও পরিবর্তনের ব্যবস্থা", en: "Quick coordination and assistance in emergency situations" },
            description: { bn: "", en: "" }
        }
    ]
};

// ───── Emergency CTA ───────────────────────────────────────────────────────

export const emergencyCtaData = {
    title: { bn: "জরুরি মেডিকেল সহায়তা প্রয়োজন?", en: "Need Immediate Medical Assistance?" },
    description: { 
        bn: "আমাদের ইমার্জেন্সি রেসপন্স টিম ২৪/৭ প্রস্তুত। অ্যাম্বুলেন্স, অক্সিজেন বা জরুরি নার্সিং সেবার জন্য এখনই কল করুন।", 
        en: "Our emergency response team is available 24/7. Call us now for ambulance, oxygen, or urgent nursing care." 
    },
    buttonText: { bn: "কল করুন: +৮৮০ ০১৭১৫-৫৯৯ ৫৯৯", en: "Call Now: 01715-599599" },
    phone: "+8801715599599"
};

// ───── Footer ──────────────────────────────────────────────────────────────

export const footerData = {
    brandDesc: {
        bn: "নির্ভার কেয়ার আপনার এবং আপনার পরিবারের স্বাস্থ্য সুরক্ষায় প্রতিশ্রুতিবদ্ধ। আমাদের ২৪/৭ সেবার মাধ্যমে নিশ্চিন্তে থাকুন।",
        en: "Nirvaar Care is committed to the health and safety of you and your family. Stay worry-free with our 24/7 services."
    },
    quickLinks: {
        title: { bn: "প্রয়োজনীয় লিংক", en: "Quick Links" },
        links: [
            { bn: "আমাদের সেবাসমূহ", en: "Our Services", href: "#services" },
            { bn: "কীভাবে কাজ করে", en: "How It Works", href: "#how-it-works" },
            { bn: "কেন আমাদের বেছে নেবেন", en: "Why Choose Us", href: "#why-choose-us" },
            { bn: "যোগাযোগ", en: "Contact Us", href: "#contact" },
        ]
    },
    contactInfo: {
        title: { bn: "যোগাযোগ", en: "Contact Info" },
        items: [
            { icon: "Phone", text: "01715-599599" },
            { icon: "Mail", text: "support@nirvaarcare.com" },
            { icon: "MapPin", text: { bn: "গুলশান ১, ঢাকা, বাংলাদেশ", en: "Gulshan 1, Dhaka, Bangladesh" } },
        ]
    },
    copyright: {
        bn: "© ২০২৬ নির্ভার কেয়ার। সর্বস্বত্ব সংরক্ষিত।",
        en: "© 2026 Nirvaar Care. All rights reserved."
    }
};

// ───── Testimonials ────────────────────────────────────────────────────────

export const testimonialData = {
    badge: { bn: "গ্রাহকদের মতামত", en: "Client Stories" },
    title: { bn: "আমাদের সেবায় যারা আস্থা রেখেছেন", en: "What Our Clients Say About Us" },
    items: [
        {
            id: 1,
            name: { bn: "রহমান ফ্যামিলি", en: "The Rahman Family" },
            role: { bn: "ঢাকা, বাংলাদেশ", en: "Dhaka, Bangladesh" },
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
            quote: {
                bn: "নির্ভার কেয়ারের নার্সিং সেবা সত্যিই অসাধারণ। আমার বাবার স্ট্রোকের পর তারা যেভাবে যত্ন নিয়েছে, তা ভাষায় প্রকাশ করার মতো নয়। তাদের কেয়ারগিভাররা খুবই আন্তরিক।",
                en: "Nirvaar Care's nursing service is truly exceptional. The way they took care of my father after his stroke is beyond words. Their caregivers are highly sincere."
            },
            rating: 5
        },
        {
            id: 2,
            name: { bn: "ফাতেমা আক্তার", en: "Fatema Akter" },
            role: { bn: "প্রবাসী বাংলাদেশি, ইউকে", en: "Expat, UK" },
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
            quote: {
                bn: "বিদেশে থেকে মায়ের অসুস্থতা নিয়ে খুব চিন্তায় ছিলাম। নির্ভার কেয়ারের সার্বক্ষণিক আপডেট এবং ডাক্তারের সাপোর্ট আমাকে পুরোপুরি নিশ্চিন্ত করেছে। অনেক ধন্যবাদ!",
                en: "Being abroad, I was very worried about my mother's illness. Nirvaar Care's constant updates and doctor support gave me complete peace of mind. Thank you!"
            },
            rating: 5
        },
        {
            id: 3,
            name: { bn: "শফিকুল ইসলাম", en: "Shafiqul Islam" },
            role: { bn: "চট্টগ্রাম, বাংলাদেশ", en: "Chattogram, Bangladesh" },
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
            quote: {
                bn: "জরুরি মুহূর্তে মাত্র ৩০ মিনিটের মধ্যে তাদের অ্যাম্বুলেন্স এবং মেডিকেল টিম আমাদের বাসায় পৌঁছেছিল। তাদের প্রফেশনালিজম সত্যিই প্রশংসার দাবিদার।",
                en: "During an emergency, their ambulance and medical team reached our home in just 30 minutes. Their professionalism genuinely deserves praise."
            },
            rating: 5
        }
    ]
};

// ───── Hero Slider ─────────────────────────────────────────────────────────

export interface HeroSlide {
    id:       number;
    imageBg:  string;
    gradient: string;
    badge:    { bn: string; en: string };
    trust:    { bn: string; en: string };
    headline: { bn: string; en: string };
    sub:      { bn: string; en: string };
    primaryCTA:   { bn: string; en: string; href: string };
    secondaryCTA: { bn: string; en: string; href: string };
}

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        imageBg: "/images/hero/diagnostic-service.jpg",
        gradient: "from-emerald-950/90 via-emerald-900/60 to-transparent",
        badge:    { bn: "ডায়াগনস্টিক সাপোর্ট", en: "Diagnostic Support" },
        trust:    { bn: "✓ ভেরিফাইড কেয়ারগিভার · সার্বক্ষণিক আপডেট", en: "✓ Verified Caregivers · Real-time Updates" },
        headline: { bn: "হাসপাতালের লম্বা লাইন নয়—\nআপনার প্রিয়জন প্রথম অগ্রাধিকার।", en: "Not just hospital runs—\nwe stand by them at every step." },
        sub:      { bn: "ডাক্তারের সিরিয়াল থেকে শুরু করে টেস্ট করানো—আমাদের কেয়ারগিভার শারীরিক উপস্থিতিতে ভরসা জোগাবে প্রতিটি ধাপে।", en: "From booking appointments to guiding them through tests, our dedicated caregivers provide physical presence and reassurance." },
        primaryCTA:   { bn: "সহায়তা নিন", en: "Get Support", href: "#book-test"  },
        secondaryCTA: { bn: "আমাদের প্রক্রিয়া", en: "Our Process",    href: "#services"  },
    },
    {
        id: 2,
        imageBg: "/images/hero/doctor-service.jpg",
        gradient: "from-teal-950/90 via-teal-900/60 to-transparent",
        badge:    { bn: "চিকিৎসক সেবা", en: "Doctor Services" },
        trust:    { bn: "🩺 শীর্ষস্থানীয় চিকিৎসকদের নেটওয়ার্ক", en: "🩺 Network of Top Specialists" },
        headline: { bn: "সঠিক চিকিৎসকের পরামর্শ,\nবিনা দুশ্চিন্তায়।", en: "The right medical advice,\nwithout the anxiety." },
        sub:      { bn: "সেরা চিকিৎসকদের অ্যাপয়েন্টমেন্ট নেওয়া কিংবা ভিডিও কলে কথা বলা—বয়স্কদের জন্য প্রযুক্তির বাধা দূর করছি আমরা।", en: "Whether scheduling in-person visits or assisting with video consultations, we bridge the technology gap for the elderly." },
        primaryCTA:   { bn: "ডাক্তার খুঁজুন", en: "Find a Doctor",      href: "#book-doctor"  },
        secondaryCTA: { bn: "পরামর্শ নিন",    en: "Consult Now", href: "#consultation" },
    },
    {
        id: 3,
        imageBg: "/images/hero/medicine-service.jpg",
        gradient: "from-cyan-950/90 via-cyan-900/60 to-transparent",
        badge:    { bn: "ঔষধ ব্যবস্থাপনা", en: "Medicine Management" },
        trust:    { bn: "💊 সঠিক ঔষধ · রেগুলার ফলোআপ", en: "💊 Authentic Medicine · Regular Follow-up" },
        headline: { bn: "সঠিক ঔষধ, সঠিক সময়ে—\nনিয়মিত সেবনের নিশ্চয়তা।", en: "The right medicine on time—\nwith guaranteed adherence." },
        sub:      { bn: "শুধু ঔষধ পৌঁছে দেওয়াই নয়, বরং প্রেসক্রিপশন অনুযায়ী তারা ঠিকমতো ঔষধ খাচ্ছেন কি না—তার দৈনন্দিন মনিটরিং আমাদের দায়িত্ব।", en: "Beyond just delivering prescriptions, we actively monitor their daily intake so you never have to worry about missed doses." },
        primaryCTA:   { bn: "ঔষধ অর্ডার করুন",   en: "Order Medicine", href: "#order-medicine" },
        secondaryCTA: { bn: "শিডিউল ম্যানেজমেন্ট", en: "Manage Schedule",   href: "#schedule"      },
    },
    {
        id: 4,
        imageBg: "/images/hero/emergency-service.jpg",
        gradient: "from-red-950/90 via-red-900/60 to-transparent",
        badge:    { bn: "জরুরি পরিস্থিতি", en: "Emergency Services" },
        trust:    { bn: "⚡ ইমার্জেন্সি রেসপন্স প্রটোকল · অভিজ্ঞ টিম", en: "⚡ Emergency Response Protocol · Expert Team" },
        headline: { bn: "যেকোনো মেডিকেল ইমার্জেন্সিতে\nআপনার প্রথম ভরসা।", en: "Your first line of defense\nin any medical crisis." },
        sub:      { bn: "অ্যাম্বুলেন্স ডাকা থেকে হাসপাতালে ভর্তি এবং প্রথম মুহূর্তের ব্যবস্থাপনা—সংকটময় সময়ে আমরা নেবো দ্রুততম ও সঠিক সিদ্ধান্ত।", en: "From arranging ambulances to hospital admission and critical initial care—we take swift, structured action when seconds matter." },
        primaryCTA:   { bn: "জরুরি হটলাইন",      en: "Emergency Hotline",  href: "tel:+8801715599599" },
        secondaryCTA: { bn: "আমাদের সক্ষমতা", en: "Our Capabilities", href: "#ambulance"        },
    },
    {
        id: 5,
        imageBg: "/images/hero/daily-needs.jpg",
        gradient: "from-amber-950/90 via-amber-900/60 to-transparent",
        badge:    { bn: "দৈনন্দিন প্রয়োজন", en: "Daily Needs" },
        trust:    { bn: "🤝 ব্যাকগ্রাউন্ড-চেকড সহকারী · নিরাপদ যাতায়াত", en: "🤝 Background-checked Assistants · Safe Travel" },
        headline: { bn: "ছোট ছোট প্রয়োজনে,\nনির্ভরযোগ্য সঙ্গী।", en: "A reliable companion\nfor life's little hurdles." },
        sub:      { bn: "সকালে বাজার করা, ব্যাংকে যাওয়া কিংবা আত্মীয়ের বাসায় ঘুরে আসা—আমাদের সহকারীরা তাদের স্বনির্ভরতা বজায় রাখতে সাহায্য করবে।", en: "Whether it's morning groceries, a bank visit, or a social call—our assistants help them maintain their independence safely." },
        primaryCTA:   { bn: "সহকারী বুক করুন", en: "Book Assistant", href: "#book-assistant" },
        secondaryCTA: { bn: "কীভাবে কাজ করে", en: "How It Works",   href: "#how-it-works"   },
    },
    {
        id: 6,
        imageBg: "/images/hero/mental-wellness.jpg",
        gradient: "from-violet-950/90 via-violet-900/60 to-transparent",
        badge:    { bn: "মানসিক সুস্থতা", en: "Mental Wellness" },
        trust:    { bn: "🧠 এমপ্যাথেটিক লিসেনিং · গুণগত সময়", en: "🧠 Empathetic Listening · Quality Time" },
        headline: { bn: "বার্ধক্যে একাকীত্ব নয়,\nপ্রয়োজন একজন ভালো শ্রোতার।", en: "Combating isolation\nwith genuine companionship." },
        sub:      { bn: "একসাথে চা খাওয়া, পত্রিকা পড়ে শোনানো কিংবা শুধু গল্প করা—তাদের মানসিক প্রফুল্লতা ও একাকীত্ব কাটাতে আমরা দিচ্ছি মানসম্পন্ন সময়।", en: "Sharing a cup of tea, reading the news, or simply listening to their stories—we provide quality time to support their mental well-being." },
        primaryCTA:   { bn: "কথা বলুন",  en: "Speak With Us", href: "#counseling" },
        secondaryCTA: { bn: "আমাদের কাউন্সেলর", en: "Our Counselors",    href: "#reviews"   },
    },
    {
        id: 7,
        imageBg: "/images/hero/brand-trust.jpg",
        gradient: "from-slate-950/90 via-slate-900/60 to-transparent",
        badge:    { bn: "পারিবারিক প্রতিশ্রুতি", en: "Familial Promise" },
        trust:    { bn: "🛡️ শতভাগ স্বচ্ছতা · জিরো কমপ্লেইন পলিসি", en: "🛡️ 100% Transparency · Zero Complaint Policy" },
        headline: { bn: "আপনার অনুপস্থিতিতে,\nপারিবারিক স্নেহের প্রতিশ্রুতি।", en: "In your absence,\nthe promise of familial care." },
        sub:      { bn: "আমরা শুধু সেবাদানকারী নই। প্রবাসে বা কর্মব্যস্ততায় থাকা সন্তানদের প্রতিনিধি হিসেবে আমরা আপনার মা-বাবার দায়িত্ব নিচ্ছি পরম মমতায়।", en: "We are more than service providers. As representatives of busy or expatriate children, we take responsibility for your parents with utmost devotion." },
        primaryCTA:   { bn: "আস্থা রাখুন", en: "Trust in Us",  href: "#team"   },
        secondaryCTA: { bn: "ফাউন্ডারের কথা",   en: "Message From Founder", href: "#why-us" },
    },
];
