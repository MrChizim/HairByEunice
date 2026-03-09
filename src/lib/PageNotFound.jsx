import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-7xl font-light text-muted-foreground">404</h1>
        <h2 className="text-2xl font-medium text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page <span className="font-medium">"{pageName}"</span> does not exist.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
