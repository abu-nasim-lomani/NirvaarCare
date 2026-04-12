"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Loader2, CheckCircle2, Cloud, Plus, Trash2,
    ChevronDown, ChevronUp, Image as ImageIcon,
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";

// ── Default content (constants so first-time init has real data) ──────────
const DEFAULT_DATA = {
    hero: {
        title: { en: "Diagnostic & Medical Tests", bn: "ডায়াগনস্টিক ও পরীক্ষা সেবা" },
        tagline: { en: "The right test at the right time — your health is our responsibility.", bn: "সঠিক পরীক্ষা, সঠিক সময়ে—আপনার স্বাস্থ্য আমাদের দায়িত্ব।" },
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
        videoUrl: "",
    },
    overview: {
        description: {
            en: "A professional, end-to-end medical testing coordination service — so your loved one never has to go through the process alone, confused, or unsupported.",
            bn: "একটি পেশাদার, শুরু থেকে শেষ পর্যন্ত সম্পূর্ণ চিকিৎসা পরীক্ষার সমন্বয় সেবা — যেন আপনার প্রিয়জনকে একা, বিভ্রান্ত বা সহায়হীনভাবে এই প্রক্রিয়ার মধ্য দিয়ে যেতে না হয়।",
        },
        steps: [
            { en: "Call our helpline and specify the tests required", bn: "হেল্পলাইনে কল করুন এবং পরীক্ষার ধরন জানান" },
            { en: "Our team selects a convenient time & center for you", bn: "আমাদের টিম সুবিধাজনক সময় ও কেন্দ্র নির্বাচন করে দেবে" },
            { en: "Caregiver accompanies your loved one for the tests", bn: "কেয়ারগিভার প্রিয়জনকে সঙ্গ নিয়ে পরীক্ষা সম্পন্ন করবে" },
            { en: "Report is shared digitally and doctor consultation is arranged", bn: "রিপোর্ট ডিজিটালি পাঠানো হবে এবং ডাক্তারের পরামর্শ নেওয়া হবে" },
        ],
        benefits: [
            { en: "Sample collection at your doorstep", bn: "বাড়িতে বসেই স্যাম্পল সংগ্রহ" },
            { en: "Digital report delivery to family", bn: "ডিজিটাল রিপোর্ট ডেলিভারি" },
            { en: "Caregiver escort to diagnostic center", bn: "ডায়াগনস্টিক সেন্টারে কেয়ারগিভার সঙ্গ" },
            { en: "Doctor assistance for report interpretation", bn: "রিপোর্ট ব্যাখ্যায় ডাক্তার সহায়তা" },
        ],
    },
    whatIs: {
        title: { en: "What Is Diagnostic & Medical Testing Service?", bn: "ডায়াগনস্টিক ও মেডিকেল টেস্ট সেবা কী?" },
        subtitle: { en: "A professional, end-to-end medical testing coordination service — so your loved one never has to go through the process alone.", bn: "একটি পেশাদার সমন্বয় সেবা যেন আপনার প্রিয়জনকে একা এই প্রক্রিয়ার মধ্য দিয়ে যেতে না হয়।" },
        cards: [
            { color: "emerald", en: "Home Sample Collection", bn: "বাড়িতে স্যাম্পল সংগ্রহ", descEn: "Our trained phlebotomist comes directly to your home, collects blood, urine, or stool samples, and delivers them safely to the partner lab.", descBn: "আমাদের প্রশিক্ষিত ফ্লেবোটোমিস্ট সরাসরি আপনার বাড়িতে আসেন, স্যাম্পল সংগ্রহ করে পার্টনার ল্যাবে পৌঁছে দেন।" },
            { color: "blue", en: "Escort to Diagnostic Center", bn: "ডায়াগনস্টিক সেন্টারে সঙ্গে যাওয়া", descEn: "A dedicated caregiver accompanies your loved one from home to the diagnostic center, ensures a comfortable experience, and brings them safely back.", descBn: "একজন নিবেদিত কেয়ারগিভার আপনার প্রিয়জনকে বাড়ি থেকে ডায়াগনস্টিক সেন্টারে নিয়ে যান এবং নিরাপদে ফিরিয়ে আনেন।" },
            { color: "indigo", en: "Report Delivery & Interpretation", bn: "রিপোর্ট ডেলিভারি ও ব্যাখ্যা", descEn: "Test reports are shared digitally with the family immediately. If needed, a doctor consultation is arranged to explain the results.", descBn: "পরীক্ষার রিপোর্ট সঙ্গে সঙ্গে পরিবারকে ডিজিটালি পাঠানো হয়। প্রয়োজনে ডাক্তারের পরামর্শের ব্যবস্থা করা হয়।" },
        ],
    },
    whoIsItFor: {
        title: { en: "Designed For Those Who Need It Most", bn: "যারা সবচেয়ে বেশি প্রয়োজন তাদের জন্যই তৈরি" },
        subtitle: { en: "Whether your loved one lives alone, has mobility challenges, or you simply cannot be present — this service fills the gap.", bn: "আপনার প্রিয়জন একা থাকুন, চলাফেরায় সমস্যা থাকুক বা আপনি পাশে থাকতে না পারুন — এই সেবাটি সেই শূন্যস্থান পূরণ করে।" },
        cards: [
            { color: "rose", en: "Elderly Parents", bn: "বৃদ্ধ বাবা–মা", descEn: "Parents who struggle with travelling alone to diagnostic centers.", descBn: "যে বাবা–মা একা ডায়াগনস্টিক সেন্টারে যেতে কষ্ট হয়।" },
            { color: "amber", en: "Mobility-Challenged", bn: "চলাচলে অক্ষম", descEn: "People with limited mobility who need physical assistance throughout.", descBn: "যাদের স্বাধীনভাবে চলাফেরা করতে সমস্যা হয়।" },
            { color: "teal", en: "Post-Surgery Patients", bn: "অপারেশন পরবর্তী রোগী", descEn: "Recovering patients who need follow-up tests without the stress of travel.", descBn: "অপারেশনের পর ফলো-আপ পরীক্ষার জন্য যারা বাইরে যাওয়ার ঝামেলা এড়াতে চান।" },
            { color: "purple", en: "Chronically Ill", bn: "দীর্ঘমেয়াদী রোগী", descEn: "Diabetics, hypertension and heart patients who need regular monitoring tests.", descBn: "ডায়াবেটিস, উচ্চরক্তচাপ ও হৃদরোগীরা যাদের নিয়মিত মনিটরিং টেস্ট দরকার।" },
        ],
        expatsCallout: {
            titleEn: "Living abroad? Working in another city?",
            titleBn: "বিদেশে বাস করছেন? অন্য শহরে কর্মরত?",
            descEn: "You don't need to book a flight just to take your parents for a blood test. Our team handles everything — scheduling, escort, testing, and report delivery — while you stay updated in real-time from anywhere in the world.",
            descBn: "বাবা–মার রক্ত পরীক্ষার জন্য দেশে ছুটে আসতে হবে না। আমাদের টিম সবকিছু সামলায় — সময় নির্ধারণ, সঙ্গ করা, পরীক্ষা এবং রিপোর্ট পাঠানো।",
        },
    },
    workflows: {
        title: { en: "Two Ways We Can Help You", bn: "দুটি উপায়ে আমরা সেবা দিই" },
        subtitle: { en: "Select the option that best suits your loved one's condition and your preference.", bn: "আপনার প্রিয়জনের অবস্থা ও সুবিধা অনুযায়ী যেকোনো একটি বেছে নিন।" },
        optionA: {
            titleEn: "Home Sample Collection",
            titleBn: "বাড়িতে স্যাম্পল সংগ্রহ",
            taglineEn: "Best for: routine tests, follow-ups, bedridden patients",
            taglineBn: "উপযুক্ত: নিয়মিত পরীক্ষা, ফলো-আপ, শয্যাশায়ী রোগী",
            steps: [
                { en: "You book the service online or via phone", bn: "আপনি অনলাইনে বা ফোনে সেবা বুক করেন" },
                { en: "Manager reviews and confirms a convenient time slot", bn: "ম্যানেজার রিভিউ করে সুবিধাজনক সময় নিশ্চিত করেন" },
                { en: "Our certified phlebotomist arrives at your door", bn: "আমাদের সার্টিফাইড ফ্লেবোটোমিস্ট আপনার দরজায় আসেন" },
                { en: "Samples are collected professionally and hygienically", bn: "পেশাদারভাবে ও স্বাস্থ্যসম্মতভাবে স্যাম্পল সংগ্রহ করা হয়" },
                { en: "Samples are delivered to the lab securely", bn: "স্যাম্পল নিরাপদে ল্যাবে পৌঁছে দেওয়া হয়" },
                { en: "Digital report is sent to your family WhatsApp/Email", bn: "ডিজিটাল রিপোর্ট পরিবারের হোয়াটসঅ্যাপ/ইমেইলে পাঠানো হয়" },
            ],
            footerEn: "No travel required. Comfortable & Stress-free.",
            footerBn: "কোনো ভ্রমণ নেই। সম্পূর্ণ আরামদায়ক ও ঝামেলামুক্ত।",
        },
        optionB: {
            titleEn: "With Transport (Escort to Center)",
            titleBn: "পরিবহনসহ (সেন্টারে সঙ্গে যাওয়া)",
            taglineEn: "Best for: complex tests, first-time visits, anxious patients",
            taglineBn: "উপযুক্ত: জটিল পরীক্ষা, প্রথমবার ভিজিট, উদ্বিগ্ন রোগী",
            steps: [
                { en: "You book online and select 'With Transport' option", bn: "আপনি অনলাইনে বুক করুন এবং 'পরিবহনসহ' অপশন বেছে নিন" },
                { en: "Manager assigns a trained caregiver & confirms time", bn: "ম্যানেজার একজন প্রশিক্ষিত কেয়ারগিভার নির্ধারণ করেন ও সময় নিশ্চিত করেন" },
                { en: "Caregiver arrives at home and assists with preparation", bn: "কেয়ারগিভার বাড়িতে আসেন এবং প্রস্তুতিতে সহায়তা করেন" },
                { en: "Caregiver escorts patient safely to the diagnostic center", bn: "কেয়ারগিভার রোগীকে নিরাপদে ডায়াগনস্টিক সেন্টারে নিয়ে যান" },
                { en: "Stays throughout — manages paperwork, queues & tests", bn: "পুরো সময় সঙ্গে থাকেন — কাগজপত্র, লাইন ও পরীক্ষা সামলান" },
                { en: "Safely returns patient home. Report shared with family.", bn: "রোগীকে নিরাপদে বাড়ি ফেরান। রিপোর্ট পরিবারকে পাঠানো হয়।" },
            ],
            footerEn: "Full accompaniment. Your loved one is never alone.",
            footerBn: "সম্পূর্ণ সঙ্গ। আপনার প্রিয়জন কখনো একা নন।",
        },
    },
    tests: {
        title: { en: "Tests We Coordinate", bn: "আমরা যে পরীক্ষাগুলো পরিচালনা করি" },
        subtitle: { en: "From routine blood work to specialized panels — we handle it all.", bn: "সাধারণ রক্ত পরীক্ষা থেকে বিশেষজ্ঞ প্যানেল পর্যন্ত — সব কিছু আমরা সামলাই।" },
        items: [
            { en: "CBC (Complete Blood Count)", bn: "সিবিসি (রক্তের সম্পূর্ণ পরীক্ষা)", tag: "Routine" },
            { en: "Blood Sugar (Fasting/PP)", bn: "ব্লাড সুগার (ফাস্টিং/পিপি)", tag: "Diabetes" },
            { en: "HbA1c (Glycated Haemoglobin)", bn: "HbA1c (গ্লাইকেটেড হিমোগ্লোবিন)", tag: "Diabetes" },
            { en: "Lipid Profile", bn: "লিপিড প্রোফাইল", tag: "Heart" },
            { en: "Urine R/E & C/S", bn: "প্রস্রাব পরীক্ষা (R/E ও C/S)", tag: "Kidney" },
            { en: "Thyroid Function (T3/T4/TSH)", bn: "থাইরয়েড ফাংশন টেস্ট", tag: "Thyroid" },
            { en: "Creatinine & Urea", bn: "ক্রিয়েটিনিন ও ইউরিয়া", tag: "Kidney" },
            { en: "Liver Function Test (LFT)", bn: "লিভার ফাংশন টেস্ট (LFT)", tag: "Liver" },
            { en: "Vitamin D & B12", bn: "ভিটামিন ডি ও বি-১২", tag: "Nutrition" },
            { en: "ECG / Echo", bn: "ইসিজি / ইকো", tag: "Heart" },
            { en: "X-Ray & Ultrasound", bn: "এক্স-রে ও আলট্রাসাউন্ড", tag: "Imaging" },
            { en: "COVID / Dengue Tests", bn: "কোভিড / ডেঙ্গু পরীক্ষা", tag: "Infection" },
        ],
    },
    whyUs: {
        title: { en: "What Makes Us Different", bn: "আমরা কোথায় আলাদা" },
        features: [
            { en: "100% Verified Caregivers", bn: "১০০% ভেরিফাইড কেয়ারগিভার", descEn: "All our field staff are police-verified, professionally trained, and regularly supervised.", descBn: "আমাদের সকল মাঠকর্মী পুলিশ ভেরিফাইড, পেশাদারভাবে প্রশিক্ষিত এবং নিয়মিত তত্ত্বাবধায়িত।" },
            { en: "Real-Time Family Updates", bn: "রিয়েল-টাইম পারিবারিক আপডেট", descEn: "You receive live status updates at every step — from caregiver dispatch to report delivery.", descBn: "প্রতিটি ধাপে আপনি লাইভ আপডেট পান — কেয়ারগিভার পাঠানো থেকে রিপোর্ট ডেলিভারি পর্যন্ত।" },
            { en: "Trusted Partner Labs Only", bn: "শুধুমাত্র বিশ্বস্ত পার্টনার ল্যাব", descEn: "We work exclusively with accredited, government-approved diagnostic centers in your city.", descBn: "আমরা শুধুমাত্র শহরের সরকার-অনুমোদিত ডায়াগনস্টিক সেন্টারগুলোর সাথে কাজ করি।" },
            { en: "Compassionate Human Touch", bn: "মানবিক সহানুভূতির স্পর্শ", descEn: "Beyond logistics, our caregivers provide emotional comfort and dignity to every patient they serve.", descBn: "লজিস্টিকের বাইরেও, আমাদের কেয়ারগিভাররা প্রতিটি রোগীকে মানসিক সান্ত্বনা ও মর্যাদা দিয়ে থাকেন।" },
        ],
    },
    faq: {
        items: [
            { q: { en: "How quickly can you arrange a home sample collection?", bn: "বাড়িতে স্যাম্পল সংগ্রহ কত দ্রুত ব্যবস্থা করা যায়?" }, a: { en: "In most cases, we can arrange a same-day or next-morning visit depending on your location and time of booking.", bn: "বেশিরভাগ ক্ষেত্রে, আপনার অবস্থান এবং বুকিংয়ের সময়ের উপর নির্ভর করে আমরা সেদিনই বা পরদিন সকালে ব্যবস্থা করতে পারি।" } },
            { q: { en: "Can the caregiver stay with the patient at the diagnostic center?", bn: "কেয়ারগিভার কি রোগীর সাথে ডায়াগনস্টিক সেন্টারে থাকতে পারবেন?" }, a: { en: "Yes. With the 'With Transport' option, the caregiver stays with your loved one for the entire duration.", bn: "হ্যাঁ। 'পরিবহনসহ' অপশনে কেয়ারগিভার পুরো সময় আপনার প্রিয়জনের সাথে থাকেন।" } },
            { q: { en: "How will I receive the test reports?", bn: "পরীক্ষার রিপোর্ট কীভাবে পাব?" }, a: { en: "Reports are delivered digitally via WhatsApp and Email to the family contact provided during booking.", bn: "রিপোর্ট বুকিংয়ের সময় দেওয়া পারিবারিক যোগাযোগ নম্বরে হোয়াটসঅ্যাপ এবং ইমেইলে ডিজিটালি পাঠানো হয়।" } },
            { q: { en: "Is this service available outside Dhaka?", bn: "এই সেবা কি ঢাকার বাইরেও পাওয়া যায়?" }, a: { en: "Currently, our service is primarily available in Dhaka. We are actively expanding to other major cities.", bn: "বর্তমানে আমাদের সেবা মূলত ঢাকায় পাওয়া যায়। আমরা সক্রিয়ভাবে অন্যান্য প্রধান শহরে সম্প্রসারিত হচ্ছি।" } },
            { q: { en: "What if my parent refuses to go or is anxious?", bn: "যদি আমার বাবা-মা যেতে না চান বা ভয় পান?" }, a: { en: "Our caregivers are trained in patient communication and empathy. The Home Sample Collection option is also ideal for anxious individuals.", bn: "আমাদের কেয়ারগিভাররা রোগীর সাথে যোগাযোগ এবং সহানুভূতিতে প্রশিক্ষিত। উদ্বিগ্ন ব্যক্তিদের জন্য হোম স্যাম্পল কালেকশন অপশনটিও আদর্শ।" } },
        ],
    },
};

