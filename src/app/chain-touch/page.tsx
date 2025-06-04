
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import GamePageLayout from '@/components/game-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, RotateCcw, Play } from 'lucide-react';

const INITIAL_CIRCLES = 3;
const INITIAL_TIME_PER_CIRCLE = 3000; // ms
const MIN_TIME_PER_CIRCLE = 1000; // ms
const TIME_DECREMENT_PER_ROUND = 200; // ms
const CIRCLES_INCREMENT_PER_ROUND = 1;
const MAX_CIRCLES = 10;

interface Circle {
  id: number;
  x: number; // percentage
  y: number; // percentage
  order: number;
  isClicked: boolean;
}

const GAME_AREA_SIZE_PX = 400; 
const CIRCLE_DIAMETER_PX = 50;

export default function ChainTouchPage() {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentExpectedClickOrder, setCurrentExpectedClickOrder] = useState(1);
  const [gameState, setGameState] = useState<'initial' | 'playing' | 'roundWon' | 'gameOver'>('initial');
  const [numCirclesInRound, setNumCirclesInRound] = useState(INITIAL_CIRCLES);
  const [timePerCircle, setTimePerCircle] = useState(INITIAL_TIME_PER_CIRCLE);
  const [feedbackMessage, setFeedbackMessage] = useState("Toca los círculos en orden ascendente.");
  
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);

  const generateCircles = useCallback(() => {
    const newCircles: Circle[] = [];
    const occupiedAreas: {minX: number, maxX: number, minY: number, maxY: number}[] = [];
    const circleRadiusPercent = (CIRCLE_DIAMETER_PX / 2 / GAME_AREA_SIZE_PX) * 100;


    for (let i = 0; i < numCirclesInRound; i++) {
      let x, y, isOverlapping;
      let attempts = 0;
      do {
        isOverlapping = false;
        // Ensure circles are within viewport, leaving space for their diameter
        // Position is center of circle
        x = Math.random() * (100 - circleRadiusPercent * 2) + circleRadiusPercent;
        y = Math.random() * (100 - circleRadiusPercent * 2) + circleRadiusPercent;

        const currentCircleArea = {
            minX: x - circleRadiusPercent, maxX: x + circleRadiusPercent,
            minY: y - circleRadiusPercent, maxY: y + circleRadiusPercent
        };

        for (const area of occupiedAreas) {
            if (currentCircleArea.maxX > area.minX && currentCircleArea.minX < area.maxX &&
                currentCircleArea.maxY > area.minY && currentCircleArea.minY < area.maxY) {
                isOverlapping = true;
                break;
            }
        }
        attempts++;
      } while (isOverlapping && attempts < 50); // Max 50 attempts to place a circle

      occupiedAreas.push({
          minX: x - circleRadiusPercent, maxX: x + circleRadiusPercent,
          minY: y - circleRadiusPercent, maxY: y + circleRadiusPercent
      });
      newCircles.push({ id: Date.now() + i, x, y, order: i + 1, isClicked: false });
    }
    setCircles(newCircles); // Order is fixed by order prop, visual shuffling not needed if numbers are shown
    setCurrentExpectedClickOrder(1);
  }, [numCirclesInRound]);


  const startRound = useCallback(() => {
    generateCircles();
    const totalRoundTime = numCirclesInRound * timePerCircle;
    setTimeLeft(totalRoundTime);
    setGameState('playing');

    if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    roundTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          if (roundTimerRef.current) clearInterval(roundTimerRef.current);
          setGameState('gameOver');
          setFeedbackMessage('¡Tiempo agotado!');
          return 0;
        }
        return prev - 100;
      });
    }, 100);

  }, [generateCircles, numCirclesInRound, timePerCircle]);

  useEffect(() => {
    if (gameState === 'playing' && circles.length > 0 && currentExpectedClickOrder > circles.length) {
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
      setScore(prev => prev + numCirclesInRound * 10);
      setGameState('roundWon');
      setFeedbackMessage(`¡Ronda ${round} completada!`);
    }
  }, [currentExpectedClickOrder, circles, gameState, round, numCirclesInRound]);

  const handleCircleClick = (clickedCircleOrder: number) => {
    if (gameState !== 'playing') return;

    if (clickedCircleOrder === currentExpectedClickOrder) {
      setCircles(prevCircles => 
        prevCircles.map(c => c.order === clickedCircleOrder ? { ...c, isClicked: true } : c)
      );
      setCurrentExpectedClickOrder(prev => prev + 1);
    } else {
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
      setGameState('gameOver');
      setFeedbackMessage('¡Error! Tocaste el círculo incorrecto.');
    }
  };

  const handleNextAction = () => {
    if (gameState === 'initial' || gameState === 'gameOver') {
      setRound(1);
      setScore(0);
      setNumCirclesInRound(INITIAL_CIRCLES);
      setTimePerCircle(INITIAL_TIME_PER_CIRCLE);
      setFeedbackMessage("Toca los círculos en orden ascendente.");
      startRound();
    } else if (gameState === 'roundWon') {
      setRound(prev => prev + 1);
      setNumCirclesInRound(prev => Math.min(prev + CIRCLES_INCREMENT_PER_ROUND, MAX_CIRCLES));
      setTimePerCircle(prev => Math.max(prev - TIME_DECREMENT_PER_ROUND, MIN_TIME_PER_CIRCLE));
      setFeedbackMessage("Toca los círculos en orden ascendente.");
      startRound();
    }
  };
  
  useEffect(() => {
    return () => { 
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    };
  }, []);

  return (
    <GamePageLayout gameTitle="Toques en Cadena">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Target size={64} className="text-accent" />
          </div>
          <CardTitle>Toques en Cadena</CardTitle>
          <CardDescription className="min-h-[1.5em]">{feedbackMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-around items-center mb-4 p-2 bg-muted/50 rounded-md">
            <p>Ronda: <span className="font-bold text-lg">{round}</span></p>
            <p>Puntuación: <span className="font-bold text-lg">{score}</span></p>
          </div>

          {gameState === 'playing' && (
            <p className="text-xl font-semibold">Tiempo: <span className={(timeLeft <= 3000 && timeLeft > 0 && timeLeft % 1000 < 500) ? 'text-destructive animate-ping' : (timeLeft <= 3000 && timeLeft > 0) ? 'text-destructive' : ''}>{(timeLeft / 1000).toFixed(1)}s</span></p>
          )}

          <div 
            className="relative w-full bg-card-foreground/10 rounded-md mx-auto overflow-hidden shadow-inner select-none"
            style={{ height: `${GAME_AREA_SIZE_PX}px` }}
          >
            {gameState === 'playing' && circles.map(circle => (
              !circle.isClicked && (
                <button
                  key={circle.id}
                  onClick={() => handleCircleClick(circle.order)}
                  className="absolute flex items-center justify-center rounded-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold text-xl transition-all duration-100 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{
                    left: `${circle.x}%`,
                    top: `${circle.y}%`,
                    width: `${CIRCLE_DIAMETER_PX}px`,
                    height: `${CIRCLE_DIAMETER_PX}px`,
                    transform: 'translate(-50%, -50%)', 
                  }}
                  aria-label={`Círculo número ${circle.order}`}
                >
                  {circle.order}
                </button>
              )
            ))}
             {(gameState === 'roundWon' || gameState === 'gameOver') && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                    <p className="text-2xl font-bold text-accent-foreground p-4 bg-card rounded-lg shadow-lg">
                        {gameState === 'roundWon' ? `¡Ronda ${round} Superada!` : '¡Juego Terminado!'}
                    </p>
                </div>
            )}
            {gameState === 'initial' && (
                 <div className="absolute inset-0 flex items-center justify-center">
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
            {gameState === 'playing' && <>Concentración...</>}
            {gameState === 'roundWon' && <><Play className="mr-2 h-4 w-4" />Siguiente Ronda</>}
            {gameState === 'gameOver' && <><RotateCcw className="mr-2 h-4 w-4" />Jugar de Nuevo</>}
          </Button>
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground justify-center">
          Toca los círculos en orden antes de que se acabe el tiempo.
        </CardFooter>
      </Card>
    </GamePageLayout>
  );
}
