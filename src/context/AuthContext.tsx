import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserProfile } from '../types';
import { supabase } from '../utils/supabase';
import type { Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: AuthError }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: AuthError }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true,
  });

  // Get or create user profile (simplified version)
  const getUserProfile = async (userId: string, email: string): Promise<User | null> => {
    try {
      // Try to get existing profile from profiles table
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        return {
          id: profile.user_id,
          email,
          name: profile.name,
          role: profile.role || 'researcher',
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };
      }

      // If profiles table doesn't exist or profile doesn't exist, create a basic user object
      if (fetchError) {
        // Profiles table not found or profile does not exist, using basic user object
        return {
          id: userId,
          email,
          name: email.split('@')[0],
          role: 'researcher',
        };
      }

      // Try to create profile in database
      const newProfile = {
        user_id: userId,
        name: email.split('@')[0],
        role: 'researcher' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        // Could not create profile in database, using basic user object
        return {
          id: userId,
          email,
          name: email.split('@')[0],
          role: 'researcher',
        };
      }

      return {
        id: createdProfile.user_id,
        email,
        name: createdProfile.name,
        role: createdProfile.role,
        avatar_url: createdProfile.avatar_url,
        created_at: createdProfile.created_at,
        updated_at: createdProfile.updated_at,
      };
    } catch (error) {
      // Error in getUserProfile, using basic user object
      // Fallback to basic user object
      return {
        id: userId,
        email,
        name: email.split('@')[0],
        role: 'researcher',
      };
    }
  };

  const setSession = async (session: Session | null) => {

    if (session?.user) {
      const userProfile = await getUserProfile(session.user.id, session.user.email!);

      setAuthState({
        user: userProfile,
        session,
        isAuthenticated: !!userProfile,
        loading: false,
      });
    } else {

      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });



      if (error) {
        console.error('Login error:', error);
        return { error };
      }


      await setSession(data.session);
      return {};
    } catch (error) {
      console.error('Login catch error:', error);
      return { error: error as AuthError };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Note: User will need to verify email before they can sign in
      return {};
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error as AuthError };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!authState.user) {
      return { error: 'No authenticated user' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', authState.user.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      // Update local state
      const updatedUser = {
        ...authState.user,
        name: data.name,
        role: data.role,
        avatar_url: data.avatar_url,
        updated_at: data.updated_at,
      };

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return { data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  useEffect(() => {

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {

      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {

      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      logout, 
      register, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
