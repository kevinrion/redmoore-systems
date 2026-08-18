<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResetAcknowledgementsRequest;
use App\Models\Alert;
use Illuminate\Http\Response;

class ResetAcknowledgementsController extends Controller
{
    public function __invoke(ResetAcknowledgementsRequest $request): Response
    {
        Alert::query()->update([
            'acknowledged_at' => null,
        ]);

        return response()->noContent();
    }
}
