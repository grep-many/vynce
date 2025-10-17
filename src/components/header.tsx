import React from 'react';
import { Button } from './ui/button';
import {
  Bell,
  Clock,
  History,
  LogOut,
  Menu,
  Mic,
  Search,
  ThumbsUp,
  TvMinimalPlay,
  User,
  VideoIcon,
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
import Image from 'next/image';

const Header = () => {
  //TODO: remove the below the static testing user object
  const [query, setQuery] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const router = useRouter();
  const { user, logOut, googleSignIn } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handlekeypress = (e: React.KeyboardEvent)=>{
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background/70 backdrop-blur-2xl z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
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
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 flex-1 max-w-2xl mx-4"
      >
        <div className="flex flex-1">
          <Input
            type="search"
            placeholder="Search"
            value={query}
            onKeyDown={handlekeypress}
            onChange={({ target }) => setQuery(target.value)}
            className="rounded-l-full border-r-0 focus-visible:ring-0"
          />
          <Button
            type="submit"
            variant="secondary"
            className="rounded-r-full px-6 border border-l-0"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Mic className="w-5 h-5" />
        </Button>
      </form>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Button variant="secondary">
              <VideoIcon />
            </Button>
            <Button variant="secondary">
              <Bell />
            </Button>
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
                    <Link href={`/channel/${user?._id}`}>
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
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={googleSignIn}
            >
              <User className="w-4 h-4" />
              Sign in
            </Button>
          </>
        )}
      </div>
      <ChannelDialogue
        isopen={isDialogOpen}
        onclose={() => setIsDialogOpen(false)}
        mode="create"
      />
    </header>
  );
};

export default Header;
