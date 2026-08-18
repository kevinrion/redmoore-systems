<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlertResource;
use App\Http\Resources\DeviceResource;
use App\Models\Alert;
use App\Models\Device;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    public function show(Device $device): Response
    {
        $device->load(['site', 'latestReading']);
        $device->setRelation(
            'readings',
            $device->readings()
                ->where('recorded_at', '>=', now()->subDays(7))
                ->orderBy('recorded_at')
                ->get(),
        );

        $alerts = Alert::query()
            ->where('device_id', $device->id)
            ->latest('triggered_at')
            ->get();

        return Inertia::render('Operations/Device', [
            'device' => DeviceResource::make($device)->resolve(),
            'alerts' => AlertResource::collection($alerts)->resolve(),
        ]);
    }
}
