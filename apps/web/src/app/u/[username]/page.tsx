import { getPublicGrid } from '@/app/actions';
import { notFound } from 'next/navigation';
import { GridCanvas } from '@/components/GridCanvas';
import { UserProfile, GridLayoutData } from '@/types/grid';
import { GRID_CONFIG } from '@/lib/grid-config';

interface PageProps {
  params: Promise<{ username: string }>;
}

// 默认空数据
const DEFAULT_GRID: GridLayoutData = {
  rows: GRID_CONFIG.DEFAULT_ROWS,
  cols: GRID_CONFIG.DEFAULT_COLS,
  items: [],
};

const DEFAULT_PROFILE = (username: string): UserProfile => ({
  name: username,
  username: username,
});

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const pageData = await getPublicGrid(username);

  if (!pageData) {
    notFound();
  }

  const profile = pageData.profile || DEFAULT_PROFILE(username);
  const gridData = pageData.grid || DEFAULT_GRID;

  return (
    <>
      <GridCanvas
        data={gridData}
        profile={profile}
        readOnly={true}
      />
      <footer className="bg-[#e3e8f0] py-6 text-center text-sm text-zinc-500">
        Powered by{' '}
        <a
          href="/"
          className="underline hover:text-zinc-700 transition-colors">
          Yooka Builder
        </a>
      </footer>
    </>
  );
}
