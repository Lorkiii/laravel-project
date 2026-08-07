<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Product/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Product/Create');
    }
}
