<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Servicio;

class ServicioSeeder extends Seeder
{
    public function run()
    {
        $servicios = [
            ['nombre' => 'Corte de cabello', 'precio' => 10.00],
            ['nombre' => 'Tinte', 'precio' => 20.00],
            ['nombre' => 'Peinado', 'precio' => 15.00],
            ['nombre' => 'Manicure', 'precio' => 12.50],
            ['nombre' => 'Depilación', 'precio' => 8.00],
        ];

        foreach ($servicios as $servicio) {
            Servicio::create($servicio);
        }
    }
}
