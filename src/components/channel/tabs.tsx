import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'videos', label: 'Videos' },
  { id: 'shorts', label: 'Shorts' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'community', label: 'Community' },
  { id: 'about', label: 'About' },
];

const ChannelTabs = () => {
  const [activeTab, setActiveTab] = useState('videos');

  const handleClick=({id,label})=> {
    setActiveTab(id);
    toast.warning(`${id} is just for demo!`)
  }

  return (
    <div className="border-b border-border bg-background px-4">
      <div className="flex gap-4 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`px-2 py-4 border-b-2 rounded-none rounded-t transition-colors ${
              activeTab === tab.id
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={()=>handleClick(tab)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChannelTabs;
