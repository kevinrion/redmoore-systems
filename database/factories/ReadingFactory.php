<?php

namespace Database\Factories;

use App\Models\Device;
use App\Models\Reading;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reading>
 */
class ReadingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'device_id' => Device::factory(),
            'value' => fake()->randomFloat(2, -2, 12),
            'recorded_at' => fake()->dateTimeBetween('-7 days'),
        ];
    }
}
