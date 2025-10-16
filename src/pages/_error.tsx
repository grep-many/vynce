// pages/_error.tsx
import { NextPageContext } from 'next';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold mb-2">
        {statusCode ? `Error ${statusCode}` : 'An unexpected error occurred'}
      </h1>
      <p className="text-muted-foreground">
        {statusCode === 404
          ? 'Page not found.'
          : 'Something went wrong on our end.'}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
