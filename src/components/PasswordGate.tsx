"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AUTH_KEY = "chai_stand_auth";

interface AuthContextType {
  isAuthed: boolean;
}

const AuthContext = createContext<AuthContextType>({ isAuthed: false });

export function useAuth() {
  return useContext(AuthContext);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [storedHash, setStoredHash] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const snap = await getDoc(doc(db, "config", "sitePassword"));
        if (snap.exists()) {
          setStoredHash(snap.data().hash);
        }
      } catch (e) {
        console.error("Could not fetch auth config:", e);
      }

      // Check if already authenticated this session
      const saved = sessionStorage.getItem(AUTH_KEY);
      if (saved === "true") {
        setIsAuthed(true);
      }

      setChecking(false);
    }

    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!storedHash) return;

    const inputHash = await hashPassword(input);

    if (inputHash === storedHash) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setIsAuthed(true);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  }

  if (checking) {
    return (
      <div className="gate-wrapper">
        <p style={{ color: "#AB5F2D", fontFamily: "Courier New, monospace" }}>brewing...</p>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="gate-wrapper">
        <div className="gate-box">
          <div className="gate-icon">☕</div>
          <h1 className="gate-title">The Chai Stand</h1>
          <p className="gate-sub">Members only. Enter the password.</p>
          <form onSubmit={handleSubmit} className="gate-form">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="password"
              className={`gate-input ${error ? "gate-error" : ""}`}
              autoFocus
              disabled={!storedHash}
            />
            <button type="submit" className="gate-btn" disabled={!storedHash}>
              {storedHash ? "Enter" : "loading..."}
            </button>
          </form>
          {error && <p className="gate-err-msg">wrong password!</p>}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthed }}>
      {children}
    </AuthContext.Provider>
  );
}