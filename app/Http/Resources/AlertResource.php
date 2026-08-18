<?php

namespace App\Http\Resources;

use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Alert
 */
class AlertResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'triggered_at' => $this->triggered_at->toIso8601String(),
            'acknowledged_at' => $this->acknowledged_at?->toIso8601String(),
            'is_open' => $this->isOpen(),
            'device' => $this->whenLoaded('device', fn (): array => [
                'id' => $this->device->id,
                'name' => $this->device->name,
                'metric_label' => $this->device->metric->label(),
                'site_town' => $this->device->relationLoaded('site')
                    ? $this->device->site->town
                    : null,
                'site_slug' => $this->device->relationLoaded('site')
                    ? $this->device->site->slug
                    : null,
            ]),
        ];
    }
}
