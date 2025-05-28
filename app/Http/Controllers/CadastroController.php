<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth; // Embora não usado diretamente nos métodos mostrados, é bom manter
use Illuminate\Validation\ValidationException;
use Yajra\DataTables\Facades\DataTables;
use App\Models\Cadastro;
use App\Models\Escola;
use App\Models\Serie;
use App\Models\Origem;
use App\Models\Situacao;
use App\Models\User;
use App\Models\Responsavel;
use App\Models\Aluno;
use App\Models\Observacao;

class CadastroController extends Controller
{
    public function index()
    {
        $unidades = Escola::where('status', 1)->orderBy('nome')->get(); // Adicionado filtro de status e ordenação
        $situacoes = Situacao::where('status', 1)->orderBy('nome')->get(); // Adicionado filtro de status e ordenação
        $origens = Origem::where('status', 1)->orderBy('nome')->get(); // Adicionado filtro de status e ordenação
        $atendentes = User::whereHas('nivel', function ($query) {
            $query->where('nome', 'Atendente');
        })->orderBy('name')->get();

        return view('cadastros.index', compact('unidades', 'situacoes', 'origens', 'atendentes'));
    }

    public function listar(Request $request)
    {
        $query = DB::table('tb_cadastro')
            ->join('tb_situacao', 'tb_cadastro.fk_situacao', '=', 'tb_situacao.id')
            ->join('tb_origens', 'tb_cadastro.fk_origens', '=', 'tb_origens.id')
            // CORRIGIDO: Usar LEFT JOIN e a coluna 'atendente' da tb_cadastro
            ->leftJoin('users', 'tb_cadastro.atendente', '=', 'users.id')
            ->leftJoin('tb_responsavel', 'tb_cadastro.fk_responsavel', '=', 'tb_responsavel.id')
            ->select(
                'tb_cadastro.id',
                'tb_cadastro.dt_insert as data_cadastro',
                'tb_situacao.nome as situacao_nome',
                'tb_origens.nome as origem_nome',
                'users.name as atendente_nome',
                'tb_responsavel.nome as responsavel_nome',
                'tb_responsavel.email as responsavel_email',
                'tb_responsavel.celular as responsavel_celular'
            )
            ->where('tb_cadastro.status', 1); // Filtrar apenas cadastros ativos

        // Filtro por Unidade (Escola)
        if ($request->filled('unidade')) {
            $query->whereExists(function ($q) use ($request) {
                $q->select(DB::raw(1))
                    ->from('tb_responsavel_has_tb_cadastro')
                    ->join('tb_responsavel_has_tb_aluno', 'tb_responsavel_has_tb_cadastro.fk_responsavel', '=', 'tb_responsavel_has_tb_aluno.fk_responsavel')
                    ->join('tb_aluno', 'tb_responsavel_has_tb_aluno.fk_aluno', '=', 'tb_aluno.id')
                    ->whereColumn('tb_responsavel_has_tb_cadastro.fk_cadastro', 'tb_cadastro.id')
                    // CORRIGIDO: Nome da coluna para 'fk_escolas'
                    ->where('tb_aluno.fk_escolas', $request->unidade)
                    ->where('tb_aluno.status', 1); // Considerar apenas alunos ativos
            });
        }

        // Filtro por Série
        if ($request->filled('serie')) {
            $query->whereExists(function ($q) use ($request) {
                $q->select(DB::raw(1))
                    ->from('tb_responsavel_has_tb_cadastro')
                    ->join('tb_responsavel_has_tb_aluno', 'tb_responsavel_has_tb_cadastro.fk_responsavel', '=', 'tb_responsavel_has_tb_aluno.fk_responsavel')
                    ->join('tb_aluno', 'tb_responsavel_has_tb_aluno.fk_aluno', '=', 'tb_aluno.id')
                    ->whereColumn('tb_responsavel_has_tb_cadastro.fk_cadastro', 'tb_cadastro.id')
                    // CORRIGIDO: Nome da coluna para 'fk_series'
                    ->where('tb_aluno.fk_series', $request->serie)
                    ->where('tb_aluno.status', 1); // Considerar apenas alunos ativos
            });
        }

        // Filtro por Situação
        if ($request->filled('situacao')) {
            $query->where('tb_cadastro.fk_situacao', $request->situacao);
        }

        // Filtro por Origem
        if ($request->filled('origem')) {
            $query->where('tb_cadastro.fk_origens', $request->origem);
        }

        // Filtro por Data de Início
        if ($request->filled('data_inicio')) {
            // CORRIGIDO: Usar dt_insert para o filtro de data
            $query->whereDate('tb_cadastro.dt_insert', '>=', $request->data_inicio);
        }

        // Filtro por Data de Fim
        if ($request->filled('data_fim')) {
            // CORRIGIDO: Usar dt_insert para o filtro de data
            $query->whereDate('tb_cadastro.dt_insert', '<=', $request->data_fim);
        }

        return DataTables::of($query)
            ->addColumn('acoes', function ($cadastro) {
                $editUrl = route('cadastros.edit', $cadastro->id);
                // $deleteUrl = route('cadastros.destroy', $cadastro->id); // Definido mas não usado no return original

                return '
                    <a href="' . $editUrl . '" class="btn btn-sm btn-warning" title="Editar"><i class="fas fa-edit"></i></a>
                    <button class="btn btn-sm btn-info btn-view-observacoes" data-id="' . $cadastro->id . '" data-bs-toggle="modal" data-bs-target="#observacoesModal" title="Ver Observações"><i class="fas fa-comments"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete" data-id="' . $cadastro->id . '" title="Excluir"><i class="fas fa-trash"></i></button>
                ';
            })
            ->rawColumns(['acoes'])
            ->make(true);
    }

