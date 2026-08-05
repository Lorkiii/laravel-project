<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard/Dashboard', [
            'stats' => [
                'products' => 0,
                'categories' => 0,
                'low_stock' => 0,
                'movements_today' => 0,
            ],
        ]);
    }
}
