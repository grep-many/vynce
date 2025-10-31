import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme, systemTheme, theme } = useTheme();
  const [IsMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => setIsMounted(true), []);
  const currentTheme = React.useMemo(
    () => (theme === 'system' ? systemTheme : theme),
    [theme, systemTheme],
  );

  if (!IsMounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
      className="relative"
    >
      <Sun
        className={`
        h-[1.2rem] w-[1.2rem] transition-all duration-300 absolute
        ${
          currentTheme === 'dark'
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }
      `}
      />
      <Moon
        className={`
        h-[1.2rem] w-[1.2rem] transition-all duration-300 absolute
        ${
          currentTheme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }
      `}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
