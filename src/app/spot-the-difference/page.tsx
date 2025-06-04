import GamePageLayout from '@/components/game-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react'; // Using Eye icon as Search might be too generic

export default function SpotTheDifferencePage() {
  return (
    <GamePageLayout gameTitle="Encuentra el Diferente">
      <Card className="w-full max-w-2xl text-center shadow-xl"> {/* Max-width increased for potential two-image layout */}
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Eye size={64} className="text-accent" />
          </div>
          <CardTitle>¡Bienvenido a Encuentra el Diferente!</CardTitle>
          <CardDescription>Próximamente: Compara imágenes y halla las diferencias.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El juego Encuentra el Diferente está en desarrollo.
            Afina tu percepción visual y encuentra todas las diferencias entre dos imágenes aparentemente idénticas.
            ¡Cada detalle cuenta!
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-dashed border-2 border-muted-foreground rounded-md">
            <div>
              <p className="font-semibold text-lg">Imagen Izquierda (Placeholder)</p>
              <div data-ai-hint="abstract pattern" className="bg-muted-foreground/20 h-64 rounded-md flex items-center justify-center text-muted-foreground">Imagen 1</div>
            </div>
            <div>
              <p className="font-semibold text-lg">Imagen Derecha (Placeholder)</p>
              <div data-ai-hint="abstract pattern" className="bg-muted-foreground/20 h-64 rounded-md flex items-center justify-center text-muted-foreground">Imagen 2</div>
            </div>
          </div>
           <p className="text-sm text-muted-foreground mt-4">Contador de diferencias, clics, etc.</p>
        </CardContent>
      </Card>
    </GamePageLayout>
  );
}
