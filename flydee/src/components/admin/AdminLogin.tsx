import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <div className="p-8 bg-zinc-900 rounded-lg border border-zinc-800">
        <h2 className="text-xl font-bold text-white mb-4">Admin Access</h2>
        <Input 
          type="password" 
          value={password} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={() => password === 'admin' && onLogin()}>Login</Button>
      </div>
    </div>
  );
}
