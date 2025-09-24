import HomeClient from '@/components/HomeClient';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  const buildSha = process.env.VERCEL_GIT_COMMIT_SHA ?? '';

  return <HomeClient buildSha={buildSha} />;
}