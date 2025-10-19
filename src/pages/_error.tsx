import { Button } from '@/components/ui/button';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface ErrorProps {
  statusCode?: number;
}

const errorData: Record<
  number | 'default',
  { title: string; message: string; img: string }
> = {
  404: {
    title: 'Page Not Found',
    message: 'Sorry, the page you are looking for does not exist.',
    img: '/404.png',
  },
  default: {
    title: 'Error',
    message: 'An unexpected error occurred.',
    img: '/500.png',
  },
};

const ErrorPage = ({ statusCode }: ErrorProps) => {
  const { title, message, img } =
    errorData[statusCode as number] || errorData['default'];
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={message} />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="flex flex-col items-center justify-center h-full px-4 text-center bg-background">
        <img
          src={img}
          alt={title}
          className="w-56 md:w-64 lg:w-80 object-contain mb-2"
        />

        <h2 className="text-3xl md:text-4xl font-semibold text-foreground/80">
          {title}
        </h2>

        <p className="text-lg md:text-xl text-foreground/60 mb-4 max-w-md">
          {message}
        </p>

        <Button variant="outline" onClick={()=>router.push("/")}>
          Go Back Home
        </Button>
      </div>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
