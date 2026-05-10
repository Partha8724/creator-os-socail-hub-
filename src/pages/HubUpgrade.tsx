import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Network,
  Check,
  Crown,
  Sparkles,
  X,
  Wallet,
  Building,
  Smartphone,
  DollarSign,
  TrendingUp,
  BarChart3,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useUser } from '@/src/contexts/UserContext';
import { db } from '@/src/services/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNotify } from '@/src/contexts/NotificationContext';

export default function HubUpgrade() {
  const { user, profile } = useUser();
  const { notify } = useNotify();
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'crypto'|'upi'|'paypal'|'bank'|'nowpayments'|null>(null);
  const [txId, setTxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'payment_settings', 'global')).then(snap => {
      if (snap.exists()) setPaymentSettings(snap.data());
    });
  }, []);

  const upgrade = async (tier: string) => {
    if (!user) {
      notify("Please log in to upgrade your Neural Node.", "error");
      return;
    }
    if (tier === 'free') return;
    
    if (!paymentSettings) {
      notify("Payment gateways are currently offline. Please try again later.", "error");
      return;
    }
    
    setSelectedPlan(tier);
  };

  const plans = [
    { 
      id: 'free', 
      name: 'Smart Free', 
      price: '$0', 
      desc: 'Foundational node access for emerging creators.',
      features: ['3 Smart Audits / day', 'Basic Trend Mapping', 'Community Support', 'Standard Render Priority'],
      accent: 'border-white/10 hover:border-white/20',
      btn: 'bg-[#151515] border border-apple-glass-border text-[#A1A1A6] hover:bg-white/5 transition-colors',
      icon: Zap
    },
    { 
      id: 'premium', 
      name: 'Smart Premium', 
      price: `$${paymentSettings?.premiumPrice || '29'}`, 
      desc: 'Advanced generation for growth-focused professionals.',
      features: ['Unlimited Smart Audits', 'Deep Heat Map Analysis', 'Priority Proxy Sync', 'Cross-Platform Auto-Forge', '24/7 Priority Node Support'],
      accent: 'border-glow-blue/50 shadow-[0_0_30px_rgba(0,242,255,0.15)] relative overflow-hidden',
      btn: 'bg-glow-blue text-[#101010] hover:bg-glow-blue/90 shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all',
      icon: Sparkles,
      popular: true
    },
    { 
      id: 'pro', 
      name: 'Smart Pro', 
      price: `$${paymentSettings?.proPrice || '99'}`, 
      desc: 'Enterprise-grade platform management for agencies.',
      features: ['Multi-Account Platform Control', 'Custom AI Model Fine-tuning', 'White-label Reporting', 'VVIP Node Infrastructure', 'Dedicated Growth Architect'],
      accent: 'border-glow-purple/50 shadow-[0_0_30px_rgba(188,19,254,0.15)] relative overflow-hidden',
      btn: 'bg-glow-purple text-white hover:bg-glow-purple/90 shadow-[0_0_20px_rgba(188,19,254,0.4)] transition-all',
      icon: Crown
    }
  ];

  const submitTransaction = async () => {
    if (!txId.trim()) {
      notify("Transaction ID is required to verify payment.", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const planAmount = selectedPlan === 'premium' ? `$${paymentSettings?.premiumPrice || '29'}` : `$${paymentSettings?.proPrice || '99'}`;
      await addDoc(collection(db, 'transactions'), {
        userId: user!.uid,
        userEmail: user!.email,
        planId: selectedPlan,
        amount: planAmount,
        method: selectedMethod,
        transactionId: txId,
        status: 'pending',
        timestamp: serverTimestamp()
      });
      
      notify("Transaction submitted! Waiting for Admin verification.", "success");
      setSelectedPlan(null);
      setSelectedMethod(null);
      setTxId('');
    } catch (error: any) {
      notify("Failed to submit transaction: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 animate-in fade-in slide-in-from-top-4 duration-1000 relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-glow-blue/20 blur-[150px] -z-10 rounded-full" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-glow-purple/20 blur-[150px] -z-10 rounded-full" />

      <header className="text-center space-y-6 pt-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-glow-blue/20 to-glow-purple/20 border border-glow-blue/30 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,242,255,0.2)] mb-2"
        >
           <Sparkles className="w-4 h-4 text-glow-blue" /> Unfair Advantage Unlocked
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 leading-tight">
          Evolve Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-glow-blue to-glow-purple animate-pulse">Intelligence</span>
        </h1>
        <p className="text-[#A1A1A6] font-medium text-lg tracking-normal max-w-2xl mx-auto">
          Creators on <span className="text-glow-blue font-bold">Premium</span> grow 4.2x faster by unlocking the underlying algorithm. Stop guessing, start scaling.
        </p>
      </header>

      {/* ROI Calculator / Social Proof Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 relative z-10 hidden sm:grid"
      >
        <div className="bg-[#1C1C1E]/80 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center group hover:border-glow-blue/30 transition-colors">
          <TrendingUp className="w-8 h-8 text-glow-blue mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-3xl font-black text-white mb-1">+314%</h4>
          <p className="text-sm text-[#A1A1A6] font-medium">Avg. View Velocity</p>
        </div>
        <div className="bg-[#1C1C1E]/80 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center group hover:border-glow-purple/30 transition-colors">
          <Clock className="w-8 h-8 text-glow-purple mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-3xl font-black text-white mb-1">-21h</h4>
          <p className="text-sm text-[#A1A1A6] font-medium">Saved per week</p>
        </div>
        <div className="bg-[linear-gradient(110deg,#000,45%,#1e2631,55%,#000)] bg-[length:200%_100%] animate-shimmer border border-white/10 p-6 rounded-3xl flex flex-col items-center text-center group shadow-[0_0_30px_rgba(0,242,255,0.1)]">
          <BarChart3 className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-3xl font-black text-white mb-1">x4.5</h4>
          <p className="text-sm text-[#A1A1A6] font-medium">Algorithmic Hit Rate</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 px-4 relative z-10">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-8 md:p-10 flex flex-col relative group transition-all duration-500 hover:-translate-y-4 rounded-[2rem] bg-[#101010]/80 backdrop-blur-xl border",
              plan.accent
            )}
          >
            {plan.popular && (
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-glow-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[2rem]" />
                <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-glow-blue to-transparent" />
                <div className="absolute -top-4 rounded-full bg-[#101010] border border-glow-blue px-6 py-1.5 left-1/2 -translate-x-1/2 flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)] z-10">
                  <span className="w-2 h-2 rounded-full bg-glow-blue animate-ping" />
                  <span className="text-glow-blue text-xs font-black uppercase tracking-widest whitespace-nowrap">Most Popular</span>
                </div>
              </>
            )}

            {plan.id === 'pro' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-glow-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[2rem]" />
                <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-glow-purple to-transparent" />
              </>
            )}
            
            <div className="mb-10 relative z-10 pt-4">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                    <span className="text-sm font-semibold text-[#A1A1A6] tracking-wide">/ mo</span>
                  </div>
                </div>
                <plan.icon className={cn("w-12 h-12 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500", 
                  plan.id === 'free' ? 'text-[#A1A1A6]' : 
                  plan.id === 'premium' ? 'text-glow-blue drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]' : 'text-glow-purple drop-shadow-[0_0_15px_rgba(188,19,254,0.5)]'
                )} />
              </div>
            </div>

            <p className="text-sm text-[#A1A1A6] leading-relaxed mb-10 h-16 relative z-10">{plan.desc}</p>

            <ul className="flex-1 space-y-4 mb-10 relative z-10">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-3 group/item">
                   <div className={cn(
                     "mt-1.5 w-1.5 h-1.5 rounded-full transition-all group-hover/item:scale-[2] shadow-[0_0_10px_currentcolor]", 
                     plan.id === 'free' ? "bg-white/20 text-white" : 
                     plan.id === 'premium' ? "bg-glow-blue text-glow-blue" : "bg-glow-purple text-glow-purple"
                   )} />
                   <span className="text-sm font-medium text-[#A1A1A6] group-hover/item:text-white transition-colors">{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => upgrade(plan.id)}
              disabled={loading !== null || profile?.tier === plan.id}
              className={cn(
                "w-full py-4 rounded-xl font-black tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-3 relative z-10 active:scale-95",
                profile?.tier === plan.id ? "bg-white/5 border border-white/10 text-[#A1A1A6] cursor-default" : plan.btn
              )}
            >
              {loading === plan.id ? (
                <>
                   <Cpu className="w-4 h-4 animate-spin" />
                   Initializing...
                </>
              ) : profile?.tier === plan.id ? (
                <>
                  <Check className="w-4 h-4" />
                  Current Active Plan
                </>
              ) : (
                <>
                  {plan.id !== 'free' ? <Zap className="w-4 h-4" /> : null}
                  Deploy {plan.name}
                  {plan.id !== 'free' ? <ArrowRight className="w-4 h-4" /> : null}
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-12 pt-16 border-t border-white/5 mx-8">
         {[
           { icon: ShieldCheck, label: 'Military-Grade Encryption' },
           { icon: Zap, label: 'Lightning Fast AI Models' },
           { icon: Crown, label: 'Trusted by Top 1% Creators' },
           { icon: CreditCard, label: 'Secure Orbital Payments' }
         ].map((item, i) => (
           <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-default">
              <item.icon className="w-6 h-6 text-[#A1A1A6]" />
              <span className="text-sm font-bold text-[#A1A1A6] tracking-wide">{item.label}</span>
           </div>
         ))}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#101010] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-glow-blue to-transparent" />
              <button 
                onClick={() => { setSelectedPlan(null); setSelectedMethod(null); setTxId(''); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8 pr-12">
                <span className="px-3 py-1 bg-glow-blue/10 text-glow-blue text-[10px] font-black uppercase tracking-widest rounded-full border border-glow-blue/20 mb-4 inline-block">Secure Checkout</span>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Activate <span className="text-glow-blue bg-clip-text text-transparent bg-gradient-to-r from-glow-blue to-glow-purple">{selectedPlan.toUpperCase()}</span></h3>
                <p className="text-sm text-[#A1A1A6] font-medium leading-relaxed">You're one step away from unlocking the ultimate algorithm advantage. Select your preferred funding method below.</p>
              </div>

              {!selectedMethod ? (
                <div className="grid grid-cols-2 gap-4">
                  {paymentSettings?.nowPaymentsApiKey && (
                    <button onClick={() => setSelectedMethod('nowpayments')} className="p-5 rounded-2xl bg-[#151515] hover:bg-[#1c1c1e] border border-white/5 hover:border-glow-blue/50 flex flex-col items-center justify-center gap-3 transition-all group">
                      <Zap className="w-8 h-8 text-[#A1A1A6] group-hover:text-glow-blue transition-colors" />
                      <span className="text-sm font-bold text-white tracking-wide">Crypto (Auto)</span>
                      <span className="text-[10px] text-[#A1A1A6] font-medium uppercase">NOWPayments</span>
                    </button>
                  )}
                  {paymentSettings?.btcpayHost && (
                    <button onClick={() => setSelectedMethod('crypto')} className="p-5 rounded-2xl bg-[#151515] hover:bg-[#1c1c1e] border border-white/5 hover:border-orange-500/50 flex flex-col items-center justify-center gap-3 transition-all group">
                      <Wallet className="w-8 h-8 text-[#A1A1A6] group-hover:text-orange-500 transition-colors" />
                      <span className="text-sm font-bold text-white tracking-wide">Bitcoin/Alt</span>
                      <span className="text-[10px] text-[#A1A1A6] font-medium uppercase">BTCPay Server</span>
                    </button>
                  )}
                  {paymentSettings?.upiId && (
                    <button onClick={() => setSelectedMethod('upi')} className="p-5 rounded-2xl bg-[#151515] hover:bg-[#1c1c1e] border border-white/5 hover:border-green-500/50 flex flex-col items-center justify-center gap-3 transition-all group">
                      <Smartphone className="w-8 h-8 text-[#A1A1A6] group-hover:text-green-500 transition-colors" />
                      <span className="text-sm font-bold text-white tracking-wide">UPI</span>
                      <span className="text-[10px] text-[#A1A1A6] font-medium uppercase">Instant Transfer</span>
                    </button>
                  )}
                  {paymentSettings?.paypalEmail && (
                    <button onClick={() => setSelectedMethod('paypal')} className="p-5 rounded-2xl bg-[#151515] hover:bg-[#1c1c1e] border border-white/5 hover:border-blue-500/50 flex flex-col items-center justify-center gap-3 transition-all group">
                      <DollarSign className="w-8 h-8 text-[#A1A1A6] group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm font-bold text-white tracking-wide">PayPal</span>
                      <span className="text-[10px] text-[#A1A1A6] font-medium uppercase">Global Cards</span>
                    </button>
                  )}
                  {paymentSettings?.bankDetails && (
                    <button onClick={() => setSelectedMethod('bank')} className="p-5 rounded-2xl bg-[#151515] hover:bg-[#1c1c1e] border border-white/5 hover:border-white/30 flex flex-col items-center justify-center gap-3 transition-all group col-span-2">
                      <Building className="w-8 h-8 text-[#A1A1A6] group-hover:text-white transition-colors" />
                      <span className="text-sm font-bold text-white tracking-wide">Bank Transfer</span>
                      <span className="text-[10px] text-[#A1A1A6] font-medium uppercase">Wire / SEPA / Local</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-6 rounded-2xl bg-[#151515] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <h4 className="text-xs uppercase font-black text-[#A1A1A6] tracking-widest">Funding via {selectedMethod}</h4>
                      <button onClick={() => setSelectedMethod(null)} className="text-xs font-bold text-glow-blue hover:text-white transition-colors tracking-wide">← CHANGE</button>
                    </div>
                    {selectedMethod === 'nowpayments' && (
                      <div className="pt-2">
                        <p className="text-white text-sm font-medium mb-1">Automated Crypto Settlement</p>
                        <p className="text-xs text-[#A1A1A6] font-medium leading-relaxed mb-6">You will be redirected to NOWPayments to complete the transaction securely.</p>
                        
                        <button 
                          onClick={async () => {
                             try {
                               setIsSubmitting(true);
                               const res = await fetch('https://api.nowpayments.io/v1/invoice', {
                                 method: 'POST',
                                 headers: {
                                   'x-api-key': paymentSettings.nowPaymentsApiKey,
                                   'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                   price_amount: parseFloat(selectedPlan === 'premium' ? paymentSettings?.premiumPrice || '29' : paymentSettings?.proPrice || '99'),
                                   price_currency: 'usd',
                                   order_id: `User-${user?.uid}-Plan-${selectedPlan}`,
                                   order_description: `Upgrade to ${selectedPlan}`,
                                   success_url: window.location.origin + '/payment/success',
                                   cancel_url: window.location.origin + '/hub-upgrade'
                                 })
                               });
                               const data = await res.json();
                               if (data.invoice_url) {
                                 window.open(data.invoice_url, '_blank');
                               } else {
                                 notify("Failed to generate NOWPayments link", "error");
                               }
                             } catch (err: any) {
                               notify(err.message, "error");
                             } finally {
                               setIsSubmitting(false);
                             }
                          }}
                          disabled={isSubmitting}
                          className="px-4 py-4 bg-white text-[#101010] text-sm font-black uppercase tracking-widest rounded-xl hover:bg-white/90 w-full mb-3 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          {isSubmitting ? <><Cpu className="w-4 h-4 animate-spin"/> GENERATING...</> : <><Zap className="w-4 h-4"/> PROCEED TO PAYMENT</>}
                        </button>
                      </div>
                    )}
                    {selectedMethod === 'crypto' && (
                      <div className="pt-2">
                        <p className="text-white text-sm font-medium mb-1">Self-Hosted Crypto Gateway</p>
                        <p className="text-xs text-[#A1A1A6] font-medium leading-relaxed mb-6">Zero-middleman transactions via BTCPay Server.</p>
                        
                        <form method="POST" action={`${paymentSettings.btcpayHost}/api/v1/invoices`} target="_blank">
                          <input type="hidden" name="storeId" value={paymentSettings.btcpayStoreId} />
                          <input type="hidden" name="price" value={selectedPlan === 'premium' ? paymentSettings?.premiumPrice || '29' : paymentSettings?.proPrice || '99'} />
                          <input type="hidden" name="currency" value="USD" />
                          <input type="hidden" name="orderId" value={`User-${user?.uid}-Plan-${selectedPlan}`} />
                          {user?.email && <input type="hidden" name="buyerEmail" value={user.email} />}
                          <button type="submit" className="px-4 py-4 bg-white text-[#101010] text-sm font-black uppercase tracking-widest rounded-xl hover:bg-white/90 w-full mb-3 flex items-center justify-center gap-2 transition-all active:scale-95">
                             <Wallet className="w-4 h-4"/> PAY WITH BTCPAY
                          </button>
                        </form>
                      </div>
                    )}
                    {selectedMethod === 'upi' && (
                      <div className="pt-2 text-center">
                        <div className="inline-block p-4 bg-white rounded-2xl mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                           <div className="w-32 h-32 border-4 border-dashed border-black/10 rounded-xl flex items-center justify-center from-gray-100 to-gray-200 bg-gradient-to-br">
                             <Smartphone className="w-10 h-10 text-black/20" />
                           </div>
                        </div>
                        <p className="text-white font-mono break-all text-xl font-black bg-black/50 p-3 rounded-lg border border-white/10 mb-2">{paymentSettings.upiId}</p>
                        <div className="flex items-center justify-center gap-2 text-glow-blue font-bold">
                           <span>Total Due:</span>
                           <span className="text-xl">${selectedPlan === 'premium' ? paymentSettings?.premiumPrice || '29' : paymentSettings?.proPrice || '99'}</span>
                        </div>
                        <p className="text-[10px] text-[#A1A1A6] uppercase tracking-widest mt-4">Manual Verification Required</p>
                      </div>
                    )}
                    {selectedMethod === 'paypal' && (
                      <div className="pt-2 text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                           <DollarSign className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-white font-mono break-all text-lg font-black bg-black/50 p-3 rounded-lg border border-white/10 mb-2">{paymentSettings.paypalEmail}</p>
                        <div className="flex items-center justify-center gap-2 text-glow-blue font-bold">
                           <span>Send via F&F:</span>
                           <span className="text-xl">${selectedPlan === 'premium' ? paymentSettings?.premiumPrice || '29' : paymentSettings?.proPrice || '99'}</span>
                        </div>
                        <p className="text-[10px] text-[#A1A1A6] uppercase tracking-widest mt-4">Manual Verification Required</p>
                      </div>
                    )}
                    {selectedMethod === 'bank' && (
                      <div className="pt-2 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                           <Building className="w-8 h-8 text-white" />
                        </div>
                        <pre className="text-[#A1A1A6] font-mono whitespace-pre-wrap text-[11px] leading-relaxed bg-black/50 p-4 rounded-lg border border-white/10 mb-4 text-left overflow-x-auto">
                          {paymentSettings.bankDetails}
                        </pre>
                        <div className="flex items-center justify-center gap-2 text-glow-blue font-bold">
                           <span>Wire Amount:</span>
                           <span className="text-xl">${selectedPlan === 'premium' ? paymentSettings?.premiumPrice || '29' : paymentSettings?.proPrice || '99'}</span>
                        </div>
                        <p className="text-[10px] text-[#A1A1A6] uppercase tracking-widest mt-4">Manual Verification Required</p>
                      </div>
                    )}
                  </div>

                  {['upi', 'paypal', 'bank'].includes(selectedMethod) && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                      <label className="block text-[10px] font-black text-[#A1A1A6] mb-2 uppercase tracking-widest">Verification Hash</label>
                      <input 
                        type="text"
                        value={txId}
                        onChange={e => setTxId(e.target.value)}
                        placeholder="Paste Transaction ID / Reference No."
                        className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-glow-blue focus:ring-1 focus:ring-glow-blue outline-none text-white font-mono text-sm transition-all shadow-inner placeholder:text-white/20"
                      />
                      <button 
                        onClick={submitTransaction}
                        disabled={isSubmitting || !txId.trim()}
                        className="w-full py-4 bg-glow-blue text-[#101010] font-black uppercase tracking-widest text-sm rounded-xl mt-4 hover:bg-glow-blue/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:shadow-none"
                      >
                        {isSubmitting ? 'VERIFYING SIGNATURE...' : 'SUBMIT PROOF'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
