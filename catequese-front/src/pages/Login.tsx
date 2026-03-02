import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BookOpen } from 'lucide-react';

export function Login() {
  const { login } = useAppContext();
  const [loginStr, setLoginStr] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(loginStr, password);
    } catch (err: any) {
      if (err.message === 'Network Error' || !err.response) {
        setError('Erro de conexão. Verifique se o servidor está online.');
      } else if (err.response?.status === 401) {
        setError('Credenciais inválidas. Tente novamente.');
      } else {
        setError(err.response?.data?.message || 'Ocorreu um erro ao fazer login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF200]/20">
            <BookOpen className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">CatequeseApp</CardTitle>
          <p className="text-sm text-slate-500">Faça login para continuar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="login">
                Usuário / Nome
              </label>
              <Input
                id="login"
                type="text"
                placeholder="Ex: admin ou maria"
                value={loginStr}
                onChange={(e) => setLoginStr(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Senha
                </label>
                <a href="#" className="text-xs text-yellow-600 hover:underline">
                  Esqueci a senha
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 text-center text-xs text-slate-500">
            Dica: Use "admin" para Administrador ou "maria" para Catequista.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
