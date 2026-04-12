const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');

const getEnv = (key) => {
    const match = envFile.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].replace(/["']/g, '').trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Seeding WhatWeDo to site_sections...");
    
    const sectionData = {
        component_id: "WhatWeDo",
        is_visible: true,
        show_in_nav: true,
        nav_label_en: "What We Do",
        nav_label_bn: "আমরা যা করি",
        nav_href: "#what-we-do",
        order_index: 2,
        content_data: {
            badge: { bn: "আমরা যা করি", en: "What We Do" },
            title: { bn: "আপনার প্রিয়জনের যত্নে আমাদের প্রতিশ্রুতি", en: "Our Commitment to Caring for Your Loved Ones" },
            paragraphs: [
                { bn: "প্রিয় মানুষদের থেকে দূরে থাকা সহজ নয়। জীবনের প্রয়োজনে অনেকেই দেশের বাইরে বা ব্যস্ত শহরে থাকেন, কিন্তু মন সবসময় পড়ে থাকে বাবা-মা ও আপনজনদের কাছে। তারা কেমন আছেন, সময়মতো খাচ্ছেন কিনা, অসুস্থ হলে পাশে কেউ আছে কিনা - এই দুশ্চিন্তা যেন আপনাকে একা বহন করতে না হয়, সেই দায়িত্বই নেয় নির্ভার কেয়ার।", en: "Being away from your loved ones is never easy. Many people live abroad or in busy cities due to work or life commitments, yet their hearts remain close to their parents and family members. Concerns about whether they are eating on time, staying well, or receiving proper care during illness can often become a constant worry. Nirvaar Care is here to share that responsibility with you." },
                { bn: "আমরা শুধু একটি সেবা প্রদান করি না - আমরা চেষ্টা করি আপনার পরিবারের একজন হয়ে উঠতে। যত্ন, সম্মান ও আন্তরিকতার সাথে আমরা নিশ্চিত করি, আপনার প্রিয়জনরা সবসময় নিরাপদ, স্বস্তিতে এবং ভালো আছেন।", en: "We are not just a service provider — we strive to become a trusted extension of your family. With compassion, respect, and sincere care, we ensure that your loved ones remain safe, comfortable, and well cared for at all times." }
            ]
        }
    };

    const { data: existing, error: fetchErr } = await supabase.from('site_sections').select('id').eq('component_id', 'WhatWeDo').single();

    if (existing) {
        console.log("Found existing WhatWeDo section, updating...");
        const { error } = await supabase.from('site_sections').update(sectionData).eq('id', existing.id);
        if (error) console.error("Error updating:", error);
        else console.log("Success! Updated WhatWeDo.");
    } else {
        console.log("No existing WhatWeDo found, inserting...");
        const { error } = await supabase.from('site_sections').insert([sectionData]);
        if (error) console.error("Error inserting:", error);
        else console.log("Success! Inserted WhatWeDo.");
    }
}

seed();
