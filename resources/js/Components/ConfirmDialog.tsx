import { useEffect } from 'react';

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    processing?: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancel',
    processing = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !processing) {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, processing, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 bg-ink/40"
                disabled={processing}
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                className="relative w-full max-w-md rounded-sm border-2 border-crimson bg-white p-5 shadow-lg"
            >
                <h2 id="confirm-dialog-title" className="text-lg font-bold text-ink">
                    {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{description}</p>
                <div className="mt-5 flex justify-end gap-3">
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onClose}
                        className="rounded-sm border border-ink/20 px-3 py-1.5 text-sm font-bold text-ink hover:border-ink/40 disabled:opacity-60"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onConfirm}
                        className="rounded-sm bg-crimson px-3 py-1.5 text-sm font-bold text-white hover:bg-crimson-dark disabled:opacity-60"
                    >
                        {processing ? 'Resetting…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