const COMPONENT_ID = "DiagnosticServicePage";

// ── Reusable field components ─────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{children}</p>
);
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition" />
);
const Textarea = ({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
    <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y transition" />
);
const SectionCard = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
            <button onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-left">
                <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{title}</span>
                {open ? <ChevronUp size={16} className="text-emerald-500 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
            </button>
            {open && <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 space-y-4">{children}</div>}
        </div>
    );
};
const BilangualFields = ({ labelEn, labelBn, valueEn, valueBn, onChangeEn, onChangeBn, rows }: {
    labelEn?: string; labelBn?: string; valueEn: string; valueBn: string;
    onChangeEn: (v: string) => void; onChangeBn: (v: string) => void; rows?: number;
}) => (
    <div className="grid grid-cols-2 gap-3">
        <div>
            <Label>{labelEn || "English"}</Label>
            {rows ? <Textarea value={valueEn} onChange={onChangeEn} rows={rows} /> : <Input value={valueEn} onChange={onChangeEn} />}
        </div>
        <div>
            <Label>{labelBn || "বাংলা"}</Label>
            {rows ? <Textarea value={valueBn} onChange={onChangeBn} rows={rows} /> : <Input value={valueBn} onChange={onChangeBn} />}
        </div>
    </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────
export default function DiagnosticServiceCMS() {
    const [data, setData] = useState<any>(null);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [isUploading, setIsUploading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Load from Supabase ───────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            const supabase = createClient();
            const { data: rows } = await supabase
                .from("site_sections")
                .select("*")
                .eq("component_id", COMPONENT_ID)
                .single();

            if (rows) {
                setSectionId(rows.id);
                const merged = deepMerge(DEFAULT_DATA, rows.content_data || {});
                setData(merged);
            } else {
                // First time — insert default
                const { data: inserted } = await supabase
                    .from("site_sections")
                    .insert({
                        component_id: COMPONENT_ID,
                        nav_label_en: "Diagnostic Service Page",
                        nav_label_bn: "ডায়াগনস্টিক সেবা পাতা",
                        nav_href: "/services/1",
                        is_visible: true,
                        show_in_nav: false,
                        order_index: 99,
                        content_data: DEFAULT_DATA,
                    })
                    .select()
                    .single();
                if (inserted) {
                    setSectionId(inserted.id);
                    setData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
                }
            }
        };
        load();
    }, []);

    // ── Auto-save with 1.5s debounce ────────────────────────────────────
    const autoSave = useCallback(async (newData: any, sid: string | null) => {
        if (!sid) return;
        setSaveStatus("saving");
        const supabase = createClient();
        await supabase.from("site_sections").update({ content_data: newData }).eq("id", sid);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
    }, []);

    const update = useCallback((newData: any) => {
        setData(newData);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => autoSave(newData, sectionId), 1500);
    }, [sectionId, autoSave]);

    // ── Deep path setter helper ──────────────────────────────────────────
    const set = (path: string, value: any) => {
        const newData = JSON.parse(JSON.stringify(data));
        const keys = path.split(".");
        let obj = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (obj[keys[i]] === undefined) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        update(newData);
    };

    const arrAdd = (path: string, template: any) => {
        const newData = JSON.parse(JSON.stringify(data));
        const keys = path.split(".");
        let obj = newData;
        for (const k of keys) obj = obj[k];
        obj.push(template);
        update(newData);
    };

    const arrDel = (path: string, idx: number) => {
        const newData = JSON.parse(JSON.stringify(data));
        const keys = path.split(".");
        let obj = newData;
        for (const k of keys) obj = obj[k];
        obj.splice(idx, 1);
        update(newData);
    };

    const arrSet = (path: string, idx: number, field: string, value: any) => {
        const newData = JSON.parse(JSON.stringify(data));
        const keys = path.split(".");
        let obj = newData;
        for (const k of keys) obj = obj[k];
        const fkeys = field.split(".");
        let item = obj[idx];
        for (let i = 0; i < fkeys.length - 1; i++) {
            if (!item[fkeys[i]]) item[fkeys[i]] = {};
            item = item[fkeys[i]];
        }
        item[fkeys[fkeys.length - 1]] = value;
        update(newData);
    };

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const url = await uploadImage(file, "images");
        setIsUploading(false);
        if (url) set("hero.image", url);
    };

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Diagnostic Service — Page CMS
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Changes auto-save after 1.5s of inactivity
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                    {saveStatus === "saving" && (
                        <span className="flex items-center gap-1.5 text-amber-500">
                            <Loader2 size={14} className="animate-spin" /> Saving...
                        </span>
                    )}
                    {saveStatus === "saved" && (
                        <span className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 size={14} /> Saved
                        </span>
                    )}
                    {saveStatus === "idle" && (
                        <span className="flex items-center gap-1.5 text-gray-400">
                            <Cloud size={14} /> Auto-save on
                        </span>
                    )}
                </div>
            </div>

            {/* Editor Body */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">

                {/* ── HERO ─────────────────────────────────────────── */}
                <SectionCard title="🎬 Hero Section" defaultOpen={true}>
                    <BilangualFields
                        labelEn="Service Title (EN)" labelBn="Service Title (BN)"
                        valueEn={data.hero.title.en} valueBn={data.hero.title.bn}
                        onChangeEn={v => set("hero.title.en", v)} onChangeBn={v => set("hero.title.bn", v)}
                    />
                    <BilangualFields
                        labelEn="Tagline (EN)" labelBn="Tagline (BN)"
                        valueEn={data.hero.tagline.en} valueBn={data.hero.tagline.bn}
                        onChangeEn={v => set("hero.tagline.en", v)} onChangeBn={v => set("hero.tagline.bn", v)}
                        rows={2}
                    />
                    <div>
                        <Label>Video URL (YouTube embed or leave blank)</Label>
                        <Input value={data.hero.videoUrl} onChange={v => set("hero.videoUrl", v)} placeholder="https://www.youtube.com/embed/..." />
                    </div>
                    <div>
                        <Label>Hero Background Image</Label>
                        <div className="flex items-center gap-3 mt-1">
                            {data.hero.image && (
                                <img src={data.hero.image} alt="hero" className="w-24 h-16 rounded-lg object-cover border border-gray-200" />
                            )}
                            <div className="flex-1 space-y-2">
                                <Input value={data.hero.image} onChange={v => set("hero.image", v)} placeholder="https://..." />
                                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                    {isUploading ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                                    {isUploading ? "Uploading..." : "Upload Image"}
                                    <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── OVERVIEW ─────────────────────────────────────── */}
                <SectionCard title="📋 Overview Section (How It Works)">
                    <BilangualFields
                        labelEn="Full Description (EN)" labelBn="Full Description (BN)"
                        valueEn={data.overview.description.en} valueBn={data.overview.description.bn}
                        onChangeEn={v => set("overview.description.en", v)} onChangeBn={v => set("overview.description.bn", v)}
                        rows={4}
                    />
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>How It Works Steps</Label>
                            <button onClick={() => arrAdd("overview.steps", { en: "New Step", bn: "নতুন ধাপ" })}
                                className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700">
                                <Plus size={12} /> Add Step
                            </button>
                        </div>
                        <div className="space-y-2">
                            {data.overview.steps.map((step: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 group">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</div>
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <Input value={step.en} onChange={v => arrSet("overview.steps", idx, "en", v)} placeholder="Step EN" />
                                        <Input value={step.bn} onChange={v => arrSet("overview.steps", idx, "bn", v)} placeholder="Step BN" />
                                    </div>
                                    <button onClick={() => arrDel("overview.steps", idx)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 mt-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>What You'll Get (Benefits)</Label>
                            <button onClick={() => arrAdd("overview.benefits", { en: "New Benefit", bn: "নতুন সুবিধা" })}
                                className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700">
                                <Plus size={12} /> Add Benefit
                            </button>
                        </div>
                        <div className="space-y-2">
                            {data.overview.benefits.map((b: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 group">
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <Input value={b.en} onChange={v => arrSet("overview.benefits", idx, "en", v)} placeholder="Benefit EN" />
                                        <Input value={b.bn} onChange={v => arrSet("overview.benefits", idx, "bn", v)} placeholder="Benefit BN" />
                                    </div>
                                    <button onClick={() => arrDel("overview.benefits", idx)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionCard>

                {/* ── WHAT IS ──────────────────────────────────────── */}
                <SectionCard title="🔬 What Is This Service (3 Cards)">
                    <BilangualFields
                        labelEn="Section Title (EN)" labelBn="Section Title (BN)"
                        valueEn={data.whatIs.title.en} valueBn={data.whatIs.title.bn}
                        onChangeEn={v => set("whatIs.title.en", v)} onChangeBn={v => set("whatIs.title.bn", v)}
                        rows={2}
                    />
                    <BilangualFields
                        labelEn="Subtitle (EN)" labelBn="Subtitle (BN)"
                        valueEn={data.whatIs.subtitle.en} valueBn={data.whatIs.subtitle.bn}
                        onChangeEn={v => set("whatIs.subtitle.en", v)} onChangeBn={v => set("whatIs.subtitle.bn", v)}
                        rows={2}
                    />
                    {data.whatIs.cards.map((card: any, idx: number) => (
                        <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Card {idx + 1}</span>
                                <select value={card.color} onChange={e => arrSet("whatIs.cards", idx, "color", e.target.value)}
                                    className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-emerald-500 bg-white dark:bg-gray-800">
                                    <option value="emerald">Emerald</option>
                                    <option value="blue">Blue</option>
                                    <option value="indigo">Indigo</option>
                                    <option value="teal">Teal</option>
                                    <option value="rose">Rose</option>
                                </select>
                            </div>
                            <BilangualFields
                                labelEn="Title EN" labelBn="Title BN"
                                valueEn={card.en} valueBn={card.bn}
                                onChangeEn={v => arrSet("whatIs.cards", idx, "en", v)} onChangeBn={v => arrSet("whatIs.cards", idx, "bn", v)}
                            />
                            <BilangualFields
                                labelEn="Description EN" labelBn="Description BN"
                                valueEn={card.descEn} valueBn={card.descBn}
                                onChangeEn={v => arrSet("whatIs.cards", idx, "descEn", v)} onChangeBn={v => arrSet("whatIs.cards", idx, "descBn", v)}
                                rows={2}
                            />
                        </div>
                    ))}
                </SectionCard>

                {/* ── WHO IS IT FOR ─────────────────────────────────── */}
                <SectionCard title="👥 Who Is This For (4 Cards + Expats Callout)">
                    <BilangualFields
                        labelEn="Section Title EN" labelBn="Section Title BN"
                        valueEn={data.whoIsItFor.title.en} valueBn={data.whoIsItFor.title.bn}
                        onChangeEn={v => set("whoIsItFor.title.en", v)} onChangeBn={v => set("whoIsItFor.title.bn", v)}
                        rows={2}
                    />
                    <BilangualFields
                        labelEn="Subtitle EN" labelBn="Subtitle BN"
                        valueEn={data.whoIsItFor.subtitle.en} valueBn={data.whoIsItFor.subtitle.bn}
                        onChangeEn={v => set("whoIsItFor.subtitle.en", v)} onChangeBn={v => set("whoIsItFor.subtitle.bn", v)}
                        rows={2}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.whoIsItFor.cards.map((card: any, idx: number) => (
                            <div key={idx} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl space-y-2 bg-gray-50/50 dark:bg-gray-800/30">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Card {idx + 1}</span>
                                    <select value={card.color} onChange={e => arrSet("whoIsItFor.cards", idx, "color", e.target.value)}
                                        className="text-xs border border-gray-200 rounded px-2 py-0.5 outline-none bg-white dark:bg-gray-800">
                                        <option value="rose">Rose</option>
                                        <option value="amber">Amber</option>
                                        <option value="teal">Teal</option>
                                        <option value="purple">Purple</option>
                                        <option value="emerald">Emerald</option>
                                        <option value="blue">Blue</option>
                                    </select>
                                </div>
                                <Input value={card.en} onChange={v => arrSet("whoIsItFor.cards", idx, "en", v)} placeholder="Title EN" />
                                <Input value={card.bn} onChange={v => arrSet("whoIsItFor.cards", idx, "bn", v)} placeholder="Title BN" />
                                <Textarea value={card.descEn} onChange={v => arrSet("whoIsItFor.cards", idx, "descEn", v)} rows={2} placeholder="Desc EN" />
                                <Textarea value={card.descBn} onChange={v => arrSet("whoIsItFor.cards", idx, "descBn", v)} rows={2} placeholder="Desc BN" />
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-xl space-y-3">
                        <Label>✈️ Expats Callout Banner</Label>
                        <BilangualFields
                            labelEn="Title EN" labelBn="Title BN"
                            valueEn={data.whoIsItFor.expatsCallout.titleEn} valueBn={data.whoIsItFor.expatsCallout.titleBn}
                            onChangeEn={v => set("whoIsItFor.expatsCallout.titleEn", v)} onChangeBn={v => set("whoIsItFor.expatsCallout.titleBn", v)}
                        />
                        <BilangualFields
                            labelEn="Description EN" labelBn="Description BN"
                            valueEn={data.whoIsItFor.expatsCallout.descEn} valueBn={data.whoIsItFor.expatsCallout.descBn}
                            onChangeEn={v => set("whoIsItFor.expatsCallout.descEn", v)} onChangeBn={v => set("whoIsItFor.expatsCallout.descBn", v)}
                            rows={3}
                        />
                    </div>
                </SectionCard>

                {/* ── WORKFLOWS ─────────────────────────────────────── */}
                <SectionCard title="⚡ Two Workflows (Option A & B)">
                    <BilangualFields
                        labelEn="Section Title EN" labelBn="Section Title BN"
                        valueEn={data.workflows.title.en} valueBn={data.workflows.title.bn}
                        onChangeEn={v => set("workflows.title.en", v)} onChangeBn={v => set("workflows.title.bn", v)}
                    />
                    <BilangualFields
                        labelEn="Subtitle EN" labelBn="Subtitle BN"
                        valueEn={data.workflows.subtitle.en} valueBn={data.workflows.subtitle.bn}
                        onChangeEn={v => set("workflows.subtitle.en", v)} onChangeBn={v => set("workflows.subtitle.bn", v)}
                        rows={2}
                    />
                    {(["optionA", "optionB"] as const).map((opt) => (
                        <div key={opt} className={`p-4 rounded-xl border-2 space-y-4 ${opt === "optionA" ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10" : "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10"}`}>
                            <Label>{opt === "optionA" ? "Option A — Home Sample Collection" : "Option B — Escort to Center"}</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div><Label>Title EN</Label><Input value={data.workflows[opt].titleEn} onChange={v => set(`workflows.${opt}.titleEn`, v)} /></div>
                                <div><Label>Title BN</Label><Input value={data.workflows[opt].titleBn} onChange={v => set(`workflows.${opt}.titleBn`, v)} /></div>
                                <div><Label>Best For (EN)</Label><Input value={data.workflows[opt].taglineEn} onChange={v => set(`workflows.${opt}.taglineEn`, v)} /></div>
                                <div><Label>Best For (BN)</Label><Input value={data.workflows[opt].taglineBn} onChange={v => set(`workflows.${opt}.taglineBn`, v)} /></div>
                                <div><Label>Footer Note (EN)</Label><Input value={data.workflows[opt].footerEn} onChange={v => set(`workflows.${opt}.footerEn`, v)} /></div>
                                <div><Label>Footer Note (BN)</Label><Input value={data.workflows[opt].footerBn} onChange={v => set(`workflows.${opt}.footerBn`, v)} /></div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label>Steps ({data.workflows[opt].steps.length})</Label>
                                    <button onClick={() => arrAdd(`workflows.${opt}.steps` as any, { en: "New step", bn: "নতুন ধাপ" })}
                                        className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700">
                                        <Plus size={12} /> Add Step
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.workflows[opt].steps.map((step: any, si: number) => (
                                        <div key={si} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 group">
                                            <div className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${opt === "optionA" ? "bg-emerald-500" : "bg-blue-600"}`}>{si + 1}</div>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <Input value={step.en} onChange={v => { const d = JSON.parse(JSON.stringify(data)); d.workflows[opt].steps[si].en = v; update(d); }} placeholder="Step EN" />
                                                <Input value={step.bn} onChange={v => { const d = JSON.parse(JSON.stringify(data)); d.workflows[opt].steps[si].bn = v; update(d); }} placeholder="Step BN" />
                                            </div>
                                            <button onClick={() => { const d = JSON.parse(JSON.stringify(data)); d.workflows[opt].steps.splice(si, 1); update(d); }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </SectionCard>

                {/* ── TESTS GRID ──────────────────────────────────────── */}
                <SectionCard title="🧪 Common Tests Grid">
                    <BilangualFields
                        labelEn="Section Title EN" labelBn="Section Title BN"
                        valueEn={data.tests.title.en} valueBn={data.tests.title.bn}
                        onChangeEn={v => set("tests.title.en", v)} onChangeBn={v => set("tests.title.bn", v)}
                    />
                    <BilangualFields
                        labelEn="Subtitle EN" labelBn="Subtitle BN"
                        valueEn={data.tests.subtitle.en} valueBn={data.tests.subtitle.bn}
                        onChangeEn={v => set("tests.subtitle.en", v)} onChangeBn={v => set("tests.subtitle.bn", v)}
                        rows={2}
                    />
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Tests ({data.tests.items.length})</Label>
                            <button onClick={() => arrAdd("tests.items", { en: "New Test", bn: "নতুন পরীক্ষা", tag: "Routine" })}
                                className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700">
                                <Plus size={12} /> Add Test
                            </button>
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                            {data.tests.items.map((test: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group">
                                    <Input value={test.en} onChange={v => arrSet("tests.items", idx, "en", v)} placeholder="Test name EN" />
                                    <Input value={test.bn} onChange={v => arrSet("tests.items", idx, "bn", v)} placeholder="Test name BN" />
                                    <input type="text" value={test.tag} onChange={e => arrSet("tests.items", idx, "tag", e.target.value)}
                                        placeholder="Tag" className="w-24 text-xs border border-gray-200 rounded px-2 py-2 outline-none focus:border-emerald-500 bg-white dark:bg-gray-900 shrink-0" />
                                    <button onClick={() => arrDel("tests.items", idx)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 shrink-0">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionCard>

                {/* ── WHY US ──────────────────────────────────────────── */}
                <SectionCard title="🏅 Why Nirvaar Care (4 Differentiators)">
                    <BilangualFields
                        labelEn="Section Title EN" labelBn="Section Title BN"
                        valueEn={data.whyUs.title.en} valueBn={data.whyUs.title.bn}
                        onChangeEn={v => set("whyUs.title.en", v)} onChangeBn={v => set("whyUs.title.bn", v)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.whyUs.features.map((f: any, idx: number) => (
                            <div key={idx} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl space-y-2 bg-gray-50/50 dark:bg-gray-800/30">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase">Feature {idx + 1}</span>
                                <Input value={f.en} onChange={v => arrSet("whyUs.features", idx, "en", v)} placeholder="Title EN" />
                                <Input value={f.bn} onChange={v => arrSet("whyUs.features", idx, "bn", v)} placeholder="Title BN" />
                                <Textarea value={f.descEn} onChange={v => arrSet("whyUs.features", idx, "descEn", v)} rows={2} placeholder="Description EN" />
                                <Textarea value={f.descBn} onChange={v => arrSet("whyUs.features", idx, "descBn", v)} rows={2} placeholder="Description BN" />
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── FAQ ─────────────────────────────────────────────── */}
                <SectionCard title="❓ FAQ Section">
                    <div className="flex items-center justify-between mb-2">
                        <Label>Questions ({data.faq.items.length})</Label>
                        <button onClick={() => arrAdd("faq.items", { q: { en: "New Question?", bn: "নতুন প্রশ্ন?" }, a: { en: "Answer here.", bn: "উত্তর এখানে।" } })}
                            className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700">
                            <Plus size={12} /> Add FAQ
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.faq.items.map((item: any, idx: number) => (
                            <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3 bg-gray-50/50 dark:bg-gray-800/30 group relative">
                                <button onClick={() => arrDel("faq.items", idx)}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500">
                                    <Trash2 size={14} />
                                </button>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Q{idx + 1}</span>
                                <BilangualFields
                                    labelEn="Question EN" labelBn="Question BN"
                                    valueEn={item.q.en} valueBn={item.q.bn}
                                    onChangeEn={v => { const d = JSON.parse(JSON.stringify(data)); d.faq.items[idx].q.en = v; update(d); }}
                                    onChangeBn={v => { const d = JSON.parse(JSON.stringify(data)); d.faq.items[idx].q.bn = v; update(d); }}
                                />
                                <BilangualFields
                                    labelEn="Answer EN" labelBn="Answer BN"
                                    valueEn={item.a.en} valueBn={item.a.bn}
                                    onChangeEn={v => { const d = JSON.parse(JSON.stringify(data)); d.faq.items[idx].a.en = v; update(d); }}
                                    onChangeBn={v => { const d = JSON.parse(JSON.stringify(data)); d.faq.items[idx].a.bn = v; update(d); }}
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <div className="h-16" />
            </div>
        </div>
    );
}

// ── Utility: deep merge defaults into DB data ────────────────────────────
function deepMerge(defaults: any, overrides: any): any {
    if (typeof defaults !== "object" || defaults === null) return overrides ?? defaults;
    const result: any = { ...defaults };
    for (const key of Object.keys(overrides || {})) {
        if (Array.isArray(overrides[key])) {
            result[key] = overrides[key];
        } else if (typeof overrides[key] === "object" && overrides[key] !== null && typeof defaults[key] === "object") {
            result[key] = deepMerge(defaults[key], overrides[key]);
        } else {
            result[key] = overrides[key];
        }
    }
    return result;
}
