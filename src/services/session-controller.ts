import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const sessionController = async (): Promise<{ session: Session }> => {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error('User not authenticated');
    }

    return { session };
};

export { sessionController };
