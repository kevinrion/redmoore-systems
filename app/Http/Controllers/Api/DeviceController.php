<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeviceResource;
use App\Models\Device;
use Illuminate\Http\JsonResponse;

class DeviceController extends Controller
{
    public function show(Device $device): JsonResponse
    {
        $device->load(['site', 'latestReading']);
        $device->setRelation(
            'readings',
            $device->readings()
                ->where('recorded_at', '>=', now()->subDays(7))
                ->orderBy('recorded_at')
                ->get(),
        );

        return response()->json(DeviceResource::make($device)->resolve());
    }
}
