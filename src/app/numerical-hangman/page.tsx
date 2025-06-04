import GamePageLayout from '@/components/game-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sigma } from 'lucide-react';

export default function NumericalHangmanPage() {
  return (
    <GamePageLayout gameTitle="Ahorcado Numérico">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Sigma size={64} className="text-accent" />
          </div>
          <CardTitle>¡Bienvenido al Ahorcado Numérico!</CardTitle>
          <CardDescription>Próximamente: Adivina el número secreto.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El juego Ahorcado Numérico está en desarrollo. 
            Aquí pondrás a prueba tu lógica y suerte para descifrar un número oculto antes de quedarte sin intentos.
            ¡Prepárate para el desafío!
          </p>
          <div className="mt-6 p-4 border-dashed border-2 border-muted-foreground rounded-md">
            <p className="font-semibold text-lg">Interacción del Juego (Placeholder)</p>
            <p className="text-sm text-muted-foreground">Entrada de número, pantalla de intentos, resultado...</p>
          </div>
        </CardContent>
      </Card>
    </GamePageLayout>
  );
}
