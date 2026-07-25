import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('İşleniyor...');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus('Hata: ' + error.message);
    } else {
      setStatus('Giriş Başarılı. Yönlendiriliyor...');
      // Doğrudan yönlendirme yap
      navigate('/yonetim-merkezi-x91');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold uppercase mb-8 tracking-widest">GİRİŞ YAP</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm px-4">
            <input
                type="email"
                placeholder="E-Posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}                className="p-4 bg-stone-900 border border-stone-800 text-white rounded focus:outline-none focus:border-white"
            />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}                className="p-4 bg-stone-900 border border-stone-800 text-white rounded focus:outline-none focus:border-white"
            />
            <button type="submit" className="bg-white text-black font-bold p-4 rounded hover:bg-gray-200 uppercase tracking-wider">
                Gönder
            </button>
        </form>

        {status && <p className="mt-6 text-stone-400 font-mono">{status}</p>}
    </div>
  );
};