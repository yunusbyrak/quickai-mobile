import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as Localization from 'expo-localization';
import { getInitialLanguage } from '@/i18n';

import { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/stores/profileStore';
import { useOnboardingStore } from '@/store/onboarding';


interface AuthContextState {
    initialized: boolean;
    session: Session | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
  }

export const AuthContext = createContext<AuthContextState>({
    initialized: false,
    session: null,
    signUp: async () => { },
    signIn: async () => { },
    signInWithGoogle: async () => { },
    signInWithApple: async () => { },
    resetPassword: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
    const [initialized, setInitialized] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();

    // Zustand store for profile
    const { fetchProfile, clearProfile, profile } = useProfileStore();
    const { completed: onboardingCompleted, reset: resetOnboarding } = useOnboardingStore();


    const createProfileWithLanguage = async (userId: string) => {

        const { data: currentProfile, error: fetchError } = await supabase
            .from('users')
            .select('lang')
            .eq('id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('❌ Error fetching current profile:', fetchError);
        }

        // If user already has a language set in their profile, keep it
        if (currentProfile?.lang) {
            await fetchProfile(userId);
            return;
        }

        // For new users or users without language: use saved preference or phone language
        const selectedLanguage = getInitialLanguage();

        // Update profile with selected language
        const { error } = await supabase.from('users').update({ lang: selectedLanguage }).eq('id', userId);

        if (error) {
            console.error('❌ Error updating language:', error);
        }

        // Fetch updated profile
        await fetchProfile(userId);
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('Error signing up:', error);
            throw error;
        }

        if (data.session) {
            setSession(data.session);

            // Load profile after signup with language detection
            if (data.user) {
                await createProfileWithLanguage(data.user.id);
            }
        }
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error signing in:', error);
            throw error;
        }

        if (data.session) {
            setSession(data.session);

            // Load profile with language detection
            if (data.user) {
                await createProfileWithLanguage(data.user.id);
            }
        }
    };

    const signInWithGoogle = async () => {
        // Configure Google Sign In
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        });

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });

                if (error) {
                    console.error('Error signing in with Google:', error);
                    throw error;
                }

                if (data.session) {
                    setSession(data.session);

                    // Load profile with language detection
                    if (data.user) {
                        await createProfileWithLanguage(data.user.id);
                    }
                }
            } else {
                throw new Error('No idToken received from Google.');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled Google Sign In');
                // User cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Google Sign In in progress');
                // Operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available');
                // Play services not available or outdated
            } else {
                console.error('Google Sign In error:', error);
                throw error;
            }
        }
    };

    const signInWithApple = async () => {
        if (Platform.OS !== 'ios') {
            return;
        }

        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            // Sign in via Supabase Auth with Apple ID token
            if (credential.identityToken) {
                const {
                    error,
                    data: { user, session: newSession },
                } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken,
                });

                if (error) {
                    console.error('Error signing in with Apple:', error);
                    throw error;
                }

                if (newSession && user) {
                    setSession(newSession);

                    // Load profile with language detection
                    await createProfileWithLanguage(user.id);
                }
            } else {
                throw new Error('No identityToken received from Apple.');
            }
        } catch (e: any) {
            // Handle different types of Apple Sign In cancellation/errors
            if (
                (e instanceof Error && e.message === 'ERR_REQUEST_CANCELED') ||
                (e instanceof Error && e.message.includes('canceled')) ||
                (e instanceof Error && e.message.includes('cancelled')) ||
                (e.code === 'ERR_REQUEST_CANCELED') ||
                (e.message && e.message.includes('user canceled')) ||
                (e.message && e.message.includes('authorization attempt'))
            ) {
                // Handle that the user canceled the sign-in flow - don't throw error
                return;
            } else {
                console.error('Apple Sign In error:', e);
                throw e;
            }
        }
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'exp://localhost:8081/resetPassword', // Redirect URL after reset
        });

        if (error) {
            console.error('Error sending reset password email:', error);
            throw error;
        }

        console.log('Reset password email sent to:', email);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error signing out:', error);
            throw error;
        } else {
            console.log('User signed out');

            // Clear profile on logout
            clearProfile();

            // Reset onboarding state
            resetOnboarding();

            // Navigate to welcome
            router.replace('/(onboarding)/welcome');
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                console.log('🔄 Initializing authentication...');

                // Get current session from Supabase (it handles persistence automatically)
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                if (error) {
                    console.error('❌ Error during getSession:', error);
                }

                console.log('🔍 Supabase session:', !!session);
                setSession(session);

                // Load profile if session exists
                if (session?.user && (!profile || profile.id !== session.user.id)) {
                    await fetchProfile(session.user.id);
                }

                console.log('✅ Auth initialization completed');
            } catch (error) {
                console.error('❌ Error during auth initialization:', error);
                setSession(null);
            }
        };

        // Launch initialization
        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Auth state change:', event, !!session);
            setSession(session);

            if (event === 'SIGNED_IN' && session?.user) {
                // Load profile only if needed
                if (!profile || profile.id !== session.user.id) {
                    await fetchProfile(session.user.id);
                }

                // Navigate after successful authentication
                console.log('🚀 SIGNED_IN event - Checking navigation...');

                // Get updated profile from store
                const { profile: currentProfile } = useProfileStore.getState();

                if (currentProfile) {
                    const needsOnboarding =
                        currentProfile.onboarding_completed === false ||
                        currentProfile.onboarding_completed === undefined ||
                        currentProfile.onboarding_completed === null;

                    if (needsOnboarding) {
                        console.log('🚀 Redirecting to onboarding');
                        router.replace('/onboarding');
                    } else {
                        console.log('🏠 Redirecting to main app');
                        router.replace('/(protected)/(tabs)');
                    }
                } else {
                    // If no profile yet, wait a bit and try again
                    console.log('⏳ No profile found, waiting for profile to load...');
                    setTimeout(() => {
                        const { profile: delayedProfile } = useProfileStore.getState();
                        if (delayedProfile) {
                            const needsOnboarding =
                                delayedProfile.onboarding_completed === false ||
                                delayedProfile.onboarding_completed === undefined ||
                                delayedProfile.onboarding_completed === null;

                            if (needsOnboarding) {
                                console.log('🚀 Delayed redirect to onboarding');
                                router.replace('/onboarding');
                            } else {
                                console.log('🏠 Delayed redirect to main app');
                                router.replace('/(protected)/(tabs)');
                            }
                        }
                    }, 500);
                }
            } else if (event === 'SIGNED_OUT') {
                // Clear profile on logout
                clearProfile();
                resetOnboarding();

                // Clear ALL MMKV caches
                console.log('🗑️ SIGNED_OUT event - Clearing all MMKV caches...');
                debug.clearAll();
                console.log('✅ All MMKV caches have been cleared');
            }
        });

        setInitialized(true);

        // Cleanup function
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                initialized,
                session,
                signUp,
                signIn,
                signInWithGoogle,
                signInWithApple,
                resetPassword,
                signOut,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
