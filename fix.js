const fs = require('fs');
const path = 'src/constants/index.ts';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('export const servicesData = {');
const endIdx = content.indexOf('// ───── How It Works (Process Steps) ────────────────────────────────────────');

if (startIdx !== -1 && endIdx !== -1) {
    const servicesDataStr = `export const servicesData = {
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

`;

    const newContent = content.substring(0, startIdx) + servicesDataStr + content.substring(endIdx);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Successfully replaced servicesData.');
} else {
    console.log('Could not find start or end index.');
}
