<?php

namespace App\Http\Controllers;

use App\Models\Origem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Yajra\DataTables\Facades\DataTables;

class OrigemController extends Controller
{
    public function index()
    {
        return view('origens.index');
    }

    public function listar(Request $request)
    {
        $origens = Origem::select(['id', 'nome'])->get();
        
        return DataTables::of($origens)
            ->addColumn('acoes', function ($row) {
                return view('partials.btnOrigens', compact('row'))->render();
            })
            ->rawColumns(['acoes'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tb_origens,nome',
        ], [
            'name.required' => 'O campo nome é obrigatório.',
            'name.string' => 'O campo nome deve ser um texto.',
            'name.max' => 'O campo nome não pode ter mais que 255 caracteres.',
            'name.unique' => 'Esta origem já existe.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $origem = Origem::create(['nome' => $request->name]);

        return response()->json([
            'success' => 'Origem criada com sucesso!',
            'origem' => $origem
        ], 201);
    }
    
    public function edit($id)
    {
        $origem = Origem::findOrFail($id);

        return response()->json([
            'id' => $origem->id,
            'name' => $origem->name,
        ]);
    }

    public function show(Origem $origem)
    {
        return response()->json($origem);
    }

    public function update(Request $request, Origem $origem)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tb_origens', 'nome')->ignore($origem->id),
            ],
        ], [
            'name.required' => 'O campo nome é obrigatório.',
            'name.string' => 'O campo nome deve ser um texto.',
            'name.max' => 'O campo nome não pode ter mais que 255 caracteres.',
            'name.unique' => 'Esta origem já existe.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $origem->update(['nome' => $request->name]);

        return response()->json([
            'success' => 'Origem atualizada com sucesso!',
            'origem' => $origem
        ]);
    }

    public function destroy(Origem $origem)
    {
        try {
            $origem->delete();
            return response()->json(['success' => 'Origem excluída com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir a origem. Pode estar sendo utilizada.'], 500);
        }
    }
}