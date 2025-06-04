"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TypewriterText from '@/components/typewriter-text';
import Image from 'next/image'; // Using next/image for potential optimization if user later provides actual image
import { Film, Music } from 'lucide-react';

const introSegments = [
  "Hola, Adrian. Quiero jugar un juego.",
  "Has vivido una vida de complacencia, sin apreciar los pequeños detalles, los desafíos...",
  "Hoy, eso cambiará. Te he preparado una serie de pruebas.",
  "Superarlas no será fácil. Pero si lo logras, quizás aprendas algo valioso.",
  "Tu tiempo comienza... ahora. ¿Aceptas el reto?",
];

export default function JigsawIntroPage() {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [jigsawMusicPlaying, setJigsawMusicPlaying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (jigsawMusicPlaying) {
      console.log("Jigsaw music playing...");
    } else {
      console.log("Jigsaw music stopped.");
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
      {/* Aquí se reproduce jigsaw_music.mp3 */}
      {jigsawMusicPlaying && (
         <div className="absolute top-4 right-4 text-sm text-muted-foreground flex items-center gap-2">
          <Music size={16} /> (Música de Jigsaw sonando...)
        </div>
      )}

      <div className="w-full md:w-1/3 flex justify-center items-center mb-8 md:mb-0 md:pr-8">
        {/* Aquí va jigsaw.png */}
        <div className="bg-card p-4 rounded-lg shadow-xl w-64 h-96 md:w-80 md:h-[450px] flex flex-col items-center justify-center text-center border-2 border-primary animate-pulse">
            <Film size={128} className="text-destructive mb-4" />
            <p className="text-muted-foreground font-mono">jigsaw.png</p>
            <p className="text-sm text-muted-foreground">(Imagen de Jigsaw aquí)</p>
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
