<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResetAcknowledgementsRequest;
use App\Models\Alert;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ResetAcknowledgementsController extends Controller
{
    public function __invoke(ResetAcknowledgementsRequest $request): Response
    {
        Alert::query()->update([
            'acknowledged_at' => null,
        ]);

        // Full document visit: acknowledge updates React state without
        // changing Inertia's page props, so return back() can look like a
        // no-op and leave rows showing "cleared".
        return Inertia::location(url()->previous(route('operations.index')));
    }
}
