import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getAuth } from '@/lib/auth';
import { NextRequest } from 'next/server';

const handler = async (request: NextRequest) => {
  const { env } = await getCloudflareContext();
  const auth = getAuth(env as Cloudflare.Env);
  return auth.handler(request);
};

export { handler as GET, handler as POST };
