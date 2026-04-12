import { redirect } from 'next/navigation';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function DashboardRootRedirect() {
    // We handle the role-based routing dynamically here so that Next.js SPA Link clicks 
    // do not throw client 404s for a missing physical "page.tsx" at the /dashboard root.
    
    // Fallback to home if no valid cookie is found
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll() {},
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
        
    const role = roleData?.role;

    if (role === 'admin' || role === 'manager') {
        redirect('/admin');
    } else if (role) {
        redirect(`/dashboard/${role}`);
    } else {
        redirect('/');
    }
}
