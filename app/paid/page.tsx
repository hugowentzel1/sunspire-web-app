import PaidClient from '@/components/PaidClient';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Paid() {
  const buildSha = process.env.VERCEL_GIT_COMMIT_SHA ?? '';

  return <PaidClient buildSha={buildSha} />;
}
