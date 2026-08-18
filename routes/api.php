<?php

use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\ResetAcknowledgementsController;
use App\Http\Controllers\Api\SiteController;
use Illuminate\Support\Facades\Route;

Route::get('/sites', [SiteController::class, 'index']);
Route::get('/sites/{site}', [SiteController::class, 'show']);
Route::get('/devices/{device}', [DeviceController::class, 'show']);
Route::get('/alerts', [AlertController::class, 'index']);
Route::post('/alerts/{alert}/acknowledge', [AlertController::class, 'acknowledge']);
Route::post('/demo/reset-acknowledgements', ResetAcknowledgementsController::class);
