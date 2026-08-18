<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteResource;
use App\Models\Site;
use Illuminate\Http\JsonResponse;

class SiteController extends Controller
{
    public function index(): JsonResponse
    {
        $sites = Site::query()
            ->with(['devices.latestReading'])
            ->withCount(['alerts as open_alert_count' => fn ($query) => $query->whereNull('acknowledged_at')])
            ->orderBy('town')
            ->get();

        return response()->json(SiteResource::collection($sites)->resolve());
    }

    public function show(Site $site): JsonResponse
    {
        $site->load(['devices.latestReading']);
        $site->loadCount(['alerts as open_alert_count' => fn ($query) => $query->whereNull('acknowledged_at')]);

        return response()->json(SiteResource::make($site)->resolve());
    }
}
