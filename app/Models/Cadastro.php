<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// REMOVA a linha abaixo se existir: use Illuminate\Database\Eloquent\SoftDeletes;

class Cadastro extends Model
{
    use HasFactory;
    // REMOVA a linha abaixo se existir: use SoftDeletes;

    protected $table = 'tb_cadastro';
    protected $primaryKey = 'id';

    protected $fillable = [
        'codigo',
        'data_cadastro',
        'fk_atendente',
        'fk_responsavel', // O responsável principal (FK para tb_responsavel.id)
        'fk_origens',
        'fk_situacao',
        'observacoes',
        'status', // Mantenha 'status' aqui
    ];

    // REMOVA a linha abaixo se existir: protected $dates = ['deleted_at'];

    // Relacionamentos
    public function atendente()
    {
        // ATUALIZADO: Relacionamento com o modelo User (tabela 'users')
        return $this->belongsTo(User::class, 'fk_atendente', 'id');
    }

    public function responsavel()
    {
        // Relacionamento com o Responsável principal (fk_responsavel)
        return $this->belongsTo(Responsavel::class, 'fk_responsavel', 'id')
            ->where('status', 1); // Garante que apenas responsável principal ativo seja carregado
    }

    public function responsaveis()
    {
        // Relacionamento com todos os responsáveis associados a este cadastro (tb_responsavel_has_tb_cadastro)
        return $this->belongsToMany(Responsavel::class, 'tb_responsavel_has_tb_cadastro', 'fk_cadastro', 'fk_responsavel')
            ->wherePivot('status', 1) // Garante que apenas relações ativas são carregadas
            ->where('tb_responsavel.status', 1); // Garante que apenas responsáveis ativos são carregados
    }

    public function alunos()
    {
        // Pega alunos através dos responsáveis associados a este cadastro
        // Isso pode ser complexo, pois um aluno é vinculado a um responsável, e o responsável ao cadastro.
        // Uma forma é pegar todos os responsáveis do cadastro, e depois os alunos desses responsáveis.
        return $this->hasManyThrough(
            Aluno::class,
            Responsavel::class,
            'id', // Chave no Responsavel (fk_responsavel da tabela tb_responsavel_has_tb_cadastro)
            'id', // Chave no Aluno (fk_aluno da tabela tb_responsavel_has_tb_aluno)
            'fk_responsavel', // Chave local no Cadastro (seu fk_responsavel)
            'id' // Chave no Responsavel (id do Responsavel)
        )->where('tb_aluno.status', 1); // Garante que apenas alunos ativos são carregados

        // Alternativamente, se a relação principal for Responsavel -> Aluno,
        // e você quer todos os alunos de TODOS os responsáveis ligados a este cadastro,
        // pode-se fazer algo como:
        // return Aluno::whereHas('responsaveis', function($query) {
        //     $query->whereHas('cadastros', function($q) {
        //         $q->where('tb_cadastro.id', $this->id)->where('tb_cadastro.status', 1);
        //     })->where('tb_responsavel.status', 1);
        // })->where('tb_aluno.status', 1);
        // Este é mais complexo, mas mais preciso se um aluno pode ter múltiplos responsáveis e alguns não ligados a este cadastro.
        // Por enquanto, o hasManyThrough para o RESPONSAVEL PRINCIPAL pode ser o suficiente para o 'details'.
        // Para a exibição dos detalhes do DataTables, você carregou os alunos através da relação do 'Cadastro' com 'Responsavel' e 'Responsavel.alunos'. Isso está ok.
    }


    public function origem()
    {
        return $this->belongsTo(Origem::class, 'fk_origens');
    }

    public function situacao()
    {
        return $this->belongsTo(Situacao::class, 'fk_situacao');
    }

    // Relação com todos os responsáveis associados (muitos para muitos)
    public function responsaveisPivot()
    {
        return $this->belongsToMany(Responsavel::class, 'tb_responsavel_has_tb_cadastro', 'fk_cadastro', 'fk_responsavel');
    }

    // Se você quiser um escopo global para apenas cadastros ativos por padrão
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('active', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $builder->where('tb_cadastro.status', 1);
        });
    }

    // Método para inativar (soft delete)
    public function inativar()
    {
        return $this->update(['status' => 0]);
    }

    // Método para ativar (restaurar)
    public function ativar()
    {
        return $this->update(['status' => 1]);
    }

    // Sobrescrever o método delete para usar o status
    public function delete()
    {
        return $this->inativar();
    }
}
