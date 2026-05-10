import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Users, DollarSign, Wallet, Building, Copy, CheckCircle2, ChevronRight, XCircle, LayoutDashboard, MessageSquare, AlertTriangle, Activity, Crown, ShieldAlert } from 'lucide-react';
import { db } from '@/src/services/firebase';
import { collection, query, getDocs, doc, setDoc, getDoc, updateDoc, orderBy } from 'firebase/firestore';
import { useNotify } from '@/src/contexts/NotificationContext';
import { useUser } from '@/src/contexts/UserContext';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useUser();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'transactions' | 'users' | 'support' | 'logs'>('overview');
  const [settings, setSettings] = useState({
    btcpayHost: '',
    btcpayStoreId: '',
    upiId: '',
    paypalEmail: '',
    bankDetails: '',
    nowPaymentsApiKey: '',
    primaryGateway: 'btcpay',
    premiumPrice: '29',
    proPrice: '99',
    adminEmails: 'hotelcrowncastle992@gmail.com'
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [platformUsers, setPlatformUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'payment_settings', 'global')).then(snap => {
         const data = snap.data();
         const admins = data?.adminEmails || 'hotelcrowncastle992@gmail.com';
         if (admins.includes(user.email) || user.email === 'hotelcrowncastle992@gmail.com') {
            setIsAdmin(true);
            if (data) setSettings(prev => ({ ...prev, ...data }));
            loadData();
         } else {
            setIsAdmin(false);
            navigate('/dashboard');
         }
      }).catch(() => {
         // Fallback if firestore rules completely block read, but we should be able to read payment_settings/global
         if (user.email === 'hotelcrowncastle992@gmail.com') {
             setIsAdmin(true);
             loadData();
         } else {
             setIsAdmin(false);
             navigate('/dashboard');
         }
      });
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load Transactions
      const txQuery = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
      const txSnap = await getDocs(txQuery);
      setTransactions(txSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Load Users
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const usersSnap = await getDocs(usersQuery);
      setPlatformUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Load Support Tickets
      try {
        const ticketsQuery = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'));
        const ticketsSnap = await getDocs(ticketsQuery);
        setTickets(ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        // Init collection block
      }

      // Load System Logs
      try {
        const logsQuery = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'));
        const logsSnap = await getDocs(logsQuery);
        setLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        // Init collection block
      }

    } catch (error: any) {
      console.error(error);
      notify("Failed to load admin data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsRef = doc(db, 'payment_settings', 'global');
      await setDoc(settingsRef, settings);
      notify("Payment settings saved successfully", "success");
    } catch (error: any) {
      notify("Failed to save settings: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const approveTransaction = async (tx: any) => {
    try {
      // 1. Update Tx status
      await updateDoc(doc(db, 'transactions', tx.id), { status: 'approved' });
      // 2. Update User tier
      await updateDoc(doc(db, 'users', tx.userId), { tier: tx.planId });
      
      notify(`Approved ${tx.userEmail} for ${tx.planId} plan`, "success");
      loadData();
    } catch (e: any) {
      notify("Failed to approve: " + e.message, "error");
    }
  };

  const rejectTransaction = async (txId: string) => {
    try {
      await updateDoc(doc(db, 'transactions', txId), { status: 'rejected' });
      notify("Transaction rejected", "success");
      loadData();
    } catch (e: any) {
      notify("Failed to reject: " + e.message, "error");
    }
  };

  const resolveTicket = async (ticketId: string) => {
    try {
      await updateDoc(doc(db, 'support_tickets', ticketId), { status: 'resolved' });
      notify("Ticket marked resolved", "success");
      loadData();
    } catch (e: any) {
      notify("Failed: " + e.message, "error");
    }
  };

  const updateUserTier = async (userId: string, currentTier: string) => {
    const newTier = prompt(`Enter new tier for user (free, premium, professional):`, currentTier);
    if (newTier && ['free', 'premium', 'professional'].includes(newTier)) {
      try {
        await updateDoc(doc(db, 'users', userId), { tier: newTier });
        notify("User tier manually overridden", "success");
        loadData();
      } catch (e: any) {
        notify("Failed to update user tier: " + e.message, "error");
      }
    } else if (newTier) {
      notify("Invalid tier selected", "error");
    }
  };

  if (!isAdmin) return null;

  // Analytics Calculations
  const totalRevenue = transactions.filter(t => t.status === 'approved').reduce((acc, curr) => {
    const amt = parseFloat(curr.amount.replace('$', '')) || 0;
    return acc + amt;
  }, 0);
  
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const activeSubs = platformUsers.filter(u => u.tier && u.tier !== 'free').length;
  const openTickets = tickets.filter(t => t.status !== 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Omni-System Admin</h1>
        <p className="text-[#A1A1A6] font-medium text-sm">Full Control Over Finance, Users & Operations</p>
      </header>

      <div className="flex border-b border-white/10 mb-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'transactions', label: 'Finance', icon: DollarSign },
          { id: 'users', label: 'Users Base', icon: Users },
          { id: 'support', label: 'Support Queue', icon: MessageSquare },
          { id: 'logs', label: 'System Logs', icon: Activity },
          { id: 'settings', label: 'Payment Settings', icon: Settings },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn("px-6 py-3 text-sm font-medium transition-all border-b-2 flex items-center gap-2 whitespace-nowrap", activeTab === tab.id ? "border-glow-blue text-glow-blue" : "border-transparent text-[#A1A1A6] hover:text-white")}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="bg-glow-blue/10 border border-glow-blue/30 rounded-2xl p-6 mb-8 mt-4">
          <h3 className="text-glow-blue font-bold text-lg mb-2 flex items-center gap-2"><Crown className="w-5 h-5"/> Admin System Manager Guide</h3>
          <ul className="text-sm text-white/80 space-y-2 list-disc list-inside">
            <li><strong>Admin Authentication:</strong> You securely access this hidden dashboard if your email is in the admin whitelist or is the master email: <span className="font-mono text-glow-blue bg-black/20 px-1 rounded">hotelcrowncastle992@gmail.com</span>. Any other account is locked out.</li>
            <li><strong>Subscription Flow & Custom Pricing:</strong> Configure gateways over the "Payment Settings" tab. You can dynamically alter subscription prices to run daily promotions, offers, or $0 "Free Trials".</li>
            <li><strong>Ownership Transfer:</strong> Use the "System Owners" config to delegate administration powers to new managers or completely transfer ownership.</li>
            <li><strong>Full Account Override:</strong> In the 'Users Base' tab, you can manually force any user into a specific tier at zero cost using the Admin Override Action.</li>
            <li><strong>Platform Security:</strong> Firestore rules block unauthorized config changes, empowering only listed admins.</li>
          </ul>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-20 text-[#A1A1A6]">
           Loading admin architecture...
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="smart-card p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-emerald-500">
                      <DollarSign className="w-5 h-5"/>
                    </div>
                  </div>
                  <h3 className="text-[#A1A1A6] text-sm mb-1">Total Revenue</h3>
                  <p className="text-3xl font-semibold text-white tracking-tight">${totalRevenue.toFixed(2)}</p>
                </div>
                
                <div className="smart-card p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-glow-blue">
                      <Users className="w-5 h-5"/>
                    </div>
                  </div>
                  <h3 className="text-[#A1A1A6] text-sm mb-1">Total Users</h3>
                  <p className="text-3xl font-semibold text-white tracking-tight">{platformUsers.length}</p>
                </div>

                <div className="smart-card p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-purple-500">
                      <Crown className="w-5 h-5"/>
                    </div>
                  </div>
                  <h3 className="text-[#A1A1A6] text-sm mb-1">Active Subscribers</h3>
                  <p className="text-3xl font-semibold text-white tracking-tight">{activeSubs}</p>
                </div>

                <div className="smart-card p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-yellow-500">
                      <AlertTriangle className="w-5 h-5"/>
                    </div>
                  </div>
                  <h3 className="text-[#A1A1A6] text-sm mb-1">Action Needed</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white"><span className="text-yellow-500">{pendingTransactions}</span> Payments</span>
                    <span className="text-sm font-medium text-white"><span className="text-red-500">{openTickets}</span> Tickets</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="smart-card p-8 max-w-2xl space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2"><DollarSign className="w-5 h-5"/> Payment Gateways Configuration</h2>
              <p className="text-sm text-[#A1A1A6]">Configure multiple payment methods. Empty fields will automatically hide the payment method from the end-user checkout.</p>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-white mb-4">Master Gateway Preference</h3>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Primary Preferred Gateway</label>
                  <select
                    value={settings.primaryGateway || 'btcpay'}
                    onChange={e => setSettings({...settings, primaryGateway: e.target.value})}
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                  >
                    <option value="btcpay">BTCPay Server (Self-Hosted Crypto)</option>
                    <option value="nowpayments">NOWPayments (Managed Crypto)</option>
                    <option value="upi">Manual UPI Transfer</option>
                    <option value="bank">Manual Bank Transfer</option>
                  </select>
                  <p className="text-xs text-[#A1A1A6] mt-2">This highlights the selected method as recommended when the user initiates an upgrade.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-white mb-4">Subscription Pricing (Offers & Discounts)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Premium Price (USD)</label>
                      <input 
                        type="number" 
                        value={settings.premiumPrice}
                        onChange={e => setSettings({...settings, premiumPrice: e.target.value})}
                        className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Pro Price (USD)</label>
                      <input 
                        type="number" 
                        value={settings.proPrice}
                        onChange={e => setSettings({...settings, proPrice: e.target.value})}
                        className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#A1A1A6] mt-2">Adjust prices to offer temporary discounts or trials.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl border-t border-white/10 pt-4 mt-6">
                  <h3 className="text-sm font-bold text-white mb-4">System Owners (Admin Access)</h3>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Admin Emails (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={settings.adminEmails}
                    onChange={e => setSettings({...settings, adminEmails: e.target.value})}
                    placeholder="hotelcrowncastle992@gmail.com, another@email.com"
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                  />
                  <p className="text-xs text-[#A1A1A6] mt-2">Allow new owners to access the Omni-System Admin. Separate multiple emails with a comma.</p>
                </div>

                <div className="border-t border-white/10 pt-6 mt-6">
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">NOWPayments API Key</label>
                  <input 
                    type="text" 
                    value={settings.nowPaymentsApiKey || ''}
                    onChange={e => setSettings({...settings, nowPaymentsApiKey: e.target.value})}
                    placeholder="Your NOWPayments API Key for Subscriptions"
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">BTCPay Server Host URL</label>
                  <input 
                    type="text" 
                    value={settings.btcpayHost}
                    onChange={e => setSettings({...settings, btcpayHost: e.target.value})}
                    placeholder="https://btcpay.yourdomain.com"
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">BTCPay Store ID</label>
                  <input 
                    type="text" 
                    value={settings.btcpayStoreId}
                    onChange={e => setSettings({...settings, btcpayStoreId: e.target.value})}
                    placeholder="Store ID from BTCPay Server"
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">UPI ID</label>
                  <input 
                    type="text" 
                    value={settings.upiId}
                    onChange={e => setSettings({...settings, upiId: e.target.value})}
                    placeholder="yourname@upi"
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">PayPal Email / Link</label>
                  <input 
                    type="text" 
                    value={settings.paypalEmail}
                    onChange={e => setSettings({...settings, paypalEmail: e.target.value})}
                    placeholder="paypal.me/yourname"
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Bank Account Details</label>
                  <textarea 
                    value={settings.bankDetails}
                    onChange={e => setSettings({...settings, bankDetails: e.target.value})}
                    placeholder="Account Name:&#10;Account Number:&#10;IFSC/SWIFT:"
                    className="w-full bg-[#151515] border border-white/10 p-3 rounded-xl focus:border-glow-blue/50 outline-none text-white text-sm transition-colors min-h-[100px]"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-95 transition-all w-full md:w-auto"
                  >
                    {isSaving ? 'Saving...' : 'Save Payment Gateways'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="smart-card overflow-hidden">
               <div className="p-6 border-b border-white/5">
                 <h2 className="text-xl font-semibold text-white">Pending & Completed Transactions</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead>
                     <tr className="bg-white/5 text-[#A1A1A6]">
                       <th className="p-4 font-semibold">User</th>
                       <th className="p-4 font-semibold">Plan</th>
                       <th className="p-4 font-semibold">Amount</th>
                       <th className="p-4 font-semibold">Method</th>
                       <th className="p-4 font-semibold">Transaction ID</th>
                       <th className="p-4 font-semibold">Status</th>
                       <th className="p-4 font-semibold">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {transactions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#A1A1A6]">No transactions found</td>
                        </tr>
                     )}
                     {transactions.map(tx => (
                       <tr key={tx.id} className="hover:bg-white/[0.02]">
                         <td className="p-4 text-white">
                           <div className="font-semibold">{tx.userEmail}</div>
                           <div className="text-xs text-[#A1A1A6]">{tx.userId}</div>
                         </td>
                         <td className="p-4 text-glow-blue font-medium">{tx.planId?.toUpperCase()}</td>
                         <td className="p-4 text-white font-mono">{tx.amount}</td>
                         <td className="p-4 text-[#A1A1A6] uppercase text-xs font-semibold">{tx.method}</td>
                         <td className="p-4 text-white font-mono text-xs">{tx.transactionId}</td>
                         <td className="p-4">
                           <span className={cn(
                             "px-2 py-1 text-xs font-semibold uppercase rounded-md",
                             tx.status === 'pending' ? "bg-yellow-500/20 text-yellow-500" :
                             tx.status === 'approved' ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                           )}>
                             {tx.status}
                           </span>
                         </td>
                         <td className="p-4">
                           {tx.status === 'pending' && (
                             <div className="flex gap-2">
                               <button onClick={() => approveTransaction(tx)} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors">
                                 <CheckCircle2 className="w-4 h-4" />
                               </button>
                               <button onClick={() => rejectTransaction(tx.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                                 <XCircle className="w-4 h-4" />
                               </button>
                             </div>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="smart-card overflow-hidden">
               <div className="p-6 border-b border-white/5">
                 <h2 className="text-xl font-semibold text-white">Platform Users</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead>
                     <tr className="bg-white/5 text-[#A1A1A6]">
                       <th className="p-4 font-semibold">Email</th>
                       <th className="p-4 font-semibold">UID</th>
                       <th className="p-4 font-semibold">Tier</th>
                       <th className="p-4 font-semibold">Joined</th>
                       <th className="p-4 font-semibold">Admin Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {platformUsers.map(u => (
                       <tr key={u.id} className="hover:bg-white/[0.02]">
                         <td className="p-4 text-white font-medium">{u.email}</td>
                         <td className="p-4 text-[#A1A1A6] font-mono text-xs">{u.uid}</td>
                         <td className="p-4 text-glow-blue font-medium uppercase text-xs">{u.tier}</td>
                         <td className="p-4 text-[#A1A1A6]">
                           {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                         </td>
                         <td className="p-4">
                           <button 
                             onClick={() => updateUserTier(u.id, u.tier || 'free')}
                             className="px-3 py-1.5 bg-glow-blue/10 text-glow-blue hover:bg-glow-blue/20 rounded text-xs font-semibold"
                           >
                             Force Change Tier
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="smart-card overflow-hidden">
               <div className="p-6 border-b border-white/5 flex justify-between items-center">
                 <h2 className="text-xl font-semibold text-white">Support Tickets</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead>
                     <tr className="bg-white/5 text-[#A1A1A6]">
                       <th className="p-4 font-semibold">User Email</th>
                       <th className="p-4 font-semibold">Subject</th>
                       <th className="p-4 font-semibold">Status</th>
                       <th className="p-4 font-semibold">Created</th>
                       <th className="p-4 font-semibold">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {tickets.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#A1A1A6]">No active tickets</td>
                        </tr>
                     )}
                     {tickets.map(t => (
                       <tr key={t.id} className="hover:bg-white/[0.02]">
                         <td className="p-4 text-white">{t.userEmail}</td>
                         <td className="p-4 text-white truncate max-w-[200px]">{t.subject}</td>
                         <td className="p-4">
                           <span className={cn(
                             "px-2 py-1 text-xs font-semibold uppercase rounded-md",
                             t.status === 'open' ? "bg-red-500/20 text-red-500" :
                             t.status === 'resolved' ? "bg-emerald-500/20 text-emerald-500" : "bg-yellow-500/20 text-yellow-500"
                           )}>
                             {t.status}
                           </span>
                         </td>
                         <td className="p-4 text-[#A1A1A6] font-mono text-xs">
                           {t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}
                         </td>
                         <td className="p-4">
                           {t.status !== 'resolved' && (
                             <button onClick={() => resolveTicket(t.id)} className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white transition-colors">
                               Mark Resolved
                             </button>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="smart-card overflow-hidden">
               <div className="p-6 border-b border-white/5">
                 <h2 className="text-xl font-semibold text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> Error & System Logs</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead>
                     <tr className="bg-white/5 text-[#A1A1A6]">
                       <th className="p-4 font-semibold">Time</th>
                       <th className="p-4 font-semibold">Level</th>
                       <th className="p-4 font-semibold">Message</th>
                       <th className="p-4 font-semibold">User UI</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {logs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-[#A1A1A6]">System operating nominally</td>
                        </tr>
                     )}
                     {logs.map(log => (
                       <tr key={log.id} className="hover:bg-white/[0.02]">
                         <td className="p-4 text-[#A1A1A6] font-mono text-xs">
                           {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Unknown'}
                         </td>
                         <td className="p-4">
                           <span className={cn(
                             "px-2 py-1 text-[10px] font-bold uppercase rounded-md",
                             log.level === 'error' ? "bg-red-500/20 text-red-500" :
                             log.level === 'warn' ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                           )}>
                             {log.level}
                           </span>
                         </td>
                         <td className="p-4 text-white truncate max-w-[400px]">{log.message}</td>
                         <td className="p-4 text-[#A1A1A6] font-mono text-xs">{log.userId || 'System'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
