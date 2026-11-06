import { publicImage } from '@/lib/public-image';

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  return publicImage((await params).key);
}
