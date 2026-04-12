import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with the public anon key
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ROLES = ['customer', 'caregiver', 'manager', 'doctor', 'partner', 'admin'];
const COUNT_PER_ROLE = 1; // Changed to 1 to help prevent rate-limits
const DEFAULT_PASS = 'password123';

export async function GET() {
    const results = [];
    
    try {
        for (const role of ROLES) {
            for (let i = 1; i <= COUNT_PER_ROLE; i++) {
                const email = `${role}${i}@demo.com`;
                
                // 1. Try to sign up the mock user
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password: DEFAULT_PASS,
                    options: {
                        data: {
                            full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)} ${i}`,
                        }
                    }
                });

                let userId = authData.user?.id;

                if (authError && authError.message.includes('already registered')) {
                     // Try to sign in to get the user ID
                     const { data: signInData } = await supabase.auth.signInWithPassword({
                         email,
                         password: DEFAULT_PASS,
                     });
                     userId = signInData.user?.id;
                     if (!userId) {
                         results.push({ email, status: 'already_exists_but_login_failed' });
                         continue;
                     }
                } else if (authError) {
                     results.push({ email, status: 'error', reason: authError.message });
                     continue;
                }

                // 2. Add to user_roles table
                if (userId) {
                    const { error: roleError } = await supabase
                        .from('user_roles')
                        .insert({
                            user_id: userId,
                            role: role
                        });
                        
                    if (roleError) {
                        results.push({ email, status: 'auth_created_but_role_failed', reason: roleError.message });
                    } else {
                        results.push({ email, status: 'success' });
                    }
                }
            }
        }

        return NextResponse.json({
            message: 'Seed process completed.',
            results
        });
        
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