    // Em app/Http/Controllers/CadastroController.php
    public function getObservacoes(Cadastro $cadastro)
    {
        $observacoes = $cadastro->observacoes()->with('usuario')->get();

        if ($observacoes->isEmpty()) {
            return response()->json(['success' => true, 'message' => 'Nenhuma observação encontrada para este cadastro.', 'data' => []]);
        }

        $formattedObservacoes = $observacoes->map(function ($obs) {
            return [
                'obs_id' => $obs->id, // <<< ADICIONADO ID DA OBSERVAÇÃO
                'texto_original' => e($obs->texto), // Texto original não processado por nl2br
                'texto' => nl2br(e($obs->texto)),
                'data_insercao' => $obs->dt_insert ? $obs->dt_insert->format('d/m/Y H:i:s') : 'Data não disponível',
                'data_insercao_raw' => $obs->dt_insert ? $obs->dt_insert->toIso8601String() : null, // <<< ADICIONADO DATA RAW
                'usuario_nome' => $obs->usuario ? e($obs->usuario->name) : 'Usuário desconhecido'
            ];
        });

        return response()->json(['success' => true, 'data' => $formattedObservacoes]);
    }

    public function storeObservacao(Request $request, Cadastro $cadastro)
    {
        $validatedData = $request->validate([
            'texto' => 'required|string|max:65535', // 65535 é o limite para TEXT no MySQL
        ]);

        try {
            $observacao = Observacao::create([
                'fk_cadastro' => $cadastro->id,
                'fk_usuarios' => Auth::id(), // ID do usuário logado
                'texto' => $validatedData['texto'],
            ]);

            // Retornar a observação formatada para adicionar dinamicamente à lista no modal
            $formattedObservacao = [
                'texto' => nl2br(e($observacao->texto)),
                'data_insercao' => $observacao->dt_insert ? $observacao->dt_insert->format('d/m/Y H:i:s') : 'Data não disponível',
                'usuario_nome' => $observacao->usuario ? e($observacao->usuario->name) : 'Usuário desconhecido'
            ];

            return response()->json(['success' => true, 'message' => 'Observação salva com sucesso!', 'data' => $formattedObservacao]);
        } catch (\Exception $e) {
            Log::error("Erro ao salvar observação para cadastro ID {$cadastro->id}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao salvar observação.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Validação dos dados (o campo 'observacoes' é para o texto da observação)
            $validatedData = $request->validate([
                'fk_atendente' => 'required|exists:users,id',
                'fk_origens' => 'required|exists:tb_origens,id',
                'fk_situacao' => 'required|exists:tb_situacao,id',
                'responsibles' => 'required|array|min:1',
                'responsibles.*.nome' => 'required|string|max:255',
                'responsibles.*.email' => 'nullable|email|max:255',
                'responsibles.*.celular' => 'nullable|string|max:20',
                'responsibles.*.alunos' => 'sometimes|array',
                'responsibles.*.alunos.*.nome' => 'required_with:responsibles.*.alunos|string|max:255',
                'responsibles.*.alunos.*.data_nascimento' => 'required_with:responsibles.*.alunos|date',
                'responsibles.*.alunos.*.fk_escola' => 'required_with:responsibles.*.alunos|exists:tb_escolas,id',
                'responsibles.*.alunos.*.fk_serie' => 'required_with:responsibles.*.alunos|exists:tb_series,id',
                'responsibles.*.alunos.*.colegio_atual' => 'nullable|string|max:255',
                'observacoes' => 'nullable|string|max:65535', // Validar o texto da observação
                // Adicione aqui validações para outros campos da tb_cadastro se necessário
                // Ex: 'forma_contato' => 'nullable|string|max:50',
            ]);

            DB::beginTransaction();

            $mainResponsibleId = null;

            // Cria o cadastro principal (sem o campo 'observacoes' direto)
            $cadastro = Cadastro::create([
                'atendente' => $validatedData['fk_atendente'], // Coluna 'atendente' na tb_cadastro
                'fk_origens' => $validatedData['fk_origens'],
                'fk_situacao' => $validatedData['fk_situacao'],
                'fk_responsavel' => null, // Será atualizado depois
                'status' => 1,
                // 'fk_indique' => $validatedData['fk_indique'] ?? 1, // Se você tiver esse campo no form
                // 'forma_contato' => $validatedData['forma_contato'] ?? null, // Se tiver
                // dt_insert e dt_update são gerenciados pelo Eloquent (constantes no modelo)
            ]);

            // Salva a observação na tabela tb_observacao, se houver
            if (!empty($validatedData['observacoes'])) {
                Observacao::create([
                    'fk_cadastro' => $cadastro->id,
                    'fk_usuarios' => Auth::id(), // ID do usuário logado (atendente)
                    'texto' => $validatedData['observacoes'],
                    // dt_insert será preenchido automaticamente pelo Eloquent/BD
                ]);
            }

            // Loop para responsáveis e alunos (como estava antes, mas verifique 'inclusao' e 'fk_aluno_categoria')
            foreach ($validatedData['responsibles'] as $responsibleData) {
                $responsible = Responsavel::create([
                    'nome' => $responsibleData['nome'],
                    'email' => $responsibleData['email'] ?? null,
                    'celular' => $responsibleData['celular'] ?? null,
                    'status' => 1,
                ]);

                DB::table('tb_responsavel_has_tb_cadastro')->insert([
                    'fk_cadastro' => $cadastro->id,
                    'fk_responsavel' => $responsible->id,
                ]);

                if (is_null($mainResponsibleId)) {
                    $mainResponsibleId = $responsible->id;
                }

                if (!empty($responsibleData['alunos'])) {
                    foreach ($responsibleData['alunos'] as $alunoData) {
                        $aluno = Aluno::create([
                            'nome' => $alunoData['nome'],
                            'dt_nascimento' => $alunoData['data_nascimento'],
                            'fk_escolas' => $alunoData['fk_escola'],
                            'fk_series' => $alunoData['fk_serie'],
                            'colegio_atual' => $alunoData['colegio_atual'] ?? null,
                            'fk_aluno_categoria' => 1, // Assegure que ID 1 existe em tb_aluno_categoria
                            'inclusao' => $alunoData['inclusao'] ?? 0, // O seu SQL mostra DEFAULT '0' para inclusao
                            'status' => 1,
                        ]);

                        DB::table('tb_responsavel_has_tb_aluno')->insert([
                            'fk_responsavel' => $responsible->id,
                            'fk_aluno' => $aluno->id,
                        ]);
                    }
                }
            }

            if ($mainResponsibleId) {
                $cadastro->update(['fk_responsavel' => $mainResponsibleId]);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Cadastro criado com sucesso!', 'cadastro_id' => $cadastro->id]);
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::warning('Erro de validação ao salvar cadastro: ' . $e->getMessage(), ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação. Verifique os dados enviados.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro crítico ao salvar cadastro: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'error' => 'Ocorreu um erro interno ao salvar o cadastro.',
                // 'error_debug_message' => $e->getMessage() // Para desenvolvimento
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $cadastro = Cadastro::findOrFail($id);

        $request->validate([
            'fk_atendente' => 'required|exists:users,id',
            'fk_origens' => 'required|exists:tb_origens,id',
            'fk_situacao' => 'required|exists:tb_situacao,id',
            'responsibles' => 'required|array|min:1',
            'responsibles.*.id' => 'nullable|string', // Pode ser ID existente ou 'new_X'
            'responsibles.*.nome' => 'required|string|max:255',
            'responsibles.*.email' => 'nullable|email|max:255',
            'responsibles.*.celular' => 'nullable|string|max:20',
            'responsibles.*.alunos' => 'array',
            'responsibles.*.alunos.*.id' => 'nullable|string', // Pode ser ID existente ou 'new_X'
            'responsibles.*.alunos.*.nome' => 'required|string|max:255',
            'responsibles.*.alunos.*.data_nascimento' => 'required|date',
            'responsibles.*.alunos.*.fk_escola' => 'required|exists:tb_escolas,id',
            'responsibles.*.alunos.*.fk_serie' => 'required|exists:tb_series,id',
            'responsibles.*.alunos.*.colegio_atual' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $cadastro->update([
                // CORRIGIDO: Atualizar coluna 'atendente'
                'atendente' => $request->fk_atendente,
                'fk_origens' => $request->fk_origens,
                'fk_situacao' => $request->fk_situacao,
                'observacoes' => $request->observacoes,
                // 'dt_update' => now(), // Se a tabela cadastro tiver dt_update
            ]);

            $existingResponsiblePivots = DB::table('tb_responsavel_has_tb_cadastro')
                ->where('fk_cadastro', $cadastro->id)
                ->get();
            $existingResponsibleIds = $existingResponsiblePivots->pluck('fk_responsavel')->toArray();

            $receivedResponsibleIds = [];
            $mainResponsibleIdForUpdate = $cadastro->fk_responsavel; // Manter o atual, a menos que seja removido ou alterado

            // Processar responsáveis recebidos
            foreach ($request->input('responsibles', []) as $responsibleData) {
                $responsible = null;
                $currentResponsibleId = null;

                if (!str_starts_with($responsibleData['id'], 'new_')) { // Responsável existente
                    $currentResponsibleId = $responsibleData['id'];
                    $responsible = Responsavel::find($currentResponsibleId);
                    if ($responsible) {
                        $responsible->update([
                            'nome' => $responsibleData['nome'],
                            'email' => $responsibleData['email'],
                            'celular' => $responsibleData['celular'],
                        ]);
                    }
                } else { // Novo responsável
                    $responsible = Responsavel::create([
                        'nome' => $responsibleData['nome'],
                        'email' => $responsibleData['email'],
                        'celular' => $responsibleData['celular'],
                        'status' => 1,
                    ]);
                    $currentResponsibleId = $responsible->id;
                    // Adicionar à tabela pivot se não existir
                    if (!DB::table('tb_responsavel_has_tb_cadastro')->where('fk_cadastro', $cadastro->id)->where('fk_responsavel', $currentResponsibleId)->exists()) {
                        DB::table('tb_responsavel_has_tb_cadastro')->insert([
                            'fk_cadastro' => $cadastro->id,
                            'fk_responsavel' => $currentResponsibleId,
                        ]);
                    }
                }

                if ($responsible) {
                    $receivedResponsibleIds[] = $currentResponsibleId;
                    if (is_null($mainResponsibleIdForUpdate) || ($responsibleData['id'] === $request->input('responsibles')[0]['id'])) { // Define o primeiro da lista como principal se não houver um ou for o primeiro
                        $mainResponsibleIdForUpdate = $currentResponsibleId;
                    }

                    // Processar alunos deste responsável
                    $existingStudentPivots = DB::table('tb_responsavel_has_tb_aluno')
                        ->where('fk_responsavel', $currentResponsibleId)
                        ->get();
                    $existingStudentIdsForThisResponsible = $existingStudentPivots->pluck('fk_aluno')->toArray();
                    $receivedStudentIdsForThisResponsible = [];

                    foreach ($responsibleData['alunos'] as $alunoData) {
                        $aluno = null;
                        $currentAlunoId = null;

                        if (!str_starts_with($alunoData['id'], 'new_')) { // Aluno existente
                            $currentAlunoId = $alunoData['id'];
                            $aluno = Aluno::find($currentAlunoId);
                            if ($aluno) {
                                $aluno->update([
                                    'nome' => $alunoData['nome'],
                                    'dt_nascimento' => $alunoData['data_nascimento'],
                                    'fk_escolas' => $alunoData['fk_escola'],
                                    'fk_series' => $alunoData['fk_serie'],
                                    'colegio_atual' => $alunoData['colegio_atual'],
                                ]);
                            }
                        } else { // Novo aluno
                            $aluno = Aluno::create([
                                'nome' => $alunoData['nome'],
                                'dt_nascimento' => $alunoData['data_nascimento'],
                                'fk_escolas' => $alunoData['fk_escola'],
                                'fk_series' => $alunoData['fk_serie'],
                                'colegio_atual' => $alunoData['colegio_atual'],
                                'fk_aluno_categoria' => 1,
                                'status' => 1,
                            ]);
                            $currentAlunoId = $aluno->id;
                            // Adicionar à tabela pivot se não existir
                            if (!DB::table('tb_responsavel_has_tb_aluno')->where('fk_responsavel', $currentResponsibleId)->where('fk_aluno', $currentAlunoId)->exists()) {
                                DB::table('tb_responsavel_has_tb_aluno')->insert([
                                    'fk_responsavel' => $currentResponsibleId,
                                    'fk_aluno' => $currentAlunoId,
                                ]);
                            }
                        }
                        if ($aluno) {
                            $receivedStudentIdsForThisResponsible[] = $currentAlunoId;
                        }
                    }
                    // Soft delete alunos removidos deste responsável
                    $studentsToDelete = array_diff($existingStudentIdsForThisResponsible, $receivedStudentIdsForThisResponsible);
                    if (!empty($studentsToDelete)) {
                        Aluno::whereIn('id', $studentsToDelete)->update(['status' => 0]);
                        DB::table('tb_responsavel_has_tb_aluno')
                            ->where('fk_responsavel', $currentResponsibleId)
                            ->whereIn('fk_aluno', $studentsToDelete)
                            ->delete(); // ou update(['status' => 0]) se a pivot tiver status
                    }
                }
            }

            // Atualizar o fk_responsavel principal no cadastro
            // Se o responsável principal anterior foi removido, pega o primeiro da lista de recebidos como novo principal
            if (!in_array($cadastro->fk_responsavel, $receivedResponsibleIds) && !empty($receivedResponsibleIds)) {
                $cadastro->update(['fk_responsavel' => $receivedResponsibleIds[0]]);
            } else if (empty($receivedResponsibleIds)) { // Nenhum responsável sobrou
                $cadastro->update(['fk_responsavel' => null]);
            } else { // Garante que o principal esteja entre os recebidos ou mantenha o primeiro da lista
                $cadastro->update(['fk_responsavel' => $mainResponsibleIdForUpdate]);
            }


            // Soft delete responsáveis removidos do cadastro
            $responsiblesToDelete = array_diff($existingResponsibleIds, $receivedResponsibleIds);
            if (!empty($responsiblesToDelete)) {
                Responsavel::whereIn('id', $responsiblesToDelete)->update(['status' => 0]);
                DB::table('tb_responsavel_has_tb_cadastro')
                    ->where('fk_cadastro', $cadastro->id)
                    ->whereIn('fk_responsavel', $responsiblesToDelete)
                    ->delete(); // ou update(['status' => 0])

                // Também desativar alunos desses responsáveis, se não estiverem ligados a outros responsáveis ativos deste cadastro
                foreach ($responsiblesToDelete as $respId) {
                    $alunosDoResponsavelRemovido = DB::table('tb_responsavel_has_tb_aluno')
                        ->where('fk_responsavel', $respId)
                        ->pluck('fk_aluno');

                    foreach ($alunosDoResponsavelRemovido as $alunoIdParaVerificar) {
                        // Verificar se este aluno ainda está ligado a algum responsável ATIVO deste cadastro
                        $aindaLigado = DB::table('tb_responsavel_has_tb_aluno as rha')
                            ->join('tb_responsavel_has_tb_cadastro as rhc', 'rha.fk_responsavel', '=', 'rhc.fk_responsavel')
                            ->where('rhc.fk_cadastro', $cadastro->id)
                            ->where('rha.fk_aluno', $alunoIdParaVerificar)
                            ->whereIn('rha.fk_responsavel', $receivedResponsibleIds) // Só considera os responsáveis que ficaram
                            ->exists();
                        if (!$aindaLigado) {
                            Aluno::where('id', $alunoIdParaVerificar)->update(['status' => 0]);
                        }
                    }
                    DB::table('tb_responsavel_has_tb_aluno')->where('fk_responsavel', $respId)->delete(); // Limpar pivot dos responsáveis removidos
                }
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Cadastro atualizado com sucesso!']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao atualizar cadastro: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString()); //vs code aponta erro nessa linha: Undefined type 'Log'.intelephense(P1009)
            return response()->json(['success' => false, 'error' => 'Ocorreu um erro ao atualizar o cadastro: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $cadastro = Cadastro::findOrFail($id);
            $cadastro->update(['status' => 0]); // Soft delete do cadastro principal

            // Soft delete dos responsáveis associados e seus alunos (se não estiverem em outros cadastros ativos)
            // Esta lógica pode ser complexa dependendo das regras de negócio para "órfãos"
            // Por simplicidade, vamos desativar os responsáveis diretamente ligados a este cadastro via pivot
            // e os alunos ligados a esses responsáveis, SE esses alunos não estiverem ligados a outros responsáveis ativos de OUTROS cadastros.

            $responsaveisIds = DB::table('tb_responsavel_has_tb_cadastro')
                ->where('fk_cadastro', $id)
                ->pluck('fk_responsavel');

            // Marcar os responsáveis como inativos (status 0)
            if ($responsaveisIds->isNotEmpty()) {
                Responsavel::whereIn('id', $responsaveisIds)->update(['status' => 0]);
            }

            // Marcar os alunos ligados a esses responsáveis como inativos (status 0)
            // Cuidado: um aluno pode estar ligado a múltiplos responsáveis em múltiplos cadastros.
            // Esta lógica simples desativa o aluno se o responsável dele (neste cadastro) for desativado.
            $alunosIds = DB::table('tb_responsavel_has_tb_aluno')
                ->whereIn('fk_responsavel', $responsaveisIds)
                ->pluck('fk_aluno');

            if ($alunosIds->isNotEmpty()) {
                Aluno::whereIn('id', $alunosIds)->update(['status' => 0]);
            }

            // Opcional: Remover ou marcar como inativas as entradas nas tabelas pivot
            // DB::table('tb_responsavel_has_tb_cadastro')->where('fk_cadastro', $id)->update(['status' => 0]); // Se tiver status
            // DB::table('tb_responsavel_has_tb_aluno')->whereIn('fk_responsavel', $responsaveisIds)->update(['status' => 0]); // Se tiver status

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Cadastro excluído (desativado) com sucesso!']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao excluir cadastro: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString()); //vs code aponta erro nessa linha: Undefined type 'Log'.intelephense(P1009)
            return response()->json(['success' => false, 'error' => 'Ocorreu um erro ao excluir o cadastro.'], 500);
        }
    }

    public function show($id) // Para a visualização de detalhes da linha expandida, se necessário
    {
        $cadastro = Cadastro::findOrFail($id);
        $mainResponsavel = $cadastro->responsavel()->where('tb_responsavel.status', 1)->first(); // Responsável principal

        $alunos = [];
        $outrosResponsaveis = collect(); // Coleção vazia por padrão

        if ($mainResponsavel) {
            // Alunos do responsável principal
            $alunos = $mainResponsavel->alunos()->where('tb_aluno.status', 1)
                ->with(['serie', 'escola']) // Carregar nomes das séries e escolas
                ->get()
                ->map(function ($aluno) {
                    return [
                        'nome' => $aluno->nome,
                        'data_nascimento' => $aluno->dt_nascimento,
                        'serie_nome' => $aluno->serie ? $aluno->serie->nome : 'N/D',
                        'escola_nome' => $aluno->escola ? $aluno->escola->nome : 'N/D',
                        'colegio_atual' => $aluno->colegio_atual,
                    ];
                })->toArray();
        }

        // Buscar todos os responsáveis associados a este cadastro (exceto o principal)
        $todosResponsaveisDoCadastro = $cadastro->responsaveisPivot()->where('tb_responsavel.status', 1)->get();
        if ($mainResponsavel) {
            $outrosResponsaveis = $todosResponsaveisDoCadastro->filter(function ($resp) use ($mainResponsavel) {
                return $resp->id !== $mainResponsavel->id;
            })->map(function ($resp) {
                return [
                    'id' => $resp->id,
                    'nome' => $resp->nome,
                    'email' => $resp->email,
                    'celular' => $resp->celular,
                ];
            });
        } else { // Caso não haja responsável principal definido, lista todos como "outros"
            $outrosResponsaveis = $todosResponsaveisDoCadastro->map(function ($resp) {
                return [
                    'id' => $resp->id,
                    'nome' => $resp->nome,
                    'email' => $resp->email,
                    'celular' => $resp->celular,
                ];
            });
        }


        return response()->json([
            'alunos' => $alunos,
            'responsaveis' => $outrosResponsaveis, // Lista de outros responsáveis
            'main_responsavel_id' => $mainResponsavel ? $mainResponsavel->id : null,
        ]);
    }

    public function edit($id)
    {
        $cadastro = Cadastro::with([
            // Carregar a COLEÇÃO de responsáveis ativos
            'responsaveis' => function ($queryResponsaveis) {
                // O método 'responsaveis()' no Model Cadastro já tem ->where('tb_responsavel.status', 1).
                // O Global Scope no Model Responsavel também já filtra por status=1.
                // Então, a condição de status para os Responsavel aqui é redundante, mas não prejudica.
                // $queryResponsaveis->where('status', 1); // Pode até remover se o global scope e a definição da relação já cuidam disso.

                $queryResponsaveis->with(['alunos' => function ($queryAlunos) {
                    $queryAlunos->where('status', 1)
                        ->select(
                            'tb_aluno.id',
                            'tb_aluno.nome',
                            'tb_aluno.dt_nascimento',
                            'tb_aluno.fk_series',
                            'tb_aluno.fk_escolas',
                            'tb_aluno.colegio_atual'
                        )
                        ->with(['serie', 'escola']);
                }]);
            },
            'situacao',
            'origem',
            'atendente' // Este é o User que fez o cadastro, ok
        ])->findOrFail($id);

        $unidades = Escola::where('status', 1)->orderBy('nome')->get();
        $situacoes = Situacao::where('status', 1)->orderBy('nome')->get();
        $origens = Origem::where('status', 1)->orderBy('nome')->get();
        $atendentes = User::whereHas('nivel', function ($query) {
            $query->where('nome', 'Atendente');
        })->whereNull('users.deleted_at')->orderBy('name')->get();

        // Antes de retornar a view, para ter certeza absoluta, você pode inspecionar:
        // dd($cadastro->responsaveis);

        return view('cadastros.edit', compact('cadastro', 'unidades', 'situacoes', 'origens', 'atendentes'));
    }

    public function opcoes()
    {
        // Adicionado status = 1 e ordenação para consistência
        return response()->json([
            'unidades' => Escola::where('status', 1)->orderBy('id')->get(),
            'series' => Serie::where('status', 1)->orderBy('id')->get(), // Assumindo que quer séries ativas, ordenadas
            'origens' => Origem::where('status', 1)->orderBy('id')->get(),
            'situacoes' => Situacao::where('status', 1)->orderBy('id')->get(),
            'atendentes' => User::whereHas('nivel', function ($query) {
                $query->where('nome', 'Atendente');
            })->orderBy('name')->get(),
        ]);
    }
}
