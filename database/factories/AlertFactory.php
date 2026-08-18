<?php

namespace Database\Factories;

use App\Models\Alert;
use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Alert>
 */
class AlertFactory extends Factory
{
    public function definition(): array
    {
        return [
            'device_id' => Device::factory(),
            'message' => 'Reading outside the expected range.',
            'triggered_at' => fake()->dateTimeBetween('-3 days'),
            'acknowledged_at' => null,
        ];
    }

    public function acknowledged(): static
    {
        return $this->state(fn (): array => [
            'acknowledged_at' => now()->subHour(),
        ]);
    }
}
