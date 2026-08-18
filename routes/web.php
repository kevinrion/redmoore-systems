<?php

use App\Http\Controllers\Operations\AlertController;
use App\Http\Controllers\Operations\DeviceController;
use App\Http\Controllers\Operations\SiteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/operations', [SiteController::class, 'index'])->name('operations.index');
Route::get('/operations/sites/{site}', [SiteController::class, 'show'])->name('operations.sites.show');
Route::get('/operations/devices/{device}', [DeviceController::class, 'show'])->name('operations.devices.show');
Route::post('/operations/alerts/{alert}/acknowledge', AlertController::class)->name('operations.alerts.acknowledge');
