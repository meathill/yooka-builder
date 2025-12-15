import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    const auth = getAuth(env as Cloudflare.Env);
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = `${crypto.randomUUID()}-${file.name}`;
    const key = `uploads/${session.user.id}/${filename}`;

    await env.YOOKA_BUCKET.put(key, file);

    const publicUrl = `${env.NEXT_PUBLIC_R2_BUCKET_URL}/${key}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
