<?php

namespace Tests\Feature;

use App\Enums\Metric;
use App\Models\Alert;
use App\Models\Device;
use App\Models\Reading;
use App\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OperationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_spa_shell_renders(): void
    {
        $this->get('/')->assertOk()->assertSee('id="app"', false);
        $this->get('/operations')->assertOk()->assertSee('id="app"', false);
    }

    public function test_sites_index_lists_sites(): void
    {
        $this->seedSite();

        $this->getJson('/api/sites')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.name', 'MK1 Cold Store')
            ->assertJsonPath('0.open_alert_count', 1);
    }

    public function test_recent_alerts_are_open(): void
    {
        $this->seedSite();

        $this->getJson('/api/alerts')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.is_open', true);
    }

    public function test_acknowledging_an_alert_persists(): void
    {
        $site = $this->seedSite();
        $alert = Alert::query()->whereNull('acknowledged_at')->firstOrFail();

        $this->postJson("/api/alerts/{$alert->id}/acknowledge")
            ->assertOk()
            ->assertJsonPath('id', $alert->id)
            ->assertJsonPath('is_open', false);

        $this->assertNotNull($alert->fresh()?->acknowledged_at);

        $this->getJson("/api/alerts?site={$site->slug}")
            ->assertOk()
            ->assertJsonPath('0.is_open', false);

        $this->getJson("/api/sites/{$site->slug}")
            ->assertOk()
            ->assertJsonPath('open_alert_count', 0);
    }

    public function test_demo_reset_reopens_all_alerts(): void
    {
        $this->seedSite();
        $alert = Alert::query()->firstOrFail();
        $alert->update(['acknowledged_at' => now()]);

        $this->postJson('/api/demo/reset-acknowledgements')->assertNoContent();

        $this->assertNull($alert->fresh()?->acknowledged_at);

        $this->getJson('/api/alerts')->assertJsonPath('0.is_open', true);
    }

    public function test_recent_alerts_use_stable_order_when_triggered_at_ties(): void
    {
        $site = $this->seedSite();
        $device = Device::query()->where('site_id', $site->id)->firstOrFail();
        $triggeredAt = now()->subHours(2);

        $older = Alert::factory()->create([
            'device_id' => $device->id,
            'message' => 'Older tied alert',
            'triggered_at' => $triggeredAt,
            'acknowledged_at' => null,
        ]);
        $newer = Alert::factory()->create([
            'device_id' => $device->id,
            'message' => 'Newer tied alert',
            'triggered_at' => $triggeredAt,
            'acknowledged_at' => null,
        ]);

        $first = $this->getJson('/api/alerts')->assertOk()->json();
        $second = $this->getJson('/api/alerts')->assertOk()->json();

        $this->assertSame(array_column($first, 'id'), array_column($second, 'id'));
        $this->assertLessThan(
            array_search($older->id, array_column($first, 'id'), true),
            array_search($newer->id, array_column($first, 'id'), true),
        );
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
