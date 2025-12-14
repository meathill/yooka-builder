import { getPublicGrid } from '@/app/actions';
import { GridItem, GridLayoutData } from '@/types/grid';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ username: string }>;
}

// Helper to embed video
const VideoEmbed = ({ url }: { url: string }) => {
  // Simple regex for YT/Vimeo (naive)
  let embedUrl = url;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  return (
    <iframe
      src={embedUrl}
      className="w-full h-full absolute inset-0"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

const ReadOnlyGridItem = ({ item }: { item: GridItem }) => {
  const style: React.CSSProperties = {
    gridColumnStart: item.x,
    gridColumnEnd: item.x + item.w,
    gridRowStart: item.y,
    gridRowEnd: item.y + item.h,
  };

  return (
    <div
      style={style}
      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm overflow-hidden relative h-full w-full hover:shadow-md transition-shadow">
      {item.type === 'text' && (
        <div className="p-4 h-full overflow-y-auto">
          <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{item.content}</p>
        </div>
      )}
      {item.type === 'image' && (
        <img
          src={item.content}
          alt="Grid Item"
          className="w-full h-full object-cover"
        />
      )}
      {item.type === 'app' && (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl mb-2 flex items-center justify-center text-white">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
          </div>
          <span className="text-xs font-bold text-center line-clamp-2">{item.content}</span>
        </div>
      )}
      {item.type === 'video' && <VideoEmbed url={item.content} />}
      {item.type === 'social' && (
        <a
          href={item.content.startsWith('http') ? item.content : `https://twitter.com/${item.content.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <div className="text-center p-2">
            <svg
              width="32"
              height="32"
              className="mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.942-2.178-1.524-3.591-1.524-2.719 0-4.92 2.201-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.85 3.213 2.144 4.083-.79-.026-1.535-.242-2.188-.603v.062c0 2.385 1.704 4.374 3.946 4.828-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
            </svg>
            <span className="text-sm font-medium truncate block max-w-full">{item.content}</span>
          </div>
        </a>
      )}
    </div>
  );
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const gridData = await getPublicGrid(username);

  if (!gridData) {
    notFound();
  }

  // Calculate CSS Grid layout
  const { rows, cols, items } = gridData;

  // We need a way to determine row height. On the editor it was dynamic.
  // For public page, we can stick to square cells based on screen width using CSS Aspect Ratio or similar technique.
  // Or simple minmax.
  // Let's use a responsive grid approach.

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col">
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 p-4 text-center sticky top-0 z-50 shadow-sm">
        <h1 className="text-xl font-bold">@{username}</h1>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto p-4">
        {/* Use CSS variables to control grid layout responsively */}
        <div
          className="grid gap-4 auto-rows-[minmax(50px,1fr)]"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            // We can try to approximate aspect ratio 1/1 for rows if we set height dynamically or use aspect-ratio on children?
            // But rows span multiple cells.
            // Let's just set a reasonable base row height for now, e.g. 50px per unit.
            gridTemplateRows: `repeat(${rows}, 50px)`,
          }}>
          {items.map((item) => (
            <ReadOnlyGridItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </div>

      <div className="p-4 text-center text-sm text-zinc-500">
        Powered by{' '}
        <a
          href="/"
          className="underline hover:text-zinc-800 dark:hover:text-zinc-300">
          Yooka Builder
        </a>
      </div>
    </div>
  );
}
