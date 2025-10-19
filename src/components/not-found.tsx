import React from 'react';
import { Button } from './ui/button';

interface Props {
  message: string;
  button?: {
    onClick: () => void;
    text: string;
  };
}

const NotFound: React.FC<Props> = ({ message, button }) => {
  return (
    <div className="h-full flex justify-center items-center p-4">
      <div className="text-center">
        <img
          src="/not-found.png"
          alt="Illustration showing no results found"
          className="w-56 md:w-64 lg:w-80 object-contain mb-4 mx-auto"
        />
        <p
          className="text-muted-foreground text-lg md:text-xl lg:text-2xl font-medium mb-4"
          role="alert"
        >
          {message}
        </p>
        {button && (
          <Button variant="outline" onClick={button.onClick}>
            {button.text}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
