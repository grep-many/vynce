import React from 'react';
import { Button } from './ui/button';
import {
  Clock,
  History,
  LogOut,
  Menu,
  Search,
  ThumbsUp,
  TvMinimalPlay,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ModeToggle } from './mode-toggle';
import { extractInitials } from '@/lib';
import ChannelDialogue from './channel/dialog';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';
import useMobile from '@/hooks/useMobile';
import Image from 'next/image';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [query, setQuery] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  const router = useRouter();
  const { user, logOut, googleSignIn } = useAuth();
  const isMobile = useMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&page=1`);
      if (isMobile) setMobileSearchOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(e as any);
  };

  React.useEffect(() => {
    if (router.query.q && typeof router.query.q === 'string') {
      setQuery(router.query.q);
    } else {
      setQuery('');
    }
  }, [router.query.q]);

  return (
    <header className="flex items-center justify-between px-2 py-2 border-b bg-background/70 backdrop-blur-2xl z-50">
      {/* LEFT: Menu + Logo */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-1 md:gap-6">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="w-6 h-6" />
          </Button>
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.png"
              height={30}
              width={30}
              alt="vince"
              className="invert-0 dark:invert"
            />
            <span className="text-xl font-medium">Vynce</span>
            <span className="text-xs text-muted-foreground ml-1">IN</span>
          </Link>
        </div>
      )}

      {/* CENTER: Search */}
      {(!isMobile || mobileSearchOpen) && (
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 flex-1 max-w-2xl mx-4"
        >
          <div className="flex flex-1 items-center">
            {/* X BUTTON ON MOBILE LEFT */}
            {isMobile && mobileSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setMobileSearchOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}

            <Input
              type="search"
              placeholder="Search"
              value={query}
              onKeyDown={handleKeyPress}
              onChange={({ target }) => setQuery(target.value)}
              className="rounded-full flex-1 focus-visible:ring-0"
              autoFocus={mobileSearchOpen}
            />

            <Button
              type="submit"
              variant="secondary"
              className="ml-2 rounded-full px-6"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </form>
      )}

      {/* RIGHT: Icons / User */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-2 pr-0 md:pr-10">
          {isMobile && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
          )}

          {!isMobile && !user && <ModeToggle />}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative rounded-full w-8 h-8"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {extractInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="p-2"
                side="bottom"
                align="end"
                forceMount
              >
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>
                        {extractInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </span>
                    </div>
                    <ModeToggle />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.channel ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/channel/${user.channel._id}`}>
                      <TvMinimalPlay className="w-4 h-4" />
                      My channel
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <div className="px-2 py-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Create Channel
                    </Button>
                  </div>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/history`}>
                    <History className="w-4 h-4" />
                    History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/liked`}>
                    <ThumbsUp className="w-4 h-4" />
                    Liked video
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/watch/later`}>
                    <Clock className="w-4 h-4" />
                    Watch later
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logOut}>
                  <LogOut className="w-4 h-4 text-destructive" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isMobile && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={googleSignIn}
              >
                <User className="w-4 h-4" />
                Sign in
              </Button>
            )
          )}
        </div>
      )}

      <ChannelDialogue
        isopen={isDialogOpen}
        onclose={() => setIsDialogOpen(false)}
        mode="create"
      />
    </header>
  );
};

export default Header;