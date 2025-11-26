import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Sparkles } from 'lucide-react';

interface LoginProps {
  setAuth: (auth: { isAuthenticated: boolean; user: any }) => void;
}

export default function Login({ setAuth }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login
    localStorage.setItem('token', 'demo-token');
    setAuth({ isAuthenticated: true, user: { email } });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-academic-navy via-academic-blue to-academic-amber opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-academic-amber rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-academic-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-academic-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-academic-navy text-white p-12 items-center justify-center">
        <div className="max-w-md space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="w-12 h-12 text-academic-amber" />
              <h1 className="text-5xl font-serif font-bold">ThesisAI</h1>
            </div>
            <div className="h-1 w-24 bg-academic-amber rounded-full"></div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-balance">
              Elevate your thesis with AI-powered insights
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Get comprehensive feedback on structure, argumentation, methodology, and writing quality. Prepare for your viva with confidence.
            </p>
          </div>

          <div className="grid gap-4 mt-12">
            {[
              { icon: BookOpen, text: 'Detailed structural analysis' },
              { icon: Brain, text: 'AI-powered feedback' },
              { icon: Sparkles, text: 'Viva question predictions' }
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm transform hover:scale-105 transition-transform"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <feature.icon className="w-6 h-6 text-academic-amber" />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="text-center lg:hidden mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-academic-navy" />
              <h1 className="text-4xl font-serif font-bold gradient-text">ThesisAI</h1>
            </div>
          </div>

          <div className="glass card-shadow-lg rounded-2xl p-8 space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-academic-navy mb-2">Welcome back</h2>
              <p className="text-slate-600">Sign in to continue your thesis journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-academic-navy mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-academic-amber focus:outline-none transition-colors"
                  placeholder="student@aucdt.edu.gh"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-academic-navy mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-academic-amber focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary text-lg"
              >
                Sign in
              </button>

              <p className="text-center text-sm text-slate-600">
                Demo credentials: any email/password
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-slate-600">
            AsanSka University College of Design and Technology © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
