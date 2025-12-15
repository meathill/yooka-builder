import React from 'react';
import { GridItem } from '@/types/grid';

interface GridItemContentProps {
  item: GridItem;
}

const VideoEmbed = ({ url }: { url: string }) => {
  // Check if it's a direct file link
  if (url.match(/\.(mp4|webm|mov)$/i) || url.includes('r2.cloudflarestorage.com') || url.includes('i.yooka.me')) {
    return (
      <video
        src={url}
        className="w-full h-full absolute inset-0 object-cover"
        controls
        playsInline
      />
    );
  }

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

export const GridItemContent: React.FC<GridItemContentProps> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm p-4 overflow-hidden relative h-full w-full select-none flex flex-col">
      {item.type === 'text' && <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{item.content}</p>}
      {item.type === 'image' && (
        <img
          src={item.content}
          alt="Grid Item"
          className="w-full h-full object-cover absolute inset-0 pointer-events-none"
        />
      )}
      {item.type === 'app' && (
        <div className="flex flex-col items-center justify-center h-full w-full">
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
      {item.type === 'video' && (
        <div className="w-full h-full bg-black flex items-center justify-center absolute inset-0">
          <div className="text-white flex flex-col items-center gap-2">
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs opacity-70 truncate max-w-[90%] px-2">{item.content}</span>
          </div>
        </div>
      )}
      {item.type === 'social' && (
        <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
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
        </div>
      )}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Controls placeholder */}
      </div>
    </div>
  );
};
