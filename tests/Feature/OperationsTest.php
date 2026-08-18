<?php

namespace Tests\Feature;

use App\Enums\Metric;
use App\Models\Alert;
use App\Models\Device;
use App\Models\Reading;
use App\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OperationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders(): void
    {
        $this->get('/')->assertOk();
    }

    public function test_operations_index_lists_sites(): void
    {
        $this->seedSite();

        $this->get('/operations')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Operations/Index')
                ->has('sites', 1)
                ->where('sites.0.name', 'MK1 Cold Store')
                ->has('alerts', 1)
                ->where('alerts.0.is_open', true));
    }

    public function test_acknowledging_an_alert_persists(): void
    {
        $site = $this->seedSite();
        $alert = Alert::query()->whereNull('acknowledged_at')->firstOrFail();

        $this->from('/operations')
            ->post("/operations/alerts/{$alert->id}/acknowledge")
            ->assertRedirect('/operations');

        $this->assertNotNull($alert->fresh()?->acknowledged_at);

        $this->get("/operations/sites/{$site->slug}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Operations/Site')
                ->where('alerts.0.is_open', false));
    }

    private function seedSite(): Site
    {
        $site = Site::factory()->create([
            'name' => 'MK1 Cold Store',
            'slug' => 'milton-keynes',
            'town' => 'Milton Keynes',
        ]);

        $device = Device::factory()->create([
            'site_id' => $site->id,
            'name' => 'Milton Keynes Temperature',
            'metric' => Metric::Temperature,
        ]);

        Reading::factory()->create([
            'device_id' => $device->id,
            'value' => 8.4,
            'recorded_at' => now()->subHour(),
        ]);

        Alert::factory()->create([
            'device_id' => $device->id,
            'message' => 'Temperature at Milton Keynes is 8.4°C',
            'triggered_at' => now()->subHour(),
            'acknowledged_at' => null,
        ]);

        return $site;
    }
}
