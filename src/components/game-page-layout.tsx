
import type { ReactNode } from 'react';
import ReturnToMenuButton from '@/components/return-to-menu-button';
import Image from 'next/image';

interface GamePageLayoutProps {
  children: ReactNode;
  gameTitle: string;
}

export default function GamePageLayout({ children, gameTitle }: GamePageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background relative">
      <header className="w-full max-w-4xl flex justify-start mb-6 mt-2">
        <ReturnToMenuButton />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl">
        <h1 className="text-4xl font-headline mb-8 text-primary">{gameTitle}</h1>
        {children}
      </main>
       <footer className="w-full text-center p-4 text-sm text-muted-foreground">
        <p>Game Chamber - {gameTitle}</p>
      </footer>
      <div className="absolute bottom-4 right-4 opacity-80 flex items-end gap-2 z-10">
        <p className="text-xs text-muted-foreground text-right max-w-[150px] self-center pb-2 pr-1">No te preocupes por mi, solo veo como juegas</p>
        <div className="text-center">
          <Image
            src="/Jigsaw 2.png"
            alt="Jigsaw pequeño"
            width={72}
            height={96}
            className="text-muted-foreground animate-pulse"
            data-ai-hint="horror character"
          />
          <p className="text-xs text-muted-foreground">Jigsaw</p>
        </div>
      </div>
    </div>
  );
}
