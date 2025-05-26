<?php

namespace App\Http\Controllers;

use App\Models\Observacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon; // Para trabalhar com datas

class ObservacaoController extends Controller
{
    // ... outros métodos ...

    public function update(Request $request, Observacao $observacao)
    {
        // Política de Autorização: Verificar se o usuário logado pode editar esta observação
        // Exemplo: só o próprio usuário que criou, ou um admin.
        // if (Auth::id() !== $observacao->fk_usuarios && !Auth::user()->isAdmin()) {
        //     return response()->json(['success' => false, 'message' => 'Você não tem permissão para editar esta observação.'], 403);
        // }

        // Verificação dos 10 minutos (CRUCIAL NO BACKEND)
        $agora = Carbon::now();
        $dataCriacaoObservacao = Carbon::parse($observacao->dt_insert); // dt_insert é o CREATED_AT

        if ($dataCriacaoObservacao->diffInMinutes($agora) > 10) {
            return response()->json(['success' => false, 'message' => 'Esta observação não pode mais ser editada (limite de 10 minutos excedido).'], 403); // Forbidden
        }

        $validatedData = $request->validate([
            'texto' => 'required|string|max:65535',
        ]);

        try {
            $observacao->texto = $validatedData['texto'];
            // O Eloquent não vai atualizar 'dt_insert' aqui porque definimos UPDATED_AT = null no modelo Observacao.
            // Se você quisesse um campo de 'dt_ultima_modificacao', teria que adicioná-lo e gerenciá-lo.
            $observacao->save();

            // Retornar a observação formatada para atualizar dinamicamente à lista no modal
            $formattedObservacao = [
                'obs_id' => $observacao->id,
                'texto_original' => e($observacao->texto), // Enviar texto original
                'texto' => nl2br(e($observacao->texto)),
                'data_insercao' => $observacao->dt_insert ? $observacao->dt_insert->format('d/m/Y H:i:s') : 'Data não disponível',
                'data_insercao_raw' => $observacao->dt_insert ? $observacao->dt_insert->toIso8601String() : null,
                'usuario_nome' => $observacao->usuario ? e($observacao->usuario->name) : 'Usuário desconhecido'
            ];

            return response()->json(['success' => true, 'message' => 'Observação atualizada com sucesso!', 'data' => $formattedObservacao]);

        } catch (\Exception $e) {
            Log::error("Erro ao atualizar observação ID {$observacao->id}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao atualizar observação.'], 500);
        }
    }
}