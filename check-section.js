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

async function check() {
    const id = "5be4638b-7c4f-4944-b210-95b17b84e7c8";
    const { data, error } = await supabase.from('site_sections').select('*').eq('id', id).single();
    
    if (error) {
        console.error("Error fetching:", error);
    } else {
        console.log("Section is:", data.component_id);
    }
}

check();
