import {
  Home,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  TvMinimalPlay,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import ChannelDialogue from './channel/dialog';
import useAuth from '@/hooks/useAuth';

interface SidebarProps {
  sidebarOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, onClose }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <aside
      className={`
          bg-background border-r h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-full md:w-64 p-2' : 'w-0 p-0'}
          overflow-hidden
          md:static md:block
          fixed top-0 left-0 z-50 md:z-auto
        `}
    >
      {/* Mobile close button at top */}
      {onClose && (
        <div className=" w-full flex justify-end px-2 py-4">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      )}

      <nav className="space-y-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Home
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="ghost" className="w-full justify-start">
            <History className="w-5 h-5 mr-3" />
            History
          </Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start">
            <PlaySquare className="w-5 h-5 mr-3" />
            Subscriptions
          </Button>
        </Link>

        {user && (
          <div className="border-t pt-2 mt-2 space-y-1">
            <Link href="/liked">
              <Button variant="ghost" className="w-full justify-start">
                <ThumbsUp className="w-5 h-5 mr-3" />
                Liked videos
              </Button>
            </Link>
            <Link href="/watch/later">
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="w-5 h-5 mr-3" />
                Watch later
              </Button>
            </Link>
            {user?.channel ? (
              <Link href={`/channel/${user.channel._id}`}>
                <Button variant="ghost" className="w-full justify-start">
                  <TvMinimalPlay className="w-5 h-5 mr-3" />
                  My Channel
                </Button>
              </Link>
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
          </div>
        )}
      </nav>

      <ChannelDialogue
        isopen={isDialogOpen}
        onclose={() => setIsDialogOpen(false)}
        mode="create"
      />
    </aside>
  );
};

export default Sidebar;
