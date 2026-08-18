export default function PageSkeleton() {
    return (
        <div className="mx-auto min-h-[70vh] max-w-6xl animate-pulse px-6 py-10">
            <div className="h-4 w-40 rounded-sm bg-ink/10" />
            <div className="mt-4 h-9 w-72 max-w-full rounded-sm bg-ink/10" />
            <div className="mt-3 h-4 w-full max-w-xl rounded-sm bg-ink/10" />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="h-40 rounded-sm bg-ink/10" />
                <div className="h-40 rounded-sm bg-ink/10" />
            </div>
        </div>
    );
}
