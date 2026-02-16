import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Key, Loader2, ArrowRight } from 'lucide-react';
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
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await authService.login(email, password);
    if (result.success) {
      onLoginSuccess();
      navigate('/admin');
    } else {
      setError(result.error || "Login Failed");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="p-5 bg-slate-800 rounded-3xl text-cyan-400"><Lock size={32} /></div>
        </div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Admin Node</h2>
          <p className="text-slate-500 text-sm">Secure access for system modifications.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Deploy Session <ArrowRight size={18} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;