<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Serie;  // IMPORTANTE: importar a Model aqui, fora da classe

class SerieController extends Controller
{
    public function getPorEscola($escolaId)
    {
        $series = Serie::where('fk_escolas', $escolaId)
            ->where('status', '1')
            ->orderBy('ordem')
            ->get();

        return response()->json($series);
    }
}
