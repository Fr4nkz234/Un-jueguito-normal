
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TypewriterText from '@/components/typewriter-text';
import Image from 'next/image';
import { Music } from 'lucide-react';

const introSegments = [
  "Hola, Adrián. Nos volvemos a encontrar. Hoy no vengo a cuestionar tus métodos de cómo elegir estudiantes para las exposiciones.",
  "Verás, Luego de mi fracaso en mi misión de cifrar datos y molestar a la gente, he encontrado el camino de la redención y los caballos, por lo que ya no me dedico a ese tipo de cosas (Por ahora)...",
  "Lo único que no he podido dejar es hacer a las personas jugar juegos. Y es por eso que hoy te traigo esta aplicación que encargué a mi subordinado desarrollar, contenerizar y hacerle algunas pruebas de seguridad.",
  "Le dije que te dejara un informe sobre las pruebas por si le quieres echar un vistazo más tarde...",
  "Es una App sencilla, tiene tres juegos de los cuales puedes elegir el que desees jugar, yo solo me quedaré mirando qué tal lo haces. Ganar o morir, que empiece el juego.",
];

export default function JigsawIntroPage() {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [jigsawMusicPlaying, setJigsawMusicPlaying] = useState(true);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (jigsawMusicPlaying) {
        audioRef.current.play().catch(error => console.warn("Jigsaw music autoplay was prevented. User interaction might be needed.", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [jigsawMusicPlaying]);

  const handleNextSegment = () => {
    if (currentSegmentIndex < introSegments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setIsTextComplete(false);
    } else {
      setJigsawMusicPlaying(false); 
      router.push('/game-menu');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-8 bg-background text-foreground relative">
      <audio ref={audioRef} src="/Saw Theme.mp3" loop preload="auto" />
      {jigsawMusicPlaying && (
         <div className="absolute top-4 right-4 text-sm text-muted-foreground flex items-center gap-2 bg-background/50 p-2 rounded-md shadow">
          <Music size={16} /> <span className="hidden sm:inline"></span>
        </div>
      )}

      <div className="w-full md:w-1/3 flex justify-center items-center mb-8 md:mb-0 md:pr-8">
        <div className="bg-card p-4 rounded-lg shadow-xl w-72 h-[405px] md:w-80 md:h-[450px] flex flex-col items-center justify-center text-center border-2 border-primary animate-pulse overflow-hidden">
            <Image
              src="/Jigsaw.png"
              alt="Imagen de Jigsaw"
              width={320}
              height={450}
              className="object-cover w-full h-full"
              priority
              data-ai-hint="horror character"
            />
        </div>
      </div>

      <div className="w-full md:w-2/3 md:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="bg-card p-6 rounded-lg shadow-xl min-h-[150px] w-full max-w-2xl mb-6">
          <TypewriterText
            text={introSegments[currentSegmentIndex]}
            speed={40}
            onComplete={() => setIsTextComplete(true)}
            className="text-xl md:text-2xl font-mono leading-relaxed text-accent-foreground"
          />
        </div>
        {isTextComplete && (
          <Button
            onClick={handleNextSegment}
            className="bg-accent hover:bg-accent/80 text-accent-foreground text-lg px-8 py-6 shadow-lg transition-transform transform hover:scale-105"
            aria-label={currentSegmentIndex === introSegments.length - 1 ? "Finalizar introducción" : "Continuar con la introducción"}
          >
            {currentSegmentIndex === introSegments.length - 1 ? 'Finalizar' : 'Continuar'}
          </Button>
        )}
      </div>
    </div>
  );
}
