import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Film, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 rounded-full bg-cinema-gold/10 flex items-center justify-center mx-auto mb-6">
          <Film className="w-10 h-10 text-cinema-gold" />
        </div>
        <h1 className="text-6xl font-bold text-cinema-gold mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Scene Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for seems to have been cut from the final edit.
        </p>
        <Button variant="cinema" asChild className="w-full">
          <a href="/">
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
