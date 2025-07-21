<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Puedes agregar tus eventos aquí
    ];

    public function boot(): void
    {
        //
    }
}
