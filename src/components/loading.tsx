import React from 'react'
import { Spinner } from './ui/spinner';
import { Button } from './ui/button';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Button variant="outline" disabled size="sm">
        <Spinner />
        Please wait
      </Button>
    </div>
  );
}

export default Loading
