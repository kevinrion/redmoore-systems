import type { ReactNode } from 'react';
import ResetAcknowledgementsButton from './ResetAcknowledgementsButton';

export default function DemoControls() {
    const pageControls: ReactNode = null;

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm bg-crimson-mist px-2.5 py-1 text-sm text-crimson">
            <span className="font-bold">demo</span>
            <ResetAcknowledgementsButton />
            {pageControls}
        </div>
    );
}
