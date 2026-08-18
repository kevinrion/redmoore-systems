import { useState } from 'react';
import { useResetAcknowledgements } from '../api/operations';
import ConfirmDialog from './ConfirmDialog';

export default function ResetAcknowledgementsButton() {
    const reset = useResetAcknowledgements();
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                disabled={reset.isPending}
                onClick={() => setConfirmOpen(true)}
                className="rounded-sm border border-crimson/20 bg-white px-2.5 py-0.5 text-sm font-bold text-crimson hover:bg-paper disabled:opacity-60"
            >
                reset alerts
            </button>

            <ConfirmDialog
                open={confirmOpen}
                title="Reset all alerts?"
                description="Every alert will show as open again so you can walk through them in an interview."
                confirmLabel="Reset alerts"
                processing={reset.isPending}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                    reset.mutate(undefined, {
                        onSettled: () => setConfirmOpen(false),
                    });
                }}
            />
        </>
    );
}
