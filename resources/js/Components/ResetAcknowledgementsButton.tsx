import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ConfirmDialog from './ConfirmDialog';

export default function ResetAcknowledgementsButton() {
    const form = useForm({});
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                disabled={form.processing}
                onClick={() => setConfirmOpen(true)}
                className="rounded-sm border border-crimson/20 bg-white/70 px-2.5 py-0.5 text-sm font-bold text-crimson hover:bg-white disabled:opacity-60"
            >
                reset alerts
            </button>

            <ConfirmDialog
                open={confirmOpen}
                title="Reset all alerts?"
                description="Every alert will show as open again so you can walk through them in an interview."
                confirmLabel="Reset alerts"
                processing={form.processing}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                    form.post('/operations/demo/reset-acknowledgements', {
                        onFinish: () => setConfirmOpen(false),
                    });
                }}
            />
        </>
    );
}
