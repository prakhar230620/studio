import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <Utensils className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          The page you're looking for doesn't exist. Let's get you back to cooking!
        </p>
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
