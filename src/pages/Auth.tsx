import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Fingerprint, 
  ChevronRight, 
  Zap,
  Globe,
  Mail,
  Lock,
  Youtube
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { firebaseService, auth } from '@/src/services/firebase';
import { useNotify } from '@/src/contexts/NotificationContext';
import { GoogleAuthProvider } from 'firebase/auth';

export default function Auth() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { notify } = useNotify();

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val) setEmailError('Email is required');
    else if (!/^\S+@\S+\.\S+$/.test(val)) setEmailError('Invalid email format');
    else setEmailError('');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (!val) setPasswordError('Password is required');
    else if (val.length < 6) setPasswordError('Password must be at least 6 characters');
    else setPasswordError('');
  };
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const navigate = useNavigate();

  const handleAuthResult = async (result: any) => {
    const profile = await firebaseService.getUserProfile(result.user.uid);
    if (!profile) {
      await firebaseService.createUserProfile(
        result.user.uid, 
        result.user.email, 
        result.user.displayName
      );
    }
    
    // Save tokens if available (for OAuth)
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
       // Ideally you'd save this securely in firestore under the users tokens subcollection.
       // For demo purposes we log it or save to local storage.
       localStorage.setItem('youtube_access_token', credential.accessToken);
    }

    notify(`Welcome, ${result.user.displayName || 'User'}. Identity sync complete.`, "success", "Access Granted");
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setIsSyncing(true);
    notify("Initiating Google/YouTube verification sequence...", "smart", "Hub Sync");
    try {
      const result = await firebaseService.signInWithGoogle();
      await handleAuthResult(result);
    } catch (error: any) {
      console.error("Auth Sync Failure:", error);
      let errorMsg = error?.message || "Distorted signal during identity verification.";
      let notificationType: "error" | "success" | "info" | "smart" = "error";
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
         errorMsg = 'OAuth window was closed before completing the sync.';
         notificationType = "info";
      }
      notify(errorMsg, notificationType, "Sync Interrupted");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return notify("Email and Password required.", "error");
    
    setIsSyncing(true);
    notify("Verifying structural identity...", "info");
    try {
      let result;
      if (mode === 'signup') {
        result = await firebaseService.signUpWithEmail(email, password);
      } else {
        result = await firebaseService.signInWithEmail(email, password);
      }
      await handleAuthResult(result);
    } catch (error: any) {
      console.error("Email Auth Error:", error);
      let errorMsg = error.message;
      if (error.code === 'auth/email-already-in-use') errorMsg = 'Identity already synchronized.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMsg = 'Invalid structural email or password.';
      
      notify(errorMsg, "error", "Verification Failed");
      
      // If the error indicates email/password is not enabled in Firebase
      if (error.message.includes('auth/operation-not-allowed')) {
         notify("Email/Password Auth is not enabled. Please enable it in the Firebase Console.", "info", "Setup Required");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleMode = () => {
     navigate(mode === 'login' ? '/auth?mode=signup' : '/auth?mode=login');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] flex items-center justify-center p-6 relative overflow-hidden pt-20 font-sans selection:bg-glow-blue/30">
      {/* Premium Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-glow-blue/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-glow-purple/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden relative">
          
          {/* Subtle Top Highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="p-10 md:p-12">
            <header className="text-center mb-10">
              <div className="w-16 h-16 mx-auto bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 relative group overflow-hidden shadow-inner">
                 <div className="absolute inset-0 bg-glow-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur border-glow-blue/50" />
                 <Fingerprint className="w-8 h-8 text-white/90 group-hover:scale-105 transition-transform duration-500 ease-out" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">
                {mode === 'signup' ? 'Create Hub ID' : 'Sign in to Hub'}
              </h1>
              <p className="text-sm font-medium text-[#A1A1A6] tracking-wide">
                {mode === 'signup' ? 'Join the next generation of creators.' : 'Continue to the Omni-System.'}
              </p>
            </header>

            <div className="space-y-6">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1A6] group-focus-within:text-white transition-colors" />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={cn(
                        "w-full bg-black/40 border p-4 pl-12 rounded-xl text-sm font-medium focus:outline-none transition-all duration-300 text-white placeholder:text-[#86868B]",
                        emailError ? "border-red-500/50 focus:border-red-500 focus:bg-black/60 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : "border-white/10 focus:border-white/30 focus:bg-black/60 shadow-[0_0_0_2px_rgba(255,255,255,0)] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.05)]"
                      )}
                    />
                  </div>
                  {emailError && <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-xs font-semibold text-red-500 pl-2">{emailError}</motion.p>}
                </div>
                
                <div className="space-y-3">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1A6] group-focus-within:text-white transition-colors" />
                    <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={cn(
                        "w-full bg-black/40 border p-4 pl-12 rounded-xl text-sm font-medium focus:outline-none transition-all duration-300 text-white placeholder:text-[#86868B]",
                        passwordError ? "border-red-500/50 focus:border-red-500 focus:bg-black/60 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : "border-white/10 focus:border-white/30 focus:bg-black/60 shadow-[0_0_0_2px_rgba(255,255,255,0)] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.05)]"
                      )}
                    />
                  </div>
                  {passwordError && <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-xs font-semibold text-red-500 pl-2">{passwordError}</motion.p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSyncing}
                  className="mt-2 w-full py-4 bg-white text-black hover:bg-white/90 font-bold tracking-wide text-sm transition-all duration-300 flex items-center justify-center gap-2 rounded-xl disabled:opacity-50 active:scale-[0.98]"
                >
                  {isSyncing ? (
                     <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                     <>
                        {mode === 'login' ? "Continue" : "Create Account"}
                        <ChevronRight className="w-4 h-4 opacity-50" />
                     </>
                  )}
                </button>
              </form>
              
              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#86868B] my-6">
                <div className="h-px bg-white/10 flex-1" />
                <span>or continue with</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={isSyncing}
                className="w-full py-4 bg-black/40 border border-white/10 hover:border-white/20 hover:bg-black/60 font-bold text-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 rounded-xl"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                {isSyncing ? "Connecting..." : "Google Account"}
              </button>
              
              <button
                 onClick={toggleMode}
                 className="w-full text-center text-sm font-medium text-[#86868B] hover:text-white transition-colors pt-4 block"
              >
                 {mode === 'login' ? "Don't have an ID? Create one" : "Already have an ID? Sign in"}
              </button>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="bg-black/40 border-t border-white/5 p-4 flex justify-between px-8">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] font-semibold text-[#A1A1A6] uppercase tracking-wider">System Operational</span>
             </div>
             <div className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                <Lock className="w-3 h-3 text-[#A1A1A6]" />
                <span className="text-[10px] font-semibold text-[#A1A1A6] uppercase tracking-wider">E2E Encrypted</span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

