"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react'; // Changed to a more distinct icon

export default function ReturnToMenuButton() {
  const router = useRouter();
  return (
    <Button 
      variant="outline" 
      onClick={() => router.push('/game-menu')} 
      className="shadow-md hover:shadow-lg transition-shadow"
      aria-label="Volver al menú principal de juegos"
    >
      <ArrowLeftCircle className="mr-2 h-5 w-5 text-primary" />
      Volver al menú
    </Button>
  );
}
