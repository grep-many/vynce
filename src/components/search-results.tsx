import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { uploadTimeCal } from '@/lib';
import VideoCard from './video/card';
const SearchResult = ({ query }: any) => {
  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Enter a search term to find videos and channels.
        </p>
      </div>
    );
  }
  const [video, setvideos] = useState<any>(null);
  const videos = async () => {
    const allVideos = [
      {
        _id: '1',
        videotitle: 'Amazing Nature Documentary',
        filename: 'nature-doc.mp4',
        filetype: 'video/mp4',
        filepath: '/vdo.mp4',
        filesize: '500MB',
        videochanel: 'Nature Channel',
        Like: 1250,
        views: 45000,
        uploader: 'nature_lover',
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        videotitle: 'Cooking Tutorial: Perfect Pasta',
        filename: 'pasta-tutorial.mp4',
        filetype: 'video/mp4',
        filepath: '/vdo.mp4',
        filesize: '300MB',
        videochanel: "Chef's Kitchen",
        Like: 890,
        views: 23000,
        uploader: 'chef_master',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    let results = allVideos.filter(
      (vid) =>
        vid.videotitle.toLowerCase().includes(query.toLowerCase()) ||
        vid.videochanel.toLowerCase().includes(query.toLowerCase()),
    );
    setvideos(results);
  };
  useEffect(() => {
    videos();
  }, [query]);
  if (!video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-600">
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }
  const hasResults = video ? video.length > 0 : true;
  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-600">
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }
  const vids = '/video/vdo.mp4';
  return (
    <div className="space-y-6">
      {/* Video Results */}
      {video.length > 0 && (
        <div className="space-y-4">
          {video.map((vid: any) => (
            <VideoCard
              key={vid._id}
              video={{
                _id: vid._id,
                title: vid.videotitle,
                channel: vid.videochanel,
                views: vid.views,
                createdAt: vid.createdAt,
                filepath: vid.filepath,
                duration: '10:24', // optional, or compute from video metadata
              }}
              type="content" // reuse your updated history layout (matches SearchResult style)
            />
          ))}
        </div>
      )}

      {/* Load More Results */}
      {hasResults && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Showing {videos.length} results for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;