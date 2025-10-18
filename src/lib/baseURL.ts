export const getBaseUrl = (req: NextApiRequest) => {
  const protocol = (req.headers['x-forwarded-proto'] as string) || 'http'; // fallback
  const host = req.headers.host;
  return `${protocol}://${host}`;
};
