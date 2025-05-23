<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Aluno;
use App\Models\Escola;

class DashboardController extends Controller
{
    public function index()
    {
        // Exemplo de dados para a dashboard
        $totalAlunos = Aluno::count();
        $totalEscolas = Escola::count();

        return view('dashboard.index', compact('totalAlunos', 'totalEscolas'));
    }
}
