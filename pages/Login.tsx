import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Key, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usePassword, setUsePassword] = useState(true);
  const [magicSent, setMagicSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await authService.login(email, usePassword ? password : undefined);
    
    if (result.success) {
      if (!usePassword) {
        setMagicSent(true);
      } else {
        onLoginSuccess();
        navigate('/admin');
      }
    } else {
      setError(result.error || "Authentication failed");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <ShieldCheck size={120} />
        </div>

        <div className="flex justify-center mb-10">
          <div className="p-5 bg-slate-800 rounded-3xl border border-white/5 shadow-inner">
            <Lock size={32} className="text-cyan-400" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Admin Node</h2>
          <p className="text-slate-500 text-sm font-medium">Initialize secure session to modify portfolio state.</p>
        </div>

        {magicSent ? (
          <div className="text-center space-y-6">
            <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
              <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest">Magic Link Sent</p>
              <p className="text-slate-400 text-xs mt-2">Check your inbox to finalize authentication.</p>
            </div>
            <button onClick={() => setMagicSent(false)} className="text-xs text-slate-500 hover:text-white uppercase tracking-widest font-bold">
              Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ranbeerraja.com"
                  required
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm font-medium"
                />
              </div>

              {usePassword && (
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                  />
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </p>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center space-x-2 group"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Deploy Session</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-4 flex justify-center">
              <button 
                type="button"
                onClick={() => setUsePassword(!usePassword)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors"
              >
                Switch to {usePassword ? 'Magic Link' : 'Password'} Auth
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;