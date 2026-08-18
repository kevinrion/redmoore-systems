<?php

namespace Database\Seeders;

use App\Enums\Metric;
use App\Models\Alert;
use App\Models\Device;
use App\Models\Reading;
use App\Models\Site;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class WarehouseSeeder extends Seeder
{
    /**
     * @var list<array{town: string, name: string, slug: string}>
     */
    private array $sites = [
        ['town' => 'Milton Keynes', 'name' => 'MK1 Cold Store', 'slug' => 'milton-keynes'],
        ['town' => 'Doncaster', 'name' => 'iPort Chill', 'slug' => 'doncaster'],
        ['town' => 'Daventry', 'name' => 'DIRFT North', 'slug' => 'daventry'],
        ['town' => 'Warrington', 'name' => 'Omega West', 'slug' => 'warrington'],
        ['town' => 'Tilbury', 'name' => 'Riverside Cold', 'slug' => 'tilbury'],
    ];

    public function run(): void
    {
        Alert::query()->delete();
        Reading::query()->delete();
        Device::query()->delete();
        Site::query()->delete();

        foreach ($this->sites as $index => $siteData) {
            $site = Site::query()->create($siteData);

            foreach (Metric::cases() as $metric) {
                $device = Device::query()->create([
                    'site_id' => $site->id,
                    'name' => $site->town.' '.$metric->label(),
                    'metric' => $metric,
                ]);

                $this->seedReadings($device, $index, $site->town);
            }
        }
    }

    private function seedReadings(Device $device, int $siteIndex, string $town): void
    {
        $now = Carbon::now()->startOfHour();
        $rows = [];
        $openAlertCreated = false;

        for ($step = 7 * 24 * 2; $step >= 0; $step--) {
            $recordedAt = $now->copy()->subMinutes($step * 30);
            $value = $this->valueFor($device->metric, $siteIndex, $step);

            $rows[] = [
                'device_id' => $device->id,
                'value' => $value,
                'recorded_at' => $recordedAt->toDateTimeString(),
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ];

            if (count($rows) === 500) {
                Reading::query()->insert($rows);
                $rows = [];
            }

            if (! $openAlertCreated && $this->isOutOfRange($device->metric, $value) && $step < 24) {
                Alert::query()->create([
                    'device_id' => $device->id,
                    'message' => $this->alertMessage($device, $town, $value),
                    'triggered_at' => $recordedAt,
                    'acknowledged_at' => null,
                ]);
                $openAlertCreated = true;
            }
        }

        if ($rows !== []) {
            Reading::query()->insert($rows);
        }

        if ($siteIndex % 2 === 0) {
            Alert::query()->create([
                'device_id' => $device->id,
                'message' => $this->alertMessage($device, $town, $this->valueFor($device->metric, $siteIndex, 80)).' (resolved)',
                'triggered_at' => $now->copy()->subDays(2),
                'acknowledged_at' => $now->copy()->subDay(),
            ]);
        }
    }

    private function valueFor(Metric $metric, int $siteIndex, int $step): float
    {
        $wave = sin(($step + ($siteIndex * 8)) / 12);

        return round(match ($metric) {
            Metric::Temperature => 3.2 + ($wave * 1.1) + ($step === 6 ? 5.5 : 0),
            Metric::Humidity => 86 + ($wave * 4) + ($step === 10 ? 8 : 0),
            Metric::Fill => 72 + ($wave * 10) + ($siteIndex * 3),
        }, 2);
    }

    private function isOutOfRange(Metric $metric, float $value): bool
    {
        return match ($metric) {
            Metric::Temperature => $value > 6,
            Metric::Humidity => $value > 92,
            Metric::Fill => $value > 92,
        };
    }

    private function alertMessage(Device $device, string $town, float $value): string
    {
        return sprintf(
            '%s at %s is %s%s',
            $device->metric->label(),
            $town,
            number_format($value, 1),
            $device->metric->unit(),
        );
    }
}
