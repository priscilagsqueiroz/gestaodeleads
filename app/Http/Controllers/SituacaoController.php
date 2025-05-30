<?php

namespace App\Http\Controllers;

use App\Models\Situacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Yajra\DataTables\Facades\DataTables;

class SituacaoController extends Controller
{
    public function index()
    {
        return view('situacoes.index');
    }

    public function listar(Request $request)
    {
        $situacoes = Situacao::select(['id', 'nome', 'legenda'])->get();

        return DataTables::of($situacoes)
            ->addColumn('acoes', function ($row) {
                return view('partials.btnSituacoes', compact('row'))->render();
            })
            ->rawColumns(['acoes'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tb_situacao,nome',
            'legenda' => 'required|string|max:255|unique:tb_situacao,legenda',
        ], [
            'name.required' => 'O campo nome é obrigatório.',
            'name.string' => 'O campo nome deve ser um texto.',
            'name.max' => 'O campo nome não pode ter mais que 255 caracteres.',
            'name.unique' => 'Este nome de situação já existe.',
            'legenda.required' => 'O campo legenda é obrigatório.',
            'legenda.string' => 'O campo legenda deve ser um texto.',
            'legenda.max' => 'O campo legenda não pode ter mais que 255 caracteres.',
            'legenda.unique' => 'Esta legenda já existe.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $situacao = Situacao::create([
            'nome' => $request->name,
            'legenda' => $request->legenda,
        ]);

        return response()->json([
            'success' => 'Situacao criada com sucesso!',
            'situacao' => $situacao
        ], 201);
    }

    public function edit($id)
    {
        $situacao = Situacao::findOrFail($id);

        return response()->json([
            'id' => $situacao->id,
            'name' => $situacao->nome,
            'legenda' => $situacao->legenda,
        ]);
    }

    public function show(Situacao $situacao)
    {
        return response()->json($situacao);
    }

