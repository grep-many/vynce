'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Loading from '@/components/loading';
import SearchResult from '@/components/search-results';
import NotFound from '@/components/not-found';

const Search: React.FC = () => {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!q) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q as string)}`,
        );
        const data = await res.json();
        setResults(data.videos || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  // No query entered
  if (!q) {
    return (
      <NotFound
        message="Please enter a search query."
        button={{
          text: 'Explore Videos',
          onClick: () => router.push('/'),
        }}
      />
    );
  }

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // No results found
  if (!results || results.length === 0) {
    return (
      <NotFound
        message={`No results found for "${q}"`}
        button={{
          text: 'Explore Videos',
          onClick: () => router.push('/'),
        }}
      />
    );
  }

  return (
    <div className="flex-1 p-4">
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-xl font-medium mb-4">Search results for "{q}"</h1>
        </div>
        <SearchResult />
      </div>
    </div>
  );
};

export default Search;
