<?php

namespace Database\Factories;

use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Site>
 */
class SiteFactory extends Factory
{
    public function definition(): array
    {
        $town = fake()->city();

        return [
            'name' => $town.' Cold Store',
            'slug' => Str::slug($town).'-'.fake()->unique()->numerify('###'),
            'town' => $town,
        ];
    }
}