        public function update(Request $request, Situacao $situacao)
    {
        // --- LOG INICIAL ---
        Log::info('--- Iniciando Situacao@update ---');
        Log::info('ID da Situacao (Model Injetado): ' . $situacao->id);
        Log::info('Nome da Situacao (Model Injetado antes do trim): "' . $situacao->nome . '"'); // Log antes do trim
        Log::info('Legenda da Situacao (Model Injetado antes do trim): "' . $situacao->legenda . '"'); // Log antes do trim
        Log::info('Dados do Request (todos): ', $request->all()); // Mostra todos os dados do request
        Log::info('Request - input("name"): "' . $request->input('name') . '"');
        Log::info('Request - input("legenda"): "' . $request->input('legenda') . '"');
        // --------------------

        $rules = [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'legenda' => ['sometimes', 'required', 'string', 'max:255'],
        ];

        if ($request->has('name')) {
            $rules['name'][] = Rule::unique('tb_situacao', 'nome')->ignore($situacao->id);
        }

        if ($request->has('legenda')) {
            $rules['legenda'][] = Rule::unique('tb_situacao', 'legenda')->ignore($situacao->id);
        }

        // --- LOG REGRAS ---
        // Para logar o objeto Rule, precisamos de uma forma de serializá-lo ou pegar seus componentes.
        // Vamos logar de forma mais simples por enquanto, ou você pode inspecionar no debug.
        $loggableRules = [];
        foreach ($rules as $field => $fieldRules) {
            $loggableRules[$field] = [];
            foreach ($fieldRules as $rule) {
                if (is_object($rule) && method_exists($rule, '__toString')) {
                    $loggableRules[$field][] = (string)$rule;
                } elseif (is_object($rule)) {
                    $loggableRules[$field][] = get_class($rule) . ' (object)';
                } else {
                    $loggableRules[$field][] = $rule;
                }
            }
        }
        Log::info('Regras de Validacao Aplicadas: ', $loggableRules);
        // -----------------

        // Certifique-se que suas mensagens de validação estão aqui
        $validationMessages = [
            'name.required'    => 'O campo nome é obrigatório quando fornecido.',
            'name.string'      => 'O campo nome deve ser um texto.',
            'name.max'         => 'O campo nome não pode ter mais que 255 caracteres.',
            'name.unique'      => 'Este nome de situação já está em uso por outra situação.',
            'legenda.required' => 'O campo legenda é obrigatório quando fornecido.',
            'legenda.string'   => 'O campo legenda deve ser um texto.',
            'legenda.max'      => 'O campo legenda não pode ter mais que 255 caracteres.',
            'legenda.unique'   => 'Esta legenda já está em uso por outra situação.',
        ];

        $validator = Validator::make($request->all(), $rules, $validationMessages);

        if ($validator->fails()) {
            // --- LOG ERRO VALIDACAO ---
            Log::error('Validacao Falhou.', $validator->errors()->toArray());
            Log::info('--- Finalizando Situacao@update com erro de validacao ---');
            // -------------------------
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $dataToUpdate = [];

        // Pega os valores atuais do banco, trimados, para comparação antes do update
        $currentNomeFromDB = trim($situacao->nome ?? '');
        $currentLegendaFromDB = trim($situacao->legenda ?? '');

        Log::info('DB - currentNomeFromDB (apos trim): "' . $currentNomeFromDB . '"');
        Log::info('DB - currentLegendaFromDB (apos trim): "' . $currentLegendaFromDB . '"');


        if (array_key_exists('name', $validatedData)) {
            $requestedNome = trim($validatedData['name']);
            Log::info('Validated - requestedNome (apos trim): "' . $requestedNome . '"');
            if ($requestedNome !== $currentNomeFromDB) {
                $dataToUpdate['nome'] = $requestedNome;
            }
        }

        if (array_key_exists('legenda', $validatedData)) {
            $requestedLegenda = trim($validatedData['legenda']);
            Log::info('Validated - requestedLegenda (apos trim): "' . $requestedLegenda . '"');
            if ($requestedLegenda !== $currentLegendaFromDB) {
                $dataToUpdate['legenda'] = $requestedLegenda;
            }
        }

        // --- LOG DADOS PARA UPDATE ---
        Log::info('Dados para Atualizar no Banco (dataToUpdate): ', $dataToUpdate);
        // --------------------------

        $updated = false;
        if (!empty($dataToUpdate)) {
            $situacao->update($dataToUpdate);
            $updated = true;
            // --- LOG UPDATE SUCESSO ---
            Log::info('Update realizado no banco.');
            // -------------------------
        } else {
            // --- LOG SEM UPDATE ---
            Log::info('Nenhum dado para atualizar no banco (dataToUpdate estava vazio).');
            // ---------------------
        }

        // Mantenha sua lógica de mensagem de sucesso aqui
        $successMessage = 'Situação processada com sucesso!';
        $dadosEnviadosParaNomeOuLegenda = $request->has('name') || $request->has('legenda');

        if ($updated) {
            $successMessage = 'Situação atualizada com sucesso!';
        } elseif ($dadosEnviadosParaNomeOuLegenda && empty($dataToUpdate)) {
            $successMessage = 'Nenhuma alteração necessária nos dados enviados.';
        } elseif (!$dadosEnviadosParaNomeOuLegenda) {
            $camposRelevantesNoRequest = $request->except(['_token', '_method', 'id']);
            if (empty($camposRelevantesNoRequest)) {
                $successMessage = 'Nenhuma alteração enviada.';
            } else {
                $successMessage = 'Situação processada, mas sem alterações em nome ou legenda.';
            }
        }

        // --- LOG FINAL ---
        Log::info('Mensagem de Sucesso Final: ' . $successMessage);
        Log::info('--- Finalizando Situacao@update ---');
        // ----------------

        return response()->json([
            'success'  => $successMessage,
            'situacao' => $situacao->fresh(),
        ]);
    }

    public function destroy(Situacao $situacao)
    {
        try {
            $situacao->delete();
            return response()->json(['success' => 'Situacao excluída com sucesso!']);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Erro ao excluir a situação. Verifique se ela não está sendo utilizada em outros registros.'
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao excluir a situação.'
            ], 500);
        }
    }
}
