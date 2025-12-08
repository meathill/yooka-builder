import { getPublicGrid } from "@/app/actions";
import { GridCanvas } from "@/components/GridCanvas";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const gridData = await getPublicGrid(username);

    if (!gridData) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 text-center">
                <h1 className="text-xl font-bold">@{username}</h1>
            </div>
            <div className="flex-1 relative">
                <GridCanvas data={gridData} readOnly={true} />
            </div>
            <div className="p-4 text-center text-sm text-gray-500">
                Powered by <a href="/" className="underline">Yooka Builder</a>
            </div>
        </div>
    );
}
