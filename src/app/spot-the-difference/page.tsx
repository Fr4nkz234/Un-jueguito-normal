
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import GamePageLayout from '@/components/game-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, RotateCcw, Play, Smile, Frown, Diamond, Square, Circle as LucideCircle, Heart, Star, Triangle, Cloud, Sun, Moon, Zap } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const INITIAL_GRID_SIZE = 2;
const MAX_GRID_SIZE = 6;
const INITIAL_TIME_PER_LEVEL = 10000; // ms
const TIME_DECREMENT_PER_LEVEL = 500; // ms
const MIN_TIME_PER_LEVEL = 3000; // ms

interface Figure {
  id: string;
  Icon: React.ComponentType<LucideProps>;
  isDifferent: boolean;
  color: string;
  rotation: number;
  scale: number;
}

const iconPool: React.ComponentType<LucideProps>[] = [Smile, Frown, Diamond, Square, LucideCircle, Heart, Star, Triangle, Cloud, Sun, Moon, Zap];
const colorPool = ['text-primary', 'text-accent', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-pink-500', 'text-purple-500', 'text-orange-500', 'text-teal-500'];
const rotationPool = [0, 45, 90, 135, 180, 225, 270, 315];
const scalePool = [1, 0.85, 1.15]; // Normal, slightly smaller, slightly larger


export default function SpotTheDifferencePage() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gridSize, setGridSize] = useState(INITIAL_GRID_SIZE);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_PER_LEVEL);
  const [gameState, setGameState] = useState<'initial' | 'playing' | 'levelWon' | 'gameOver'>('initial');
  const [timePerLevel, setTimePerLevel] = useState(INITIAL_TIME_PER_LEVEL);
  const [feedbackMessage, setFeedbackMessage] = useState("Encuentra la figura diferente.");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateGrid = useCallback(() => {
    const newFigures: Figure[] = [];
    const totalFigures = gridSize * gridSize;
    
    const commonIcon = iconPool[Math.floor(Math.random() * iconPool.length)];
    const commonColor = colorPool[Math.floor(Math.random() * colorPool.length)];
    const commonRotation = 0; // Keep common rotation simple
    const commonScale = 1;    // Keep common scale simple

    let diffIcon = commonIcon;
    let diffColor = commonColor;
    let diffRotation = commonRotation;
    let diffScale = commonScale;

    // Determine type of difference based on level
    const difficultyFactor = Math.min(level / 10, 1); // Max 1, increases with level
    const rand = Math.random();

    if (rand < 0.33 + difficultyFactor * 0.1 && iconPool.length > 1) { // Change Icon
      do { diffIcon = iconPool[Math.floor(Math.random() * iconPool.length)]; } while (diffIcon === commonIcon);
    } else if (rand < 0.66 + difficultyFactor * 0.15 && colorPool.length > 1) { // Change Color
      do { diffColor = colorPool[Math.floor(Math.random() * colorPool.length)]; } while (diffColor === commonColor);
    } else if (rand < 0.85 + difficultyFactor * 0.2 && rotationPool.length > 1) { // Change Rotation (more subtle)
      do { diffRotation = rotationPool[Math.floor(Math.random() * rotationPool.length)]; } while (diffRotation === commonRotation);
    } else if (scalePool.length > 1) { // Change Scale (most subtle)
       do { diffScale = scalePool[Math.floor(Math.random() * scalePool.length)]; } while (diffScale === commonScale);
    } else { // Fallback: ensure at least one difference
      if (iconPool.length > 1) do { diffIcon = iconPool[Math.floor(Math.random() * iconPool.length)]; } while (diffIcon === commonIcon);
      else if (colorPool.length > 1) do { diffColor = colorPool[Math.floor(Math.random() * colorPool.length)]; } while (diffColor === commonColor);
    }
    
    // Ensure there's a difference if all picked same due to small pools
    if (diffIcon === commonIcon && diffColor === commonColor && diffRotation === commonRotation && diffScale === commonScale) {
        if (iconPool.length > 1) { do { diffIcon = iconPool[Math.floor(Math.random() * iconPool.length)]; } while (diffIcon === commonIcon); }
        else if (colorPool.length > 1) { do { diffColor = colorPool[Math.floor(Math.random() * colorPool.length)]; } while (diffColor === commonColor); }
        else if (rotationPool.length > 1 && commonRotation === 0) { diffRotation = rotationPool[1]; } // Pick a non-zero rotation
        else if (scalePool.length > 1 && commonScale === 1) { diffScale = scalePool[1];} // Pick a non-1 scale
    }


    const differentFigureIndex = Math.floor(Math.random() * totalFigures);

    for (let i = 0; i < totalFigures; i++) {
      const isDifferent = i === differentFigureIndex;
      newFigures.push({
        id: `fig-${Date.now()}-${i}`,
        Icon: isDifferent ? diffIcon : commonIcon,
        isDifferent,
        color: isDifferent ? diffColor : commonColor,
        rotation: isDifferent ? diffRotation : commonRotation,
        scale: isDifferent ? diffScale : commonScale,
      });
    }
    setFigures(newFigures);
  }, [gridSize, level]);

  const startLevel = useCallback(() => {
    generateGrid();
    setTimeLeft(timePerLevel);
    setGameState('playing');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState('gameOver');
          setFeedbackMessage('¡Tiempo agotado!');
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  }, [generateGrid, timePerLevel]);

  const handleFigureClick = (figure: Figure) => {
    if (gameState !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);

    if (figure.isDifferent) {
      setScore(prev => prev + gridSize * 50 + Math.floor(timeLeft / 100));
      setGameState('levelWon');
      setFeedbackMessage(`¡Correcto! Nivel ${level} superado.`);
    } else {
      setGameState('gameOver');
      setFeedbackMessage('¡Incorrecto! Esa no era la figura diferente.');
    }
  };

  const handleNextAction = () => {
    if (gameState === 'initial' || gameState === 'gameOver') {
      setLevel(1);
      setScore(0);
      setGridSize(INITIAL_GRID_SIZE);
      setTimePerLevel(INITIAL_TIME_PER_LEVEL);
      setFeedbackMessage("Encuentra la figura diferente.");
      startLevel();
    } else if (gameState === 'levelWon') {
      setLevel(prev => prev + 1);
      setGridSize(prev => Math.min(prev + (level % 2 === 0 ? 1 : 0), MAX_GRID_SIZE));
      setTimePerLevel(prev => Math.max(prev - TIME_DECREMENT_PER_LEVEL, MIN_TIME_PER_LEVEL));
      setFeedbackMessage("Encuentra la figura diferente.");
      startLevel();
    }
  };
  
  useEffect(() => {
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const figureSizePx = Math.max(32, 72 - (gridSize - 2) * 10); 
  const gridGapPx = gridSize > 4 ? 4 : 8;
  const totalGridWidthPx = gridSize * (figureSizePx + gridGapPx) - gridGapPx;


  return (
    <GamePageLayout gameTitle="Encuentra el Diferente">
      <Card className="w-full max-w-xl text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Eye size={64} className="text-accent" />
          </div>
          <CardTitle>Encuentra el Diferente</CardTitle>
          <CardDescription className="min-h-[1.5em]">{feedbackMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-around items-center mb-4 p-2 bg-muted/50 rounded-md">
            <p>Nivel: <span className="font-bold text-lg">{level}</span></p>
            <p>Puntuación: <span className="font-bold text-lg">{score}</span></p>
          </div>

          {gameState === 'playing' && (
             <p className="text-xl font-semibold">Tiempo: <span className={(timeLeft <= 3000 && timeLeft > 0 && timeLeft % 1000 < 500) ? 'text-destructive animate-ping' : (timeLeft <= 3000 && timeLeft > 0) ? 'text-destructive' : ''}>{(timeLeft / 1000).toFixed(1)}s</span></p>
          )}

          <div 
            className="grid place-items-center mx-auto bg-card-foreground/10 p-4 rounded-md shadow-inner select-none"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: `${gridGapPx}px`,
              width: `${totalGridWidthPx}px`,
              maxWidth: '100%',
            }}
          >
            {gameState === 'playing' && figures.map(figure => (
              <Button
                key={figure.id}
                variant="outline"
                className={`flex items-center justify-center aspect-square hover:bg-accent/20 focus:bg-accent/30 transition-all duration-150 p-0`}
                style={{ height: `${figureSizePx}px`, width: `${figureSizePx}px`}}
                onClick={() => handleFigureClick(figure)}
                aria-label={`Figura ${figure.id.substring(figure.id.lastIndexOf('-') + 1)}`}
              >
                <figure.Icon 
                    className={`${figure.color} transition-transform duration-200`} 
                    size={figureSizePx * 0.7} 
                    style={{transform: `rotate(${figure.rotation}deg) scale(${figure.scale})`}} 
                />
              </Button>
            ))}
            {(gameState === 'levelWon' || gameState === 'gameOver') && (
                 <div className={`col-span-full flex items-center justify-center bg-background/70`} style={{minHeight: `${Math.min(200, totalGridWidthPx)}px`}}>
                    <p className="text-2xl font-bold text-accent-foreground p-4 bg-card rounded-lg shadow-lg">
                        {gameState === 'levelWon' ? `¡Nivel ${level} Superado!` : '¡Juego Terminado!'}
                    </p>
                </div>
            )}
             {gameState === 'initial' && (
                 <div className={`col-span-full flex items-center justify-center`} style={{minHeight: `${Math.min(200, totalGridWidthPx)}px`}}>
                    <p className="text-xl font-semibold text-muted-foreground">Presiona "Iniciar Juego" para comenzar.</p>
                </div>
            )}
          </div>
          
          <Button 
            onClick={handleNextAction} 
            className="w-full sm:w-auto mt-4"
            aria-live="polite"
            disabled={gameState === 'playing'}
          >
            {gameState === 'initial' && <><Play className="mr-2 h-4 w-4" />Iniciar Juego</>}
            {gameState === 'playing' && <>¡Busca y encuentra!</>}
            {gameState === 'levelWon' && <><Play className="mr-2 h-4 w-4" />Siguiente Nivel</>}
            {gameState === 'gameOver' && <><RotateCcw className="mr-2 h-4 w-4" />Jugar de Nuevo</>}
          </Button>

        </CardContent>
        <CardFooter className="text-xs text-muted-foreground justify-center">
            Encuentra la figura única antes de que se acabe el tiempo. ¡Cada detalle cuenta!
        </CardFooter>
      </Card>
    </GamePageLayout>
  );
}
