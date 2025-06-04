import type { ReactNode } from 'react';
import ReturnToMenuButton from '@/components/return-to-menu-button';

interface GamePageLayoutProps {
  children: ReactNode;
  gameTitle: string;
}

export default function GamePageLayout({ children, gameTitle }: GamePageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background">
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
    </div>
  );
}
