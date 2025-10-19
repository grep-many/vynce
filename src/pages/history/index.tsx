// src/pages/history/index.tsx
'use client';

import React from 'react';
import useHistory from '@/hooks/useHistory';
import Content from '@/components/video/content';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';

const HistoryPage = () => {
  const { videos, fetchHistory, removeVideo, clearAll, loading } = useHistory();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  return (
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Watch History</h1>
        {videos.length > 0 && (
          <Button
            variant="destructive"
            onClick={clearAll}
            className="mb-4 px-4 py-2 rounded"
          >
            Clear All
          </Button>
        )}
        <Content
          videos={videos}
          type="history"
          user={user} // pass user if needed
          onRemove={removeVideo}
          emptyMessage="You haven't watched any videos yet."
        />
      </div>
    </main>
  );
};

export default HistoryPage;
