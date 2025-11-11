import { Home, History, Dumbbell, TrendingUp, LayoutTemplate } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: LayoutTemplate, label: 'Templates', path: '/templates' },
    { icon: Dumbbell, label: 'Exercises', path: '/exercises' },
    { icon: History, label: 'History', path: '/history' },
    { icon: TrendingUp, label: 'Progress', path: '/progress' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-primary">Gym Tracker</h1>
          
          <div className="hidden md:flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn('gap-2', isActive && 'bg-primary text-primary-foreground')}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => navigate(item.path)}
                  className={cn(isActive && 'bg-primary text-primary-foreground')}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
