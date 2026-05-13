"use client";

import { ReactNode, useEffect, useState } from "react";
import { GoogleAuthProvider, getRedirectResult, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { Loader2, Lock, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/firebase";
import { getHubRole, type HubRole } from "@/lib/hubRoles";

interface HubSession {
  user: User;
  role: HubRole;
  signOut: () => Promise<void>;
}

interface HubAuthGateProps {
  children: (session: HubSession) => ReactNode;
}

export function HubAuthGate({ children }: HubAuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<HubRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Google sign-in redirect failed:", error);
      setAuthError("Google sign-in failed. Please try again.");
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setRole(getHubRole(currentUser?.email));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleGoogleSignIn() {
    setAuthError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setAuthError("Google sign-in failed. Please try again.");
    }
  }

  async function handleSignOut() {
    await signOut(auth);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <AuthShell
        icon={<Lock className="w-8 h-8 text-red-400" />}
        title="Writer Hub Login"
        description="Sign in with your approved GreyBrainer Google account to edit drafts, preview articles, and publish to the movie site."
      >
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200 transition"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Continue with Google
        </button>
        {authError && <p className="mt-4 text-sm text-red-300">{authError}</p>}
      </AuthShell>
    );
  }

  if (!role) {
    return (
      <AuthShell
        icon={<ShieldCheck className="w-8 h-8 text-amber-300" />}
        title="Access Not Enabled"
        description="This Google account is signed in, but it is not on the GreyBrainer editor list yet."
      >
        <div className="rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          Signed in as <span className="font-semibold text-white">{user.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-4 w-full flex items-center justify-center rounded-md bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </button>
      </AuthShell>
    );
  }

  return children({ user, role, signOut: handleSignOut });
}

function AuthShell({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-slate-800">
          {icon}
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-slate-400 mb-8">{description}</p>
        {children}
      </div>
    </div>
  );
}
