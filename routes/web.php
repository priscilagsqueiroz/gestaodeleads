<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CadastroController;
use App\Http\Controllers\AtendentesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SerieController;
use App\Http\Controllers\ObservacaoController;
use App\Http\Controllers\Auth\LogoutController;

// Página inicial (dashboard principal do sistema)
Route::get('/', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard.index');

// Rotas protegidas por autenticação
Route::middleware(['auth'])->group(function () {
    // Grupo de rotas para 'cadastros'
    Route::prefix('cadastros')->name('cadastros.')->group(function () {
        // Rotas do recurso CRUD de cadastros (exceto 'show')
        Route::resource('/', CadastroController::class)->except(['show'])->parameters(['' => 'cadastro']);
        // O `parameters(['' => 'cadastro'])` é necessário porque o prefixo `cadastros/` faria com que o resource tentasse nomear as rotas como `cadastros./{cadastro}`. Ao invés disso, ele usa apenas o slug do parâmetro `{cadastro}`.

        // Rotas extras de cadastros com nomes explícitos
        Route::get('/listar', [CadastroController::class, 'listar'])->name('listar');
        Route::get('/opcoes', [CadastroController::class, 'opcoes'])->name('opcoes');
        Route::get('/{id}/details', [CadastroController::class, 'show'])->name('details');
        Route::get('/{cadastro}/observacoes', [CadastroController::class, 'getObservacoes'])->name('observacoes');
        Route::post('/{cadastro}/observacoes', [CadastroController::class, 'storeObservacao'])->name('observacoes.store');
    });
    
    Route::put('/observacoes/{observacao}/update', [ObservacaoController::class, 'update'])->name('observacoes.update');

    // Grupo de rotas para 'atendentes'
    Route::prefix('atendentes')->name('atendentes.')->group(function () {
        // Rotas do recurso CRUD de atendentes (exceto 'create', 'show')
        Route::resource('/', AtendentesController::class)->except(['create', 'show'])->parameters(['' => 'atendente']);

        // Rotas extras de atendentes com nomes explícitos
        Route::get('/listar', [AtendentesController::class, 'listar'])->name('listar');
    });

    // Rotas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update'); // Adicionado update
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy'); // Adicionado destroy

    // Rota de logout
    Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');
});


// Essa rota pode ficar pública, se não exigir auth
// Você pode considerar nomeá-la se for usá-la com o helper route()
Route::get('/series/escola/{escolaId}', [SerieController::class, 'getPorEscola'])->name('series.by.escola');


// Rotas de autenticação do Breeze (login, register, etc)
require __DIR__ . '/auth.php';
