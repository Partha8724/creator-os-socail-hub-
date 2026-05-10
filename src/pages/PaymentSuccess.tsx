import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useNotify } from '@/src/contexts/NotificationContext';
import { auth, firebaseService, db } from '@/src/services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const tierId = searchParams.get('tier') || 'pro';
      
      if (!sessionId) {
        setStatus('error');
        setErrorMsg('Missing session token. Node upgrade aborted.');
        return;
      }

      try {
        const response = await fetch(`/api/verify-checkout?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          // Update Firebase tier if user is logged in
          const currentUser = auth.currentUser;
          if (currentUser) {
             const userRef = doc(db, 'users', currentUser.uid);
             await updateDoc(userRef, { tier: data.tier });
             notify(`Neural Node Upgraded to ${data.tier.toUpperCase()} successfully.`, 'success');
          } else {
             notify('Payment successful, but please sign in to sync your Neural Node upgrade.', 'info');
             // Redirecting to login to claim it... or just dashboard
          }
          
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          setStatus('error');
          setErrorMsg(data.status ? `Payment Status: ${data.status}` : 'Verification failed.');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMsg(error.message || 'System disruption during verification.');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, notify]);

  return (
    <div className="flex flex-col h-full bg-dark-bg text-[#F5F5F7] animate-in fade-in duration-700 items-center justify-center p-6 text-center">
      <div className="max-w-md w-full smart-card p-10 bg-[#1C1C1E] relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-glow-blue/10 to-glow-purple/10 opacity-50 pointer-events-none" />
         
         {status === 'verifying' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
             <Loader2 className="w-16 h-16 text-glow-blue animate-spin mb-6" />
             <h2 className="text-2xl font-black mb-2">Verifying Node Upgrade...</h2>
             <p className="text-[#A1A1A6] font-medium text-sm">Synchronizing with payment network.</p>
           </motion.div>
         )}

         {status === 'success' && (
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-glow-blue/20 flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 rounded-full animate-ping bg-glow-blue/30" />
                 <CheckCircle2 className="w-10 h-10 text-glow-blue" />
             </div>
             <h2 className="text-3xl font-black text-glow-blue mb-4 uppercase tracking-widest">Upgrade Secured</h2>
             <p className="text-[#F5F5F7] font-medium mb-6">Your Neural Node has been successfully unlocked.</p>
             <p className="text-xs text-[#86868B] uppercase tracking-wider animate-pulse flex items-center gap-2">
               <Sparkles className="w-3 h-3 text-glow-purple" /> Initializing full access...
             </p>
           </motion.div>
         )}

         {status === 'error' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
             <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
             <h2 className="text-2xl font-black mb-2 text-red-500">Sync Failure</h2>
             <p className="text-[#A1A1A6] font-medium text-sm mb-6">{errorMsg}</p>
             <button 
               onClick={() => navigate('/hub-upgrade')}
               className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all"
             >
               Return to Hub Upgrade
             </button>
           </motion.div>
         )}
      </div>
    </div>
  );
}
