import Loading from '@/components/loading';
import SearchResult from '@/components/search-results';
import { useRouter } from 'next/router';
import React from 'react';

const Search = () => {
  const router = useRouter();
  const { q } = router.query;
  return (
    <div className="flex-1 p-4">
      <div className="max-w-6xl">
        {q && (
          <div className="mb-6">
            <h1 className="text-xl font-medium mb-4">
              Search results for "{q}"
            </h1>
          </div>
        )}
        <React.Suspense fallback={<Loading/>}>
          <SearchResult query={q || ''} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default Search;
