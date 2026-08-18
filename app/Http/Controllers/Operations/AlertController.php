<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcknowledgeAlertRequest;
use App\Models\Alert;
use Illuminate\Http\RedirectResponse;

class AlertController extends Controller
{
    public function __invoke(AcknowledgeAlertRequest $request, Alert $alert): RedirectResponse
    {
        if ($alert->acknowledged_at === null) {
            $alert->update([
                'acknowledged_at' => now(),
            ]);
        }

        return back();
    }
}
