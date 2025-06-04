"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Music2, Tv2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  
  const [retroMusicPlaying, setRetroMusicPlaying] = useState(true);
  const [tvStaticSoundPlaying, setTvStaticSoundPlaying] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (retroMusicPlaying) {
      console.log("Retro music playing...");
    } else {
      console.log("Retro music stopped.");
    }
  }, [retroMusicPlaying]);

  useEffect(() => {
    if (tvStaticSoundPlaying) {
      console.log("TV static sound playing...");
    } else {
      console.log("TV static sound stopped.");
    }
  }, [tvStaticSoundPlaying]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    if (username === 'Adrian' && password === '123maripositalindae') {
      setRetroMusicPlaying(false); 
      setTvStaticSoundPlaying(true);
      setShowStatic(true);

      setTimeout(() => {
        setShowStatic(false);
        setTvStaticSoundPlaying(false);
        router.push('/jigsaw-intro');
      }, 3000); // Show static for 3 seconds
    } else {
      setError('Usuario o contraseña incorrectos.');
      setIsLoggingIn(false);
    }
  };

  if (showStatic) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 text-white p-4">
        {/* Aquí va tv_static_animation.gif o tv_static.png */}
        <Tv2 className="w-32 h-32 mb-4 animate-pulse text-accent" />
        <p className="text-4xl font-mono animate-pulse">CONEXIÓN INTERRUMPIDA...</p>
        <p className="text-lg mt-2">Restableciendo señal...</p>
        {/* Aquí se reproduce static_tv.mp3 */}
        {tvStaticSoundPlaying && <div className="mt-2 text-sm text-muted-foreground">(Sonido de estática de TV activado)</div>}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Aquí se reproduce musica_retro.mp3 */}
      {retroMusicPlaying && (
        <div className="absolute top-4 left-4 text-sm text-muted-foreground flex items-center gap-2">
          <Music2 size={16} /> (Música retro de videojuego sonando...)
        </div>
      )}
      
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center text-primary">Game Chamber</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Inicia sesión para comenzar la aventura</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                required
                disabled={isLoggingIn}
                className="bg-input/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña secreta"
                  required
                  disabled={isLoggingIn}
                  className="bg-input/50 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoggingIn}>
              {isLoggingIn ? 'Iniciando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center justify-center">
          <p>¿Problemas para entrar? Asegúrate de usar las credenciales correctas.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
