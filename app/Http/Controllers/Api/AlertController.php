<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcknowledgeAlertRequest;
use App\Http\Resources\AlertResource;
use App\Models\Alert;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $alerts = Alert::query()
            ->with(['device.site'])
            ->orderByDesc('triggered_at')
            ->orderByDesc('id');

        if ($request->filled('site')) {
            $site = Site::query()->where('slug', $request->string('site'))->firstOrFail();
            $alerts->whereIn('device_id', $site->devices()->pluck('id'));
        } elseif ($request->filled('device')) {
            $alerts->where('device_id', $request->integer('device'));
        } else {
            $alerts->limit(20);
        }

        return response()->json(AlertResource::collection($alerts->get())->resolve());
    }

    public function acknowledge(AcknowledgeAlertRequest $request, Alert $alert): JsonResponse
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
