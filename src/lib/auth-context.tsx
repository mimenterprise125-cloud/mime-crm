import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "sales" | "operations" | "accounts";
  phone: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile with error handling
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      clearTimeout(timeoutId);

      if (!error && data) {
        setUserProfile(data);
        return true;
      } else {
        console.warn("Failed to fetch user profile:", error);
        setUserProfile(null);
        return false;
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setUserProfile(null);
      return false;
    }
  }, []);

  useEffect(() => {
    // Flag to prevent multiple initializations in StrictMode
    let isInitialized = false;
    let loadingTimeout: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
        isInitialized = true;
      }
    };

    // Set a hard timeout to ensure loading is never stuck
    loadingTimeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn("Auth initialization timeout - forcing completion");
        setLoading(false);
        isInitialized = true;
      }
    }, 10000); // 10 second absolute timeout

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        // Fetch profile with timeout
        try {
          await fetchUserProfile(session.user.id);
        } catch (error) {
          console.error("Auth state change profile fetch failed:", error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Listen for visibility changes - refresh auth when tab becomes active
    const handleVisibilityChange = async () => {
      if (!document.hidden && isInitialized) {
        // Tab became active again - refresh session silently
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
        } catch (error) {
          console.error("Visibility change session refresh failed:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      clearTimeout(loadingTimeout);
      subscription?.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          phone: "",
          created_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear local state first
      setUser(null);
      setUserProfile(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Clear session storage
      sessionStorage.clear();
      localStorage.removeItem("sb-auth-token");
      localStorage.removeItem("sb-refresh-token");
      
      if (error) {
        console.warn("Supabase signOut warning:", error);
      }
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear local state even if Supabase signOut fails
      setUser(null);
      setUserProfile(null);
      sessionStorage.clear();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
