
"use client";

import { useState, useEffect, useCallback } from 'react';
import GamePageLayout from '@/components/game-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sigma, RotateCcw } from 'lucide-react';

const MAX_ATTEMPTS = 6;

const hangmanStages = [
  // 0 incorrect (6 attempts left) - initial state
  " _____\n |   |\n |    \n |    \n |    \n_|___",
  // 1 incorrect (5 attempts left)
  " _____\n |   |\n |   O\n |    \n |    \n_|___",
  // 2 incorrect (4 attempts left)
  " _____\n |   |\n |   O\n |   |\n |    \n_|___",
  // 3 incorrect (3 attempts left)
  " _____\n |   |\n |   O\n |  /|\n |    \n_|___",
  // 4 incorrect (2 attempts left)
  " _____\n |   |\n |   O\n |  /|\\\n |    \n_|___",
  // 5 incorrect (1 attempt left)
  " _____\n |   |\n |   O\n |  /|\\\n |  / \n_|___",
  // 6 incorrect (0 attempts left) - game over
  " _____\n |   |\n |   O\n |  /|\\\n |  / \\\n_|___",
];

export default function NumericalHangmanPage() {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [pastGuesses, setPastGuesses] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  const initializeGame = useCallback(() => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setFeedback('Adivina un número entre 1 y 100.');
    setAttemptsLeft(MAX_ATTEMPTS);
    setPastGuesses([]);
    setGameState('playing');
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setFeedback('Por favor, ingresa un número válido entre 1 y 100.');
      setGuess('');
      return;
    }

    if (pastGuesses.includes(numGuess)) {
      setFeedback(`Ya intentaste el número ${numGuess}. Prueba otro.`);
      setGuess('');
      return;
    }

    setPastGuesses(prev => [...prev, numGuess].sort((a,b) => a-b));

    if (numGuess === secretNumber) {
      setFeedback(`¡Correcto! El número secreto era ${secretNumber}. ¡Has ganado!`);
      setGameState('won');
    } else {
      const newAttemptsLeft = attemptsLeft - 1;
      setAttemptsLeft(newAttemptsLeft);
      if (newAttemptsLeft === 0) {
        setFeedback(`¡Ahorcado! El número secreto era ${secretNumber}. Has perdido.`);
        setGameState('lost');
      } else {
        setFeedback(numGuess < secretNumber ? `El número secreto es MAYOR que ${numGuess}.` : `El número secreto es MENOR que ${numGuess}.`);
      }
    }
    setGuess('');
  };

  const currentHangmanStage = MAX_ATTEMPTS - attemptsLeft;
  const hangmanDisplay = hangmanStages[Math.min(currentHangmanStage, hangmanStages.length - 1)];

  return (
    <GamePageLayout gameTitle="Ahorcado Numérico">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Sigma size={64} className="text-accent" />
          </div>
          <CardTitle>Ahorcado Numérico</CardTitle>
          <CardDescription>Adivina el número secreto (1-100).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-md">
            <pre className="text-lg font-mono text-foreground whitespace-pre-wrap select-none">
              {hangmanDisplay}
            </pre>
          </div>

          <p className={`text-lg font-semibold min-h-[2.5em] ${gameState === 'won' ? 'text-success' : gameState === 'lost' ? 'text-destructive' : 'text-foreground'}`}>
            {feedback}
          </p>
          
          <p className="text-muted-foreground">Intentos restantes: <span className="font-bold text-xl">{attemptsLeft}</span></p>
          
          {pastGuesses.length > 0 && (
            <div className="text-sm text-muted-foreground h-10 overflow-y-auto">
              Números intentados: {pastGuesses.join(', ')}
            </div>
          )}

          {gameState === 'playing' && (
            <form onSubmit={handleGuessSubmit} className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Label htmlFor="guess-input" className="sr-only">Tu intento</Label>
                <Input
                  id="guess-input"
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Ingresa un número"
                  min="1"
                  max="100"
                  required
                  className="max-w-xs mx-auto text-center text-lg"
                  disabled={gameState !== 'playing'}
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={gameState !== 'playing' || !guess} className="w-full sm:w-auto">
                Intentar
              </Button>
            </form>
          )}

          {gameState !== 'playing' && (
            <Button onClick={initializeGame} className="w-full sm:w-auto" variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Jugar de Nuevo
            </Button>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground justify-center">
          Tienes {MAX_ATTEMPTS} intentos para adivinar el número.
        </CardFooter>
      </Card>
    </GamePageLayout>
  );
}
