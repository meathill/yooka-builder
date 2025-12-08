import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yooka Builder - Build Your Personal Matrix Page",
  description: "Create a unique, grid-based personal profile page in minutes. Drag, drop, and customize your digital identity.",
  openGraph: {
    title: "Yooka Builder - Build Your Personal Matrix Page",
    description: "Create a unique, grid-based personal profile page in minutes. Drag, drop, and customize your digital identity.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yooka Builder",
    description: "Create a unique, grid-based personal profile page in minutes.",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold">Yooka Builder</h1>
        <div className="flex gap-4">
          <Link href="/sign-in" className="text-sm font-medium hover:underline">
            Sign In
          </Link>
          <Link
            href="/app"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Your Digital Identity, <br />
            <span className="text-indigo-600">Reimagined.</span>
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Stop using boring lists. Build a dynamic, grid-based personal page that truly reflects who you are.
            Drag, drop, resize, and publish.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/app"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Building for Free
            </Link>
            <Link
              href="https://github.com/meathill/yooka-builder"
              target="_blank"
              className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              View on GitHub
            </Link>
          </div>
        </div>

        {/* Feature Preview Placeholder */}
        <div className="mt-20 w-full max-w-5xl mx-auto relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
           <div className="bg-gray-100 dark:bg-gray-800 aspect-[16/9] flex items-center justify-center">
               <div className="grid grid-cols-4 grid-rows-3 gap-4 p-8 w-full h-full opacity-50 pointer-events-none">
                   <div className="col-span-2 row-span-2 bg-indigo-500/20 rounded-lg border-2 border-indigo-500 border-dashed"></div>
                   <div className="col-span-1 row-span-1 bg-pink-500/20 rounded-lg border-2 border-pink-500 border-dashed"></div>
                   <div className="col-span-1 row-span-1 bg-purple-500/20 rounded-lg border-2 border-purple-500 border-dashed"></div>
                   <div className="col-span-2 row-span-1 bg-yellow-500/20 rounded-lg border-2 border-yellow-500 border-dashed"></div>
               </div>
               <p className="absolute font-bold text-2xl text-gray-400">Interactive Grid Editor Preview</p>
           </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800 mt-20">
        <p>© {new Date().getFullYear()} Yooka Builder. Open Source.</p>
      </footer>
    </div>
  );
}