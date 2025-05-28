<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Yajra\DataTables\Facades\DataTables;
use App\Models\User;
use App\Models\Escola;
use App\Models\UsuarioNivel;

class AtendentesController extends Controller
{
    public function index()
    {
        // Busca apenas os usuários que são atendentes (fk_tipo_usuario = 2)
        $atendentes = User::with(['unidade', 'nivel'])
            ->where('fk_tipo_usuario', 2)
            ->get();

        $unidades = Escola::all();
        return view('atendentes.index', compact('atendentes', 'unidades'));
    }

    public function listar(Request $request)
    {
        // Seleciona explicitamente as colunas da tabela 'users'
        // A relação 'unidade' será carregada para os dados e usada para joins na busca/ordenação pelo yajra/datatables
        $query = User::with(['unidade', 'nivel']) // 'unidade' é o nome da relação no seu Model User
            ->select('users.*') // Boa prática para evitar conflitos de nome de coluna
            ->where('users.fk_tipo_usuario', 2); // Qualificar a coluna fk_tipo_usuario com o nome da tabela

        return DataTables::of($query)
            ->addColumn('acoes', function ($row) {
                return view('partials.btnAtendentes', compact('row'))->render();
            })
            // Com name: 'unidade.nome' no JS, yajra/laravel-datatables
            // automaticamente tentará fazer o join com a tabela da relação 'unidade'
            // e buscar na coluna 'nome' dessa tabela relacionada.
            ->rawColumns(['acoes'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'fk_escolas' => 'required|exists:tb_escolas,id',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = new User();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->fk_escolas = $validated['fk_escolas'];
        $user->fk_tipo_usuario = 2; // Atendente
        $user->password = Hash::make($validated['password']);
        $user->save();

        return redirect()->route('atendentes.index')->with('success', 'Atendente cadastrado com sucesso!');
    }
    public function edit($id)
    {
        $atendente = User::findOrFail($id);

        // Retornar JSON com os dados para popular o modal
        return response()->json([
            'id' => $atendente->id,
            'name' => $atendente->name,
            'email' => $atendente->email,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ];

        // Senha só se for preenchida
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:6|confirmed';
        }

        $validated = $request->validate($rules);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // Responder JSON para AJAX
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json(['success' => true, 'mensagem' => 'Atendente excluído com sucesso.']);
    }
}
