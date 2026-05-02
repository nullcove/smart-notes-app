import { Link } from "wouter";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="bg-muted h-24 w-24 rounded-full flex items-center justify-center shadow-inner">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
