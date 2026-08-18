<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlertResource;
use App\Http\Resources\SiteResource;
use App\Models\Alert;
use App\Models\Site;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    public function index(): Response
    {
        $sites = Site::query()
            ->with(['devices.latestReading'])
            ->withCount(['alerts as open_alert_count' => fn ($query) => $query->whereNull('acknowledged_at')])
            ->orderBy('town')
            ->get();

        $alerts = Alert::query()
            ->with(['device.site'])
            ->latest('triggered_at')
            ->limit(20)
            ->get();

        return Inertia::render('Operations/Index', [
            'sites' => SiteResource::collection($sites)->resolve(),
            'alerts' => AlertResource::collection($alerts)->resolve(),
        ]);
    }

    public function show(Site $site): Response
    {
        $site->load(['devices.latestReading']);
        $site->loadCount(['alerts as open_alert_count' => fn ($query) => $query->whereNull('acknowledged_at')]);

        $alerts = Alert::query()
            ->whereIn('device_id', $site->devices->pluck('id'))
            ->with(['device.site'])
            ->latest('triggered_at')
            ->get();

        return Inertia::render('Operations/Site', [
            'site' => SiteResource::make($site)->resolve(),
            'alerts' => AlertResource::collection($alerts)->resolve(),
        ]);
    }
}
