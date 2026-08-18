<?php

namespace App\Http\Resources;

use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Site
 */
class SiteResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'town' => $this->town,
            'open_alert_count' => (int) ($this->open_alert_count ?? 0),
            'devices' => DeviceResource::collection($this->whenLoaded('devices')),
        ];
    }
}
