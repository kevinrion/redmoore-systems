<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcknowledgeAlertRequest;
use App\Http\Resources\AlertResource;
use App\Models\Alert;
use Illuminate\Http\JsonResponse;

class AlertController extends Controller
{
    public function __invoke(AcknowledgeAlertRequest $request, Alert $alert): JsonResponse
    {
        if ($alert->acknowledged_at === null) {
            $alert->update([
                'acknowledged_at' => now(),
            ]);
        }

        $alert->refresh();
        $alert->load(['device.site']);

        return response()->json(AlertResource::make($alert)->resolve());
    }
}
