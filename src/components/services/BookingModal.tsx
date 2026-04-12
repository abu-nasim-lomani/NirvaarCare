"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, CheckCircle2, UploadCloud, AlertCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceId: number;
    serviceName: { bn: string; en: string };
}

export default function BookingModal({ isOpen, onClose, serviceId, serviceName }: BookingModalProps) {
    const { lang } = useLang();
    
    // Total steps: 2 base + 1 specific (if serviceId === 1)
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState<any>({
        // Section A
        reqName: "",
        reqPhone: "",
        reqLocation: "",
        reqRelation: "",
        reqBestTime: "",
        // Section B
        patName: "",
        patAge: "",
        patGender: "",
        patPhone: "",
        patAddress: "",
        patMedicalCond: [] as string[],
        patBloodGroup: "",
        patMobility: "",
        patBookingType: "",
        patNotes: "",
        // Section C (Diagnostic)
        diagTests: [] as string[],
        diagOtherTest: "",
        diagMode: "",
        diagHasPrescription: "No",
        diagFasting: "",
        diagReportDest: "",
        diagUrgency: "",
        diagDate: "",
        diagTimeSlot: "",
        // Section C (Doctor Care Specific)
        docType: "",
        docSpecialistDept: "",
        docVisitType: "",
        docSymptoms: "",
        docTakingMeds: "",
        docMedsList: "",
        docPref: "",
        docLanguage: "",
        docDate: "",
        docTimeSlot: "",
        // Section C (Medicine Specific)
        medOrderType: "",
        medPrescription: null,
        medNames: "",
        medDays: "",
        medDeliveryType: "",
        medNeedHelp: "",
        medAllergies: "",
        medWhenNeeded: "",
        medTargetDate: "",
        // Section C (Emergency Specific)
        emgContactName: "",
        emgContactPhone: "",
        emgContactRelation: "",
        emgNearestHospital: "",
        emgHospitalPref: "",
        emgHistory: "",
        emgOxygen: "",
        emgHasInsurance: "",
        emgInsuranceInfo: "",
        emgAccessInfo: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset state on open/close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setIsSuccess(false);
                setErrors({});
            }, 300);
        }
    }, [isOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((p: any) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleCheckbox = (name: string, value: string) => {
        setFormData((p: any) => {
            const current = p[name] as string[];
            const updated = current.includes(value) 
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...p, [name]: updated };
        });
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const validateStep = () => {
        const newErrors: Record<string, string> = {};
        if (step === 1) {
            if (!formData.reqName) newErrors.reqName = lang === "en" ? "Name required" : "নাম আবশ্যক";
            if (!formData.reqPhone) newErrors.reqPhone = lang === "en" ? "Phone required" : "ফোন নম্বর আবশ্যক";
            if (!formData.reqLocation) newErrors.reqLocation = lang === "en" ? "Location required" : "অবস্থান আবশ্যক";
            if (!formData.reqRelation) newErrors.reqRelation = lang === "en" ? "Relation required" : "সম্পর্ক আবশ্যক";
            if (!formData.reqBestTime) newErrors.reqBestTime = lang === "en" ? "Best time required" : "সময় আবশ্যক";
        } else if (step === 2) {
            if (!formData.patName) newErrors.patName = lang === "en" ? "Name required" : "নাম আবশ্যক";
            if (!formData.patAge) newErrors.patAge = lang === "en" ? "Age required" : "বয়স আবশ্যক";
            if (!formData.patGender) newErrors.patGender = lang === "en" ? "Gender required" : "লিঙ্গ আবশ্যক";
            if (!formData.patAddress) newErrors.patAddress = lang === "en" ? "Address required" : "ঠিকানা আবশ্যক";
            if (!formData.patMobility) newErrors.patMobility = lang === "en" ? "Mobility status required" : "অবস্থা আবশ্যক";
            if (!formData.patBookingType) newErrors.patBookingType = lang === "en" ? "Booking type required" : "ধরণ আবশ্যক";
        } else if (step === 3 && serviceId === 1) {
            if (formData.diagTests.length === 0) newErrors.diagTests = lang === "en" ? "Select at least one test" : "কমপক্ষে একটি পরীক্ষা নির্বাচন করুন";
            if (!formData.diagMode) newErrors.diagMode = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.diagReportDest) newErrors.diagReportDest = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.diagUrgency) newErrors.diagUrgency = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.diagDate) newErrors.diagDate = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.diagTimeSlot) newErrors.diagTimeSlot = lang === "en" ? "Required" : "আবশ্যক";
        } else if (step === 3 && serviceId === 2) {
            if (!formData.docType) newErrors.docType = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.docVisitType) newErrors.docVisitType = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.docSymptoms) newErrors.docSymptoms = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.docDate) newErrors.docDate = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.docTimeSlot) newErrors.docTimeSlot = lang === "en" ? "Required" : "আবশ্যক";
        } else if (step === 3 && serviceId === 3) {
            if (!formData.medOrderType) newErrors.medOrderType = lang === "en" ? "Required" : "আবশ্যক";
            if (formData.medOrderType === "I know the medicine names" && !formData.medNames) newErrors.medNames = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.medDays) newErrors.medDays = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.medDeliveryType) newErrors.medDeliveryType = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.medNeedHelp) newErrors.medNeedHelp = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.medWhenNeeded) newErrors.medWhenNeeded = lang === "en" ? "Required" : "আবশ্যক";
            if (formData.medWhenNeeded === "Specific date" && !formData.medTargetDate) newErrors.medTargetDate = lang === "en" ? "Required" : "আবশ্যক";
        } else if (step === 3 && serviceId === 4) {
            if (!formData.emgContactName) newErrors.emgContactName = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.emgContactPhone) newErrors.emgContactPhone = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.emgContactRelation) newErrors.emgContactRelation = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.emgNearestHospital) newErrors.emgNearestHospital = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.emgHospitalPref) newErrors.emgHospitalPref = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.emgHistory) newErrors.emgHistory = lang === "en" ? "Required" : "আবশ্যক";
            if (!formData.emgOxygen) newErrors.emgOxygen = lang === "en" ? "Required" : "আবশ্যক";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => {
        setStep(s => s - 1);
    };

    const submitForm = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        
        const { data: { user } } = await supabase.auth.getUser();

        let has_transport = false;
        let report_type = 'online';

        if (serviceId === 1) { // Diagnostic
            if (formData.diagMode === "Escort") has_transport = true;
            if (formData.diagReportDest === "Hard Copy to Home") report_type = 'hardcopy';
        }

        const payload = {
            service_id: serviceId,
            service_name_en: serviceName.en,
            service_name_bn: serviceName.bn,
            requester_name: formData.reqName,
            requester_phone: formData.reqPhone,
            patient_name: formData.patName,
            booking_data: formData,
            has_transport,
            report_type,
            status: "Pending",
            user_id: user?.id
        };

        const { error } = await supabase.from('service_bookings').insert([payload]);

        setIsSubmitting(false);

        if (error) {
            console.error("Booking error:", error);
            alert(lang === "en" ? "An error occurred while booking. Please try again." : "বুকিং করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } else {
            setIsSuccess(true);
        }
    };

    // Determine total steps
    const totalSteps = (serviceId >= 1 && serviceId <= 4) ? 3 : 2;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm overflow-y-auto"
                onClick={onClose}
            >
                <div className="min-h-full py-8 text-center flex items-center justify-center w-full">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-left relative flex flex-col my-auto border border-gray-100 dark:border-gray-800"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* ── Modal Header ────────────────────────────────────── */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-20">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {lang === "en" ? "Book Service" : "সার্ভিসটি বুক করুন"}
                                </h2>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    {lang === "en" ? serviceName.en : serviceName.bn}
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* ── Progress Bar ────────────────────────────────────── */}
                        {!isSuccess && (
                            <div className="px-6 pt-4 pb-2 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {lang === "en" ? `Step ${step} of ${totalSteps}` : `ধাপ ${step}/${totalSteps}`}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600">
                                        {step === 1 && (lang === "en" ? "Requester Info" : "আপনার তথ্য")}
                                        {step === 2 && (lang === "en" ? "Patient Info" : "রোগীর তথ্য")}
                                        {step === 3 && (lang === "en" ? "Service Details" : "সার্ভিস তথ্য")}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                                        style={{ width: `${(step / totalSteps) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Modal Body ──────────────────────────────────────── */}
                        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            
                            {isSuccess ? (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="py-12 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-6">
                                        <CheckCircle2 size={50} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                        {lang === "en" ? "Request Submitted!" : "রিকোয়েস্ট জমা হয়েছে!"}
                                    </h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
                                        {lang === "en" 
                                            ? "Thank you. Our team will contact you shortly to confirm." 
                                            : "ধন্যবাদ। আমাদের টিম খুব দ্রুত আপনার সাথে যোগাযোগ করে নিশ্চিত করবে।"}
                                    </p>
                                    <button 
                                        onClick={onClose}
                                        className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-bold py-3 px-8 rounded-xl transition-all"
                                    >
                                        {lang === "en" ? "Done" : "ঠিক আছে"}
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    
                                    {/* STEP 1: REQUESTER INFO */}
                                    {step === 1 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                                            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                                                {lang === "en" ? "Basic Information" : "প্রাথমিক তথ্য"}
                                            </h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <InputField label={lang === "en" ? "Your Full Name" : "আপনার পুরো নাম"} name="reqName" value={formData.reqName} onChange={handleInput} error={errors.reqName} required />
                                                <InputField label={lang === "en" ? "Your Phone Number" : "আপনার ফোন নম্বর"} name="reqPhone" value={formData.reqPhone} onChange={handleInput} error={errors.reqPhone} type="tel" required />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField 
                                                    label={lang === "en" ? "Where are you based?" : "আপনি কোথায় থাকেন?"} 
                                                    name="reqLocation" value={formData.reqLocation} onChange={handleInput} error={errors.reqLocation} required
                                                >
                                                    <option value="">{lang === "en" ? "Select location..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Bangladesh">In Bangladesh (বাংলাদেশী)</option>
                                                    <option value="Abroad">Abroad (প্রবাসী / NRB)</option>
                                                </SelectField>

                                                <SelectField 
                                                    label={lang === "en" ? "Relation to Patient" : "রোগীর সাথে সম্পর্ক"} 
                                                    name="reqRelation" value={formData.reqRelation} onChange={handleInput} error={errors.reqRelation} required
                                                >
                                                    <option value="">{lang === "en" ? "Select relation..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Son/Daughter">Son/Daughter (ছেলে/মেয়ে)</option>
                                                    <option value="Spouse">Spouse (স্বামী/স্ত্রী)</option>
                                                    <option value="Sibling">Sibling (ভাই/বোন)</option>
                                                    <option value="Other">Other</option>
                                                </SelectField>
                                            </div>

                                            <SelectField 
                                                label={lang === "en" ? "Best Time to Call You" : "আপনাকে কল করার উপযুক্ত সময়"} 
                                                name="reqBestTime" value={formData.reqBestTime} onChange={handleInput} error={errors.reqBestTime} required
                                                fullWidth
                                            >
                                                <option value="">{lang === "en" ? "Select time..." : "নির্বাচন করুন..."}</option>
                                                <option value="Morning">Morning / সকাল (8am-12pm BD Time)</option>
                                                <option value="Afternoon">Afternoon / দুপুর (12pm-5pm BD Time)</option>
                                                <option value="Evening">Evening / রাত (5pm-9pm BD Time)</option>
                                            </SelectField>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: PATIENT INFO */}
                                    {step === 2 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                                            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                                                {lang === "en" ? "Patient Details" : "রোগীর বিস্তারিত তথ্য"}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <InputField label={lang === "en" ? "Patient Full Name" : "রোগীর পুরো নাম"} name="patName" value={formData.patName} onChange={handleInput} error={errors.patName} required />
                                                <div className="flex gap-3 text-gray-900 border-none bg-none outline-none ring-none rounded-none m-0 p-0 shadow-none border-0">
                                                    <InputField label={lang === "en" ? "Age" : "বয়স"} name="patAge" value={formData.patAge} onChange={handleInput} error={errors.patAge} type="number" required />
                                                    <SelectField label={lang === "en" ? "Gender" : "লিঙ্গ"} name="patGender" value={formData.patGender} onChange={handleInput} error={errors.patGender} required>
                                                        <option value="">-</option>
                                                        <option value="Male">{lang === "en" ? "Male" : "পুরুষ"}</option>
                                                        <option value="Female">{lang === "en" ? "Female" : "মহিলা"}</option>
                                                    </SelectField>
                                                </div>
                                            </div>

                                            <InputField label={lang === "en" ? "Patient Phone (Optional)" : "রোগীর ফোন নম্বর (ঐচ্ছিক)"} name="patPhone" value={formData.patPhone} onChange={handleInput} type="tel" fullWidth />
                                            
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {lang === "en" ? "Full Delivery Address" : "সম্পূর্ণ ঠিকানা"} <span className="text-red-500">*</span>
                                                </label>
                                                <textarea 
                                                    name="patAddress" value={formData.patAddress} onChange={handleInput} 
                                                    className={`w-full bg-white dark:bg-gray-800 border ${errors.patAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 resize-none h-20 placeholder:text-gray-400`}
                                                    placeholder={lang === "en" ? "District, Area, House No, Flat..." : "জেলা, এরিয়া, বাড়ি নং..."}
                                                />
                                                {errors.patAddress && <span className="text-xs text-red-500">{errors.patAddress}</span>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "Patient Mobility" : "রোগীর চলাচলের অবস্থা"} name="patMobility" value={formData.patMobility} onChange={handleInput} error={errors.patMobility} required>
                                                    <option value="">{lang === "en" ? "Select status..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Independent">Walks independently (স্বাভাবিক)</option>
                                                    <option value="Needs Assistance">Needs assistance (সাহায্য প্রয়োজন)</option>
                                                    <option value="Wheelchair">Requires wheelchair (হুইলচেয়ার)</option>
                                                    <option value="Bedbound">Bedbound (বিছানায় শয্যাশায়ী)</option>
                                                </SelectField>

                                                <SelectField label={lang === "en" ? "Booking Type" : "বুকিংয়ের ধরণ"} name="patBookingType" value={formData.patBookingType} onChange={handleInput} error={errors.patBookingType} required>
                                                    <option value="">{lang === "en" ? "Select type..." : "নির্বাচন করুন..."}</option>
                                                    <option value="One-time">One-time service (এককালীন)</option>
                                                    <option value="Monthly">Monthly subscription (মাসিক)</option>
                                                </SelectField>
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                                                    {lang === "en" ? "Existing Medical Conditions (Optional)" : "বর্তমান শারীরিক অবস্থা (ঐচ্ছিক)"}
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["Diabetes", "High Blood Pressure", "Heart Disease", "Kidney Disease", "Arthritis", "Neurological"].map(cond => (
                                                        <label key={cond} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                                            <input type="checkbox" checked={formData.patMedicalCond.includes(cond)} onChange={() => handleCheckbox("patMedicalCond", cond)} className="rounded text-emerald-500 focus:ring-emerald-500" />
                                                            {cond}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {lang === "en" ? "Special Instructions (Optional)" : "বিশেষ নির্দেশনা (ঐচ্ছিক)"}
                                                </label>
                                                <textarea name="patNotes" value={formData.patNotes} onChange={handleInput} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 resize-none h-16 placeholder:text-gray-400" />
                                            </div>

                                        </motion.div>
                                    )}

                                    {/* STEP 3: DIAGNOSTIC SPECIFIC INFO */}
                                    {step === 3 && serviceId === 1 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                                            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                                                {lang === "en" ? "Diagnostic Test Details" : "টেস্টের বিস্তারিত"}
                                            </h3>

                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2 flex justify-between">
                                                    <span>{lang === "en" ? "Tests Needed" : "প্রয়োজনীয় টেস্টসমূহ"} <span className="text-red-500">*</span></span>
                                                    {errors.diagTests && <span className="text-xs text-red-500">{errors.diagTests}</span>}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                                    {["CBC", "Blood Sugar (HbA1c)", "Lipid Profile", "Thyroid (TSH)", "Creatinine", "Urine Analysis", "Chest X-Ray", "ECG", "Other"].map(test => (
                                                        <label key={test} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-emerald-600">
                                                            <input type="checkbox" checked={formData.diagTests.includes(test)} onChange={() => handleCheckbox("diagTests", test)} className="w-4 h-4 rounded text-emerald-500 bg-white border-gray-300 focus:ring-emerald-500 dark:bg-gray-900 text-base" />
                                                            {test}
                                                        </label>
                                                    ))}
                                                </div>
                                                {formData.diagTests.includes("Other") && (
                                                    <div className="mt-3">
                                                        <InputField label={lang === "en" ? "Specify Other Test" : "অন্য টেস্টের নাম লিখুন"} name="diagOtherTest" value={formData.diagOtherTest} onChange={handleInput} fullWidth />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "Testing Mode" : "টেস্টের ধরণ"} name="diagMode" value={formData.diagMode} onChange={handleInput} error={errors.diagMode} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Home">{lang === "en" ? "Home Sample Collection" : "বাসা থেকে স্যাম্পল সংগ্রহ"}</option>
                                                    <option value="Escort">{lang === "en" ? "Escort to Center" : "সেন্টারে নিয়ে যাওয়া"}</option>
                                                </SelectField>

                                                <SelectField label={lang === "en" ? "Urgency" : "জরুরি অবস্থা"} name="diagUrgency" value={formData.diagUrgency} onChange={handleInput} error={errors.diagUrgency} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Today">Today (আজকেই)</option>
                                                    <option value="Within 2-3 Days">Within 2-3 Days</option>
                                                    <option value="Specific Date">Specific Date</option>
                                                </SelectField>
                                            </div>

                                            <SelectField label={lang === "en" ? "Report Delivery Destinatiom" : "রিপোর্ট ডেলিভারির মাধ্যম"} name="diagReportDest" value={formData.diagReportDest} onChange={handleInput} error={errors.diagReportDest} required fullWidth>
                                                <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                <option value="WhatsApp/Email Only">WhatsApp/Email Only</option>
                                                <option value="Hard Copy to Home">Hard Copy to Home (+ Delivery Charge)</option>
                                            </SelectField>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <InputField label={lang === "en" ? "Preferred Date" : "পছন্দের তারিখ"} name="diagDate" value={formData.diagDate} onChange={handleInput} error={errors.diagDate} type="date" required />
                                                
                                                <SelectField label={lang === "en" ? "Preferred Time Slot" : "পছন্দের সময়"} name="diagTimeSlot" value={formData.diagTimeSlot} onChange={handleInput} error={errors.diagTimeSlot} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Morning">Morning (8-11am)</option>
                                                    <option value="Late Morning">Late Morning (11am-1pm)</option>
                                                    <option value="Afternoon">Afternoon (2-5pm)</option>
                                                </SelectField>
                                            </div>

                                            <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/30">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{lang === "en" ? "Upload Prescription" : "প্রেসক্রিপশন আপলোড করুন"}</p>
                                                    <p className="text-xs text-gray-500">(Optional for now)</p>
                                                </div>
                                                <button type="button" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <UploadCloud size={16} /> Upload
                                                </button>
                                            </div>

                                        </motion.div>
                                    )}

                                    {/* STEP 3: DOCTOR CARE SPECIFIC INFO */}
                                    {step === 3 && serviceId === 2 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                                            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                                                {lang === "en" ? "Consultation Details" : "পরামর্শের বিস্তারিত"}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "Type of Doctor" : "ডাক্তারের ধরণ"} name="docType" value={formData.docType} onChange={handleInput} error={errors.docType} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="General Physician">General Physician (সাধারণ চিকিৎসক)</option>
                                                    <option value="Specialist">Specialist (বিশেষজ্ঞ)</option>
                                                </SelectField>

                                                {formData.docType === "Specialist" && (
                                                    <SelectField label={lang === "en" ? "Department" : "বিভাগ"} name="docSpecialistDept" value={formData.docSpecialistDept} onChange={handleInput}>
                                                        <option value="">{lang === "en" ? "Select department..." : "বিভাগ নির্বাচন করুন..."}</option>
                                                        <option value="Cardiology">Cardiology</option>
                                                        <option value="Diabetes & Endocrinology">Diabetes & Endocrinology</option>
                                                        <option value="Orthopedic">Orthopedic</option>
                                                        <option value="Neurology">Neurology</option>
                                                        <option value="Dermatology">Dermatology</option>
                                                        <option value="Nephrology">Nephrology</option>
                                                        <option value="Ophthalmology">Ophthalmology</option>
                                                        <option value="ENT">ENT</option>
                                                        <option value="Respiratory">Respiratory</option>
                                                        <option value="Other">Other</option>
                                                    </SelectField>
                                                )}
                                            </div>

                                            <SelectField label={lang === "en" ? "Visit Type" : "ভিজিটের ধরণ"} name="docVisitType" value={formData.docVisitType} onChange={handleInput} error={errors.docVisitType} required fullWidth>
                                                <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                <option value="Home Visit">Home Visit (বাসায় এসে দেখা)</option>
                                                <option value="Hospital Escort">Hospital Escort (হাসপাতালে গিয়ে দেখানো)</option>
                                                <option value="Video Call">Video Call / Telemedicine (ভিডিও কল)</option>
                                            </SelectField>

                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {lang === "en" ? "Main Symptoms / Complaint" : "প্রধান সমস্যা বা লক্ষণসমূহ"} <span className="text-red-500">*</span>
                                                </label>
                                                <textarea name="docSymptoms" value={formData.docSymptoms} onChange={handleInput} className={`w-full bg-white dark:bg-gray-800 border ${errors.docSymptoms ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 resize-none h-20 placeholder:text-gray-400`} />
                                                {errors.docSymptoms && <span className="text-xs text-red-500">{errors.docSymptoms}</span>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "Taking any medications?" : "নিয়মিত কোনো ওষুধ খাচ্ছেন?"} name="docTakingMeds" value={formData.docTakingMeds} onChange={handleInput}>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Yes">Yes (হ্যাঁ)</option>
                                                    <option value="No">No (না)</option>
                                                </SelectField>
                                                
                                                <SelectField label={lang === "en" ? "Preferred Language" : "পছন্দের ভাষা"} name="docLanguage" value={formData.docLanguage} onChange={handleInput}>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Bengali only">Bengali only (শুধু বাংলা)</option>
                                                    <option value="Bengali & English">Bengali & English (বাংলা এবং ইংরেজি)</option>
                                                    <option value="Other">Other</option>
                                                </SelectField>
                                            </div>

                                            {formData.docTakingMeds === "Yes" && (
                                                <div className="space-y-1">
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        {lang === "en" ? "List of Current Medications" : "চলমান ওষুধের তালিকা"}
                                                    </label>
                                                    <textarea name="docMedsList" value={formData.docMedsList} onChange={handleInput} placeholder="e.g. Napa Extend 500mg (1-1-1)" className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 resize-none h-16 placeholder:text-gray-400" />
                                                </div>
                                            )}

                                            <InputField label={lang === "en" ? "Preferred Doctor/Hospital (Optional)" : "পছন্দের কোনো ডাক্তার/হাসপাতাল (যদি থাকে)"} name="docPref" value={formData.docPref} onChange={handleInput} fullWidth />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <InputField label={lang === "en" ? "Preferred Date" : "পছন্দের তারিখ"} name="docDate" value={formData.docDate} onChange={handleInput} error={errors.docDate} type="date" required />
                                                
                                                <SelectField label={lang === "en" ? "Preferred Time Slot" : "পছন্দের সময়"} name="docTimeSlot" value={formData.docTimeSlot} onChange={handleInput} error={errors.docTimeSlot} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Morning">Morning (8-11am)</option>
                                                    <option value="Late Morning">Late Morning (11am-1pm)</option>
                                                    <option value="Afternoon">Afternoon (2-5pm)</option>
                                                </SelectField>
                                            </div>

                                        </motion.div>
                                    )}

                                    {/* STEP 3: MEDICINE SPECIFIC INFO */}
                                    {step === 3 && serviceId === 3 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                                            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                                                {lang === "en" ? "Medicine Order Details" : "ওষুধের বিস্তারিত"}
                                            </h3>

                                            <SelectField label={lang === "en" ? "Order Type" : "অর্ডারের ধরণ"} name="medOrderType" value={formData.medOrderType} onChange={handleInput} error={errors.medOrderType} required fullWidth>
                                                <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                <option value="I have a prescription">I have a prescription (আমার কাছে প্রেসক্রিপশন আছে)</option>
                                                <option value="I know the medicine names">I know the medicine names (আমি ওষুধের নাম জানি)</option>
                                            </SelectField>

                                            {formData.medOrderType === "I have a prescription" && (
                                                <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/30">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{lang === "en" ? "Upload Prescription" : "প্রেসক্রিপশন আপলোড করুন"}</p>
                                                        <p className="text-xs text-gray-500">(Required for this option)</p>
                                                    </div>
                                                    <button type="button" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <UploadCloud size={16} /> Upload
                                                    </button>
                                                </div>
                                            )}

                                            {formData.medOrderType === "I know the medicine names" && (
                                                <div className="space-y-1">
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        {lang === "en" ? "Medicine Names & Dosages" : "ওষুধের নাম এবং মাত্রা"} <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea name="medNames" value={formData.medNames} onChange={handleInput} placeholder="e.g. Napa Extend 500mg, Seclo 20mg" className={`w-full bg-white dark:bg-gray-800 border ${errors.medNames ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 resize-none h-20 placeholder:text-gray-400`} />
                                                    {errors.medNames && <span className="text-xs text-red-500">{errors.medNames}</span>}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "Duration" : "কতদিনের জন্য লাগবে?"} name="medDays" value={formData.medDays} onChange={handleInput} error={errors.medDays} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="7 days">7 days</option>
                                                    <option value="15 days">15 days</option>
                                                    <option value="1 month">1 month</option>
                                                    <option value="Custom">Custom</option>
                                                </SelectField>

                                                <SelectField label={lang === "en" ? "Delivery Type" : "ডেলিভারির ধরণ"} name="medDeliveryType" value={formData.medDeliveryType} onChange={handleInput} error={errors.medDeliveryType} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="One-time delivery">One-time delivery (এককালীন)</option>
                                                    <option value="Monthly auto-reorder (Subscription)">Monthly auto-reorder (প্রতি মাসে একবার)</option>
                                                </SelectField>
                                            </div>

                                            <SelectField label={lang === "en" ? "Does patient need help taking medicine?" : "রোগীকে ওষুধ খাইয়ে দেওয়ার জন্য কারো সাহায্য লাগবে?"} name="medNeedHelp" value={formData.medNeedHelp} onChange={handleInput} error={errors.medNeedHelp} required fullWidth>
                                                <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                <option value="Yes">Yes, caregiver visit needed (হ্যাঁ, সাহায্য লাগবে)</option>
                                                <option value="No">No (না)</option>
                                            </SelectField>

                                            <InputField label={lang === "en" ? "Any known medicine allergies?" : "ওষুধে কোনো এলার্জি আছে? (যদি থাকে)"} name="medAllergies" value={formData.medAllergies} onChange={handleInput} placeholder="e.g. Penicillin, Aspirin" fullWidth />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "When is delivery needed?" : "কবে ডেলিভারি লাগবে?"} name="medWhenNeeded" value={formData.medWhenNeeded} onChange={handleInput} error={errors.medWhenNeeded} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Today (urgent)">Today (আজকেই)</option>
                                                    <option value="Specific date">Specific date (নির্দিষ্ট দিনে)</option>
                                                </SelectField>

                                                {formData.medWhenNeeded === "Specific date" && (
                                                    <InputField label={lang === "en" ? "Target Delivery Date" : "ডেলিভারির তারিখ"} name="medTargetDate" value={formData.medTargetDate} onChange={handleInput} error={errors.medTargetDate} type="date" required />
                                                )}
                                            </div>

                                        </motion.div>
                                    )}

                                    {/* STEP 3: EMERGENCY SPECIFIC INFO */}
                                    {step === 3 && serviceId === 4 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3 mb-4">
                                                <AlertCircle className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" size={20} />
                                                <p className="text-sm font-medium text-amber-800 dark:text-amber-400 leading-snug">
                                                    {lang === "en" 
                                                        ? "NOTE: This is ADVANCE PRE-REGISTRATION only. For real emergencies, use the SOS button on our website." 
                                                        : "দ্রষ্টব্য: এটি শুধুমাত্র অগ্রিম প্রি-রেজিস্ট্রেশনের জন্য। প্রকৃত ইমারজেন্সি বা জরুরি অবস্থায় আমাদের ওয়েবসাইটের SOS বাটনটি ব্যবহার করুন।"}
                                                </p>
                                            </div>

                                            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                                                {lang === "en" ? "Backup Contacts & Preferences" : "বিকল্প যোগাযোগ এবং হাসপাতাল"}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <InputField label={lang === "en" ? "2nd Emergency Contact Name" : "২য় ইমারজেন্সি পরিচিত ব্যক্তির নাম"} name="emgContactName" value={formData.emgContactName} onChange={handleInput} error={errors.emgContactName} required />
                                                <InputField label={lang === "en" ? "2nd Emergency Contact Phone" : "তার ফোন নম্বর"} name="emgContactPhone" value={formData.emgContactPhone} onChange={handleInput} error={errors.emgContactPhone} type="tel" required />
                                            </div>

                                            <InputField label={lang === "en" ? "Relation to Patient (e.g. Uncle, Neighbour)" : "রোগীর সাথে সম্পর্ক (যেমন: চাচা, প্রতিবেশী)"} name="emgContactRelation" value={formData.emgContactRelation} onChange={handleInput} error={errors.emgContactRelation} required fullWidth />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <InputField label={lang === "en" ? "Nearest Hospital to Home" : "বাসার সবচেয়ে কাছের হাসপাতাল"} name="emgNearestHospital" value={formData.emgNearestHospital} onChange={handleInput} error={errors.emgNearestHospital} required />
                                                
                                                <SelectField label={lang === "en" ? "Hospital Preference" : "হাসপাতালের পছন্দ"} name="emgHospitalPref" value={formData.emgHospitalPref} onChange={handleInput} error={errors.emgHospitalPref} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Government Hospital">Government Hospital</option>
                                                    <option value="Private Hospital">Private Hospital</option>
                                                    <option value="Any - fastest available">Any - fastest available (যেকোনো, সবচেয়ে দ্রুত যেটি)</option>
                                                </SelectField>
                                            </div>

                                            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-4 mt-6">
                                                {lang === "en" ? "Risk Assessment Details" : "ঝুঁকি মূল্যায়ন"}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "Had heart attack or stroke before?" : "আগে হার্ট অ্যাটাক বা স্ট্রোক হয়েছে?"} name="emgHistory" value={formData.emgHistory} onChange={handleInput} error={errors.emgHistory} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Yes">Yes (হ্যাঁ)</option>
                                                    <option value="No">No (না)</option>
                                                </SelectField>
                                                
                                                <SelectField label={lang === "en" ? "May require oxygen support?" : "অক্সিজেন সাপোর্টের প্রয়োজন হতে পারে?"} name="emgOxygen" value={formData.emgOxygen} onChange={handleInput} error={errors.emgOxygen} required>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Yes">Yes (হ্যাঁ)</option>
                                                    <option value="No">No (না)</option>
                                                    <option value="Not sure">Not sure (নিশ্চিত নই)</option>
                                                </SelectField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <SelectField label={lang === "en" ? "Does patient have health insurance?" : "রোগীর কোনো হেলথ ইন্স্যুরেন্স আছে?"} name="emgHasInsurance" value={formData.emgHasInsurance} onChange={handleInput}>
                                                    <option value="">{lang === "en" ? "Select..." : "নির্বাচন করুন..."}</option>
                                                    <option value="Yes">Yes (হ্যাঁ)</option>
                                                    <option value="No">No (না)</option>
                                                </SelectField>

                                                {formData.emgHasInsurance === "Yes" && (
                                                    <InputField label={lang === "en" ? "Insurance Company & Policy Number" : "কোম্পানির নাম এবং পলিসি নম্বর"} name="emgInsuranceInfo" value={formData.emgInsuranceInfo} onChange={handleInput} />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {lang === "en" ? "Any special access instructions (Optional)" : "বাসায় প্রবেশের বিশেষ দিকনির্দেশনা (ঐচ্ছিক)"}
                                                </label>
                                                <textarea name="emgAccessInfo" value={formData.emgAccessInfo} onChange={handleInput} placeholder={lang === "en" ? "Building gate code, floor number, landmarks..." : "গেটের কোড, ফ্লোর নম্বর, রাস্তা চেনার উপায়..."} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 resize-none h-16 placeholder:text-gray-400" />
                                            </div>

                                        </motion.div>
                                    )}

                                </div>
                            )}

                        </div>

                        {/* ── Modal Footer ──────────────────────────────────────── */}
                        {!isSuccess && (
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col gap-3 rounded-b-3xl mt-auto">
                                {Object.keys(errors).length > 0 && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">
                                        <AlertCircle size={16} />
                                        {lang === "en" ? "Please fill all required fields correctly." : "অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন।"}
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <button 
                                        onClick={step === 1 ? onClose : prevStep}
                                        className="text-gray-600 dark:text-gray-400 font-medium px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
                                    >
                                        {step === 1 ? (lang === "en" ? "Cancel" : "বাতিল") : (lang === "en" ? "Back" : "পেছনে")}
                                    </button>
                                    
                                    {step < totalSteps ? (
                                        <button 
                                            onClick={nextStep}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                                        >
                                            {lang === "en" ? "Next Step" : "পরবর্তী ধাপ"} <ChevronRight size={18} />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={submitForm}
                                            disabled={isSubmitting}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 min-w-[140px]"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                lang === "en" ? "Submit Request" : "জমা দিন"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// ── Shared UI Helpers ───────────────────────────────────────────────────────

function InputField({ label, name, value, onChange, error, type = "text", required, fullWidth }: any) {
    return (
        <div className={`space-y-1 ${fullWidth ? 'w-full' : 'w-full'}`}>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex justify-between">
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
                {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </label>
            <input 
                type={type} name={name} value={value} onChange={onChange}
                className={`w-full bg-white dark:bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400`}
            />
        </div>
    );
}

function SelectField({ label, name, value, onChange, error, required, fullWidth, children }: any) {
    return (
        <div className={`space-y-1 ${fullWidth ? 'w-full' : 'w-full'}`}>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex justify-between">
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
                {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </label>
            <select 
                name={name} value={value} onChange={onChange}
                className={`w-full bg-white dark:bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 appearance-none`}
            >
                {children}
            </select>
        </div>
    );
}
