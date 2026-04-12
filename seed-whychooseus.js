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
    console.log("Restoring WhyChooseUs to site_sections...");
    
    const sectionData = {
        component_id: "WhyChooseUs",
        is_visible: true,
        show_in_nav: false,
        nav_label_en: "Why Choose Us",
        nav_label_bn: "কেন আমরা",
        nav_href: "#why-choose-us",
        order_index: 4,
        content_data: {} // Uses default in constants if empty
    };

    const { data: existing, error: fetchErr } = await supabase.from('site_sections').select('id').eq('component_id', 'WhyChooseUs').single();

    if (existing) {
        console.log("WhyChooseUs already exists.");
    } else {
        const { error } = await supabase.from('site_sections').insert([sectionData]);
        if (error) console.error("Error inserting:", error);
        else console.log("Success! Restored WhyChooseUs.");
    }
}

seed();
