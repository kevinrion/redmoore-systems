<?php

namespace App\Enums;

enum Metric: string
{
    case Temperature = 'temperature';
    case Humidity = 'humidity';
    case Fill = 'fill';

    public function label(): string
    {
        return match ($this) {
            self::Temperature => 'Temperature',
            self::Humidity => 'Humidity',
            self::Fill => 'Fill level',
        };
    }

    public function unit(): string
    {
        return match ($this) {
            self::Temperature => '°C',
            self::Humidity => '%',
            self::Fill => '%',
        };
    }
}
