import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useLangStore } from '@/store/langStore';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  head: () => ({ meta: [{ title: 'შესვლა · Dubuni' }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success(lang === 'ka' ? 'მოგესალმებით!' : 'Welcome back!');
      // Check admin role
      const userId = data.user?.id;
      let isAdmin = false;
      if (userId) {
        const { data: r } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle();
        isAdmin = !!r;
      }
      navigate({ to: isAdmin ? '/admin' : '/account' });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/account` },
      });
      if (error) { setLoading(false); return toast.error(error.message); }
      // auto-confirm is on; sign in immediately
      const { error: e2 } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (e2) {
        toast.success(lang === 'ka' ? 'ანგარიში შეიქმნა, შედით' : 'Account created, sign in');
        setMode('signin');
        return;
      }
      toast.success(lang === 'ka' ? 'მოგესალმებით Dubuni-ში!' : 'Welcome to Dubuni!');
      navigate({ to: '/account' });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Toaster richColors position="top-right" />
      <div className="w-full max-w-md">
        <div className="bg-white border-[3px] border-ink rounded-[2.5rem] shadow-sticker-lg p-8 relative">
          <div className="washi washi-sun -top-3 left-12 -rotate-2 rounded-sm" />
          <div className="washi washi-grass -top-2 right-10 rotate-3 rounded-sm" />

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-coral text-white border-[3px] border-ink shadow-sticker -rotate-3 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h1 className="font-display text-3xl text-ink">{mode === 'signin' ? (lang === 'ka' ? 'შესვლა' : 'Sign In') : (lang === 'ka' ? 'რეგისტრაცია' : 'Sign Up')}</h1>
          </div>
          <p className="text-sm text-ink/60 font-medium mb-6">
            {mode === 'signin' ? (lang === 'ka' ? 'შედი და ნახე შენი ჯავშნები' : 'Sign in to view your bookings') : (lang === 'ka' ? 'შექმენი ანგარიში სწრაფად' : 'Create an account in seconds')}
          </p>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <Field icon={<Mail size={16} />} type="email" required value={email} onChange={setEmail} placeholder="email@example.com" />
            <Field icon={<Lock size={16} />} type="password" required minLength={6} value={password} onChange={setPassword} placeholder={lang === 'ka' ? 'პაროლი (მინ. 6)' : 'Password (min 6)'} />

            <button disabled={loading} className="mt-2 py-3.5 rounded-xl bg-coral text-white border-[3px] border-ink font-black text-sm uppercase tracking-widest shadow-sticker press disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 className="animate-spin" size={16} />}
              {mode === 'signin' ? (lang === 'ka' ? 'შესვლა' : 'Sign In') : (lang === 'ka' ? 'რეგისტრაცია' : 'Create account')}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full mt-4 text-xs text-ink/70 hover:text-coral font-bold"
          >
            {mode === 'signin' ? (lang === 'ka' ? 'არ გაქვს ანგარიში? შექმენი' : "Don't have an account? Sign up") : (lang === 'ka' ? 'უკვე გაქვს ანგარიში? შედი' : 'Already have an account? Sign in')}
          </button>

          <Link to="/" className="block text-center mt-6 text-[11px] font-black uppercase tracking-wider text-ink/50 hover:text-coral">
            ← {lang === 'ka' ? 'მთავარზე დაბრუნება' : 'Back to home'}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, type, required, minLength, value, onChange, placeholder }: any) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50">{icon}</span>
      <input
        type={type} required={required} minLength={minLength} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-cream border-[3px] border-ink font-bold text-ink focus:outline-none focus:ring-4 focus:ring-sun/40"
      />
    </div>
  );
}
