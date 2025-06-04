import GamePageLayout from '@/components/game-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointerClick } from 'lucide-react';

export default function ChainTouchPage() {
  return (
    <GamePageLayout gameTitle="Toques en Cadena">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <MousePointerClick size={64} className="text-accent" />
          </div>
          <CardTitle>¡Prepárate para Toques en Cadena!</CardTitle>
          <CardDescription>Próximamente: Toca los círculos en orden.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El juego Toques en Cadena está en desarrollo.
            Este juego pondrá a prueba tus reflejos y concentración. Deberás tocar círculos numerados en secuencia antes de que el tiempo se agote.
            ¡Mantente alerta!
          </p>
          <div className="mt-6 p-4 border-dashed border-2 border-muted-foreground rounded-md">
            <p className="font-semibold text-lg">Área de Juego (Placeholder)</p>
            <p className="text-sm text-muted-foreground">Círculos numerados aparecerán aquí, contador de tiempo, puntuación...</p>
          </div>
        </CardContent>
      </Card>
    </GamePageLayout>
  );
}
