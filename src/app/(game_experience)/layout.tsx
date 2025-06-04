
"use client";

import { type ReactNode, useEffect, useRef } from 'react';
import { Music } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function GameExperienceLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.play().catch(error => console.error("Error playing game experience music:", error));
    }
    // Cleanup when layout unmounts (e.g. navigating to /login)
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, []); // Play on mount

  // Determine if the current page is one where the music indicator should be shown
  const showMusicIndicator = pathname === '/game-menu' || 
                             pathname.startsWith('/numerical-hangman') || 
                             pathname.startsWith('/chain-touch') || 
                             pathname.startsWith('/spot-the-difference');

  return (
    <>
      <audio ref={audioRef} src="/Musica de fondo.mp3" loop preload="auto" />
      {showMusicIndicator && (
        <div className="fixed top-4 left-4 text-sm text-muted-foreground flex items-center gap-2 z-50 bg-background/50 p-2 rounded-md shadow">
          <Music size={16} /> <span className="hidden sm:inline">(Música de fondo sonando...)</span>
        </div>
      )}
      {children}
    </>
  );
}
