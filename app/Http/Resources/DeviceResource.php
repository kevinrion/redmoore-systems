<?php

namespace App\Http\Resources;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Device
 */
class DeviceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'metric' => $this->metric->value,
            'metric_label' => $this->metric->label(),
            'unit' => $this->metric->unit(),
            'site' => $this->whenLoaded('site', fn (): array => [
                'name' => $this->site->name,
                'slug' => $this->site->slug,
                'town' => $this->site->town,
            ]),
            'latest_reading' => $this->whenLoaded('latestReading', function (): ?array {
                if ($this->latestReading === null) {
                    return null;
                }

                return [
                    'value' => $this->latestReading->value,
                    'recorded_at' => $this->latestReading->recorded_at->toIso8601String(),
                ];
            }),
            'readings' => $this->when(
                $this->relationLoaded('readings'),
                fn () => $this->readings->map(fn ($reading): array => [
                    'value' => $reading->value,
                    'recorded_at' => $reading->recorded_at->toIso8601String(),
                ])->values(),
            ),
        ];
    }
}
