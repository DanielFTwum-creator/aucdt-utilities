import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Eye, EyeOff, Lock, Shield, Sparkles, Film, Crown, User, Mail, Phone, LogIn, MapPin, Church } from 'lucide-react';

const TITLES = [
  'Mr', 'Mrs', 'Ms', 'Miss', 'Dr',
  'Pastor', 'Rev', 'Bishop', 'Apostle',
  'Prophet', 'Evangelist', 'Deacon', 'Deaconess',
  'Brother', 'Sister'
];

const Auth: React.FC = () => {
  const { login, register } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('john@example.com');
  const [formData, setFormData] = useState({
    title: 'Brother',
    full_name: '',
    email: '',
    phone: '',
    gender: 'Male' as 'Male' | 'Female',
    role: UserRole.CAMPER,
    province: '',
    sanctuary: ''
  });

  const [currentVariation, setCurrentVariation] = useState(0);
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const success = login(email);
      if (!success) {
        setError('Account not found. Please sign up or check your email.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.full_name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      register({ ...formData });
      setIsLoading(false);
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const fillDemo = (role: 'admin' | 'camper') => {
    setIsLogin(true);
    setError('');
    if (role === 'admin') {
      setEmail('admin@vbci.com');
    } else {
      setEmail('john@example.com');
    }
  };
  
  const commonInputClasses = (theme: string) => {
      switch(theme) {
          case 'ocean': return 'w-full bg-cyan-950/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-700 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all backdrop-blur-sm';
          case 'forest': return 'w-full bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all';
          case 'sunset': return 'w-full bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-200 transition-all';
          case 'arctic': return 'w-full bg-white/80 border-2 border-blue-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all';
          case 'galaxy': return 'w-full bg-indigo-950/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-100 placeholder-indigo-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all';
          case 'cinema': return 'w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-3 text-red-100 placeholder-red-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all';
          default: return '';
      }
  };

  const variations = [
    {
      name: "Deep",
      component: (
        <div className="min-h-screen bg-gradient-to-b from-cyan-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30"><div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full filter blur-[120px] animate-pulse"></div><div className="absolute top-40 right-20 w-48 h-48 bg-blue-400 rounded-full filter blur-[100px] animate-pulse" style={{animationDelay: '1.5s'}}></div><div className="absolute bottom-20 left-1/3 w-56 h-56 bg-indigo-400 rounded-full filter blur-[110px] animate-pulse" style={{animationDelay: '3s'}}></div></div>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.2)]">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse"><Church className="w-10 h-10 text-white" /></div><div className="absolute -inset-2 border-2 border-cyan-400/50 rounded-2xl animate-ping"></div></div><h1 className="text-6xl font-bold mb-3"><span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">myVBCI</span></h1><h2 className="text-2xl font-light text-cyan-100">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div><label className="block text-sm font-medium text-cyan-300 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('ocean')} pl-12`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm font-medium text-cyan-300 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('ocean')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-200 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                  <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold py-3 rounded-xl hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-cyan-300 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('ocean')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-indigo-950">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-cyan-300 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('ocean')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-cyan-300 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('ocean')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-cyan-300 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('ocean')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 rounded-xl hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-cyan-400">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-cyan-200 hover:text-white ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-cyan-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-cyan-300 hover:text-white transition-colors ml-2">Camper Demo</button>
                    <span className="text-cyan-600 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-cyan-300 hover:text-white transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Jade",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-10 right-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-40 animate-pulse"></div><div className="absolute bottom-10 left-20 w-80 h-80 bg-teal-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="relative w-full max-w-md">
            <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
               <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg"><Church className="w-10 h-10 text-white" /></div><div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div></div><h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent mb-3">myVBCI</h1><h2 className="text-2xl font-light text-emerald-100">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-emerald-300 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('forest')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-emerald-300 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('forest')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-200 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-semibold py-3 rounded-xl hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                 <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-emerald-300 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('forest')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-emerald-950">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-emerald-300 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('forest')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-emerald-300 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('forest')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-emerald-300 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('forest')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 rounded-xl hover:from-emerald-400 hover:to-green-500 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-emerald-400">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-emerald-200 hover:text-white ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-emerald-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-emerald-300 hover:text-white transition-colors ml-2">Camper Demo</button>
                    <span className="text-emerald-600 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-emerald-300 hover:text-white transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Glow",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-orange-300 to-pink-300 rounded-full filter blur-[100px] opacity-40 animate-pulse"></div><div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-[100px] opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}></div></div>
          <div className="relative w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl"><Church className="w-10 h-10 text-white" /></div></div><h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">myVBCI</h1><h2 className="text-2xl font-semibold text-gray-800">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('sunset')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('sunset')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-gray-700 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('sunset')} py-2.5`}>{TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-gray-700 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('sunset')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-gray-700 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('sunset')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-gray-700 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('sunset')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 rounded-xl hover:from-orange-500 hover:to-pink-600 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-pink-500 hover:text-pink-600 ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-gray-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-gray-600 hover:text-pink-500 transition-colors ml-2">Camper Demo</button>
                    <span className="text-gray-400 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-gray-600 hover:text-pink-500 transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Frost",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-[100px] opacity-30"></div><div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-200 rounded-full filter blur-[120px] opacity-30"></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full filter blur-[140px] opacity-20"></div></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="relative w-full max-w-md">
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-white/80">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg"><Church className="w-10 h-10 text-white" /></div><div className="absolute -inset-2 border-2 border-blue-300 rounded-full"></div></div><h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-3">myVBCI</h1><h2 className="text-2xl font-light text-slate-700">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-slate-600 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('arctic')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-slate-600 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('arctic')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-slate-600 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('arctic')} py-2.5`}>{TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-slate-600 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-slate-600 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div className="grid grid-cols-2 gap-3"><div className="col-span-1"><label className="block text-sm text-slate-600 mb-1">Province</label><div className="relative"><MapPin className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="e.g. Lusaka"/></div></div><div className="col-span-1"><label className="block text-sm text-slate-600 mb-1">Sanctuary</label><div className="relative"><Church className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.sanctuary} onChange={(e) => setFormData({...formData, sanctuary: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="e.g. Main"/></div></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-blue-500 hover:text-blue-600 ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-slate-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-slate-600 hover:text-blue-500 transition-colors ml-2">Camper Demo</button>
                    <span className="text-slate-400 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-slate-600 hover:text-blue-500 transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Night",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-0 left-0 w-full h-full">{[...Array(50)].map((_, i) => (<div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, opacity: Math.random() * 0.7 + 0.3}}></div>)) }</div><div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full filter blur-[150px] opacity-20 animate-pulse"></div><div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600 rounded-full filter blur-[130px] opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div></div>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-2xl rounded-3xl p-8 border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.3)]">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse"><Church className="w-10 h-10 text-white" /></div><div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"></div></div><h1 className="text-6xl font-bold mb-3"><span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">myVBCI</span></h1><h2 className="text-2xl font-light text-indigo-100">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                 <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-indigo-300 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('galaxy')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-indigo-300 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('galaxy')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-indigo-300 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('galaxy')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-purple-950">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-indigo-300 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('galaxy')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-indigo-300 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('galaxy')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-indigo-300 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('galaxy')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-indigo-400">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-purple-300 hover:text-white ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-indigo-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-indigo-300 hover:text-white transition-colors ml-2">Camper Demo</button>
                    <span className="text-indigo-600 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-indigo-300 hover:text-white transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Red",
      component: (
        <div className="min-h-screen bg-gradient-to-b from-red-950 via-black to-black flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.15),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <div className="relative w-full max-w-lg">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-gradient-to-b from-zinc-900 to-black rounded-lg p-8 border border-red-900/50">
                <div className="text-center mb-8"><div className="flex justify-center mb-6"><div className="relative"><div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-lg rotate-45 shadow-2xl shadow-red-900/50"></div><Church className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" /></div></div><h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text mb-3 tracking-tighter">myVBCI</h1><div className="flex items-center justify-center gap-2 mb-2"><div className="w-12 h-px bg-gradient-to-r from-transparent to-red-600"></div><Lock className="w-5 h-5 text-red-500" /><div className="w-12 h-px bg-gradient-to-l from-transparent to-red-600"></div></div><h2 className="text-2xl font-light text-red-100 tracking-wide">{isLogin ? 'Secure Portal Access' : 'Create Camper Profile'}</h2></div>
                {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm text-center mb-6">{error}</div>)}
                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                      <div><label className="block text-sm font-semibold text-red-400 mb-2 tracking-wider">EMAIL</label><div className="relative"><Mail className="w-5 h-5 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('cinema')} pl-12`} placeholder="Enter access email" required/></div></div>
                      <div><label className="block text-sm font-semibold text-red-400 mb-2 tracking-wider">PASSWORD</label><div className="relative"><Lock className="w-5 h-5 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('cinema')} pl-12`} placeholder="Enter secure password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-400 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                      <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold py-3 rounded-lg hover:from-red-600 hover:via-red-500 hover:to-red-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] disabled:opacity-50 tracking-wider flex items-center justify-center gap-2">{isLoading ? 'AUTHENTICATING...' : <><LogIn size={16}/> ENTER SYSTEM</>}</button>
                  </form>
                ) : (
                   <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-red-400 mb-1 tracking-wider">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('cinema')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-zinc-900">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-red-400 mb-1 tracking-wider">Full Name</label><div className="relative"><User className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('cinema')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                      <div><label className="block text-sm text-red-400 mb-1 tracking-wider">Email</label><div className="relative"><Mail className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('cinema')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                      <div><label className="block text-sm text-red-400 mb-1 tracking-wider">Phone</label><div className="relative"><Phone className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('cinema')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                      <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 rounded-lg hover:from-red-500 hover:to-red-700 disabled:opacity-50 transition-all tracking-wider">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                  </form>
                )}
                <div className="mt-8 text-center">
                  <p className="text-sm text-zinc-500">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-zinc-300 hover:text-red-400 ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                  <div className="mt-4 text-xs">
                    <span className="text-zinc-600">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-zinc-400 hover:text-red-400 transition-colors ml-2">Camper Demo</button>
                    <span className="text-zinc-700 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-zinc-400 hover:text-red-400 transition-colors">Admin Demo</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="relative">
      {variations[currentVariation].component}
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/70 backdrop-blur-md rounded-full shadow-2xl p-2 flex gap-2 border border-white/50">
        {variations.map((variation, index) => (
          <button
            key={index}
            onClick={() => setCurrentVariation(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentVariation === index
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/70'
            }`}
          >
            {variation.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Auth;
