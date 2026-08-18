<?php

namespace Database\Factories;

use App\Enums\Metric;
use App\Models\Device;
use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Device>
 */
class DeviceFactory extends Factory
{
    public function definition(): array
    {
        $metric = fake()->randomElement(Metric::cases());

        return [
            'site_id' => Site::factory(),
            'name' => $metric->label().' sensor',
            'metric' => $metric,
        ];
    }
}
