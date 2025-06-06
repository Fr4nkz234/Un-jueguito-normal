
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Added import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle, Target, Search } from 'lucide-react';

interface GameInfo {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const games: GameInfo[] = [
  {
    title: 'Ahorcado Numérico',
    description: 'Adivina el número secreto antes de que se acaben los intentos.',
    href: '/numerical-hangman',
    icon: Puzzle,
  },
  {
    title: 'Toques en Cadena',
    description: 'Toca los círculos numerados en orden antes de que desaparezcan.',
    href: '/chain-touch',
    icon: Target,
  },
  {
    title: 'Encuentra el Diferente',
    description: 'Agudiza tu vista y encuentra las diferencias entre las imágenes.',
    href: '/spot-the-difference',
    icon: Search,
  },
];

export default function GameMenuPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <div className="text-center mb-12 pt-12 sm:pt-0">
        <h1 className="text-5xl font-headline mb-4 text-primary">Menú de Juegos</h1>
        <p className="text-lg text-muted-foreground">Elige tu desafío. Que comience el juego.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {games.map((game) => (
          <Card key={game.title} className="hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm">
            <CardHeader className="items-center text-center">
              <game.icon className="w-16 h-16 mb-4 text-accent" />
              <CardTitle className="text-2xl font-headline">{game.title}</CardTitle>
              <CardDescription className="text-muted-foreground h-12">{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href={game.href} passHref>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3"
                  aria-label={`Jugar a ${game.title}`}
                >
                  Jugar
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Added Jigsaw image and text back here */}
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
      
       <footer className="absolute bottom-2 text-xs text-muted-foreground/50">
        Game Chamber - Desafía tus límites
      </footer>
    </div>
  );
}
