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

async function deleteSections() {
    console.log("Deleting WhyChooseUs and Testimonials from site_sections...");

    const { data, error } = await supabase
        .from('site_sections')
        .delete()
        .in('component_id', ['WhyChooseUs', 'Testimonials']);
        
    if (error) {
        console.error("Error deleting sections:", error);
    } else {
        console.log("Success! Deleted WhyChooseUs and Testimonials.");
    }
}

deleteSections();
