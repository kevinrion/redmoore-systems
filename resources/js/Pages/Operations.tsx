import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function Operations() {
    return (
        <AppLayout>
            <Head title="Operations" />
            <div className="mx-auto max-w-6xl px-6 py-16">
                <h1 className="text-3xl font-bold text-ink">Operations</h1>
                <p className="mt-3 max-w-2xl text-ink/80">
                    Site list, devices, charts, and alerts land in the next checkpoint. This page is a placeholder so
                    navigation works while the database models are added.
                </p>
                <Link href="/" className="mt-8 inline-block text-sm font-bold text-crimson hover:underline">
                    Back to home
                </Link>
            </div>
        </AppLayout>
    );
}
