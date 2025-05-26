<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// REMOVA a linha abaixo se existir: use Illuminate\Database\Eloquent\SoftDeletes;

class Responsavel extends Model
{
    use HasFactory;
    // REMOVA a linha abaixo se existir: use SoftDeletes;

    protected $table = 'tb_responsavel';
    protected $primaryKey = 'id';

    const CREATED_AT = 'dt_insert'; // Informa ao Eloquent para usar 'dt_insert' como campo de criação
    const UPDATED_AT = null;       // Informa ao Eloquent que não há campo de atualização para gerenciar

    protected $fillable = [
        'nome',
        'email',
        'celular',
        'status', // Mantenha 'status' aqui
    ];

    // Relacionamento com Alunos
    public function alunos()
    {
        return $this->belongsToMany(Aluno::class, 'tb_responsavel_has_tb_aluno', 'fk_responsavel', 'fk_aluno');
    }

    // Relacionamento com Cadastros (se houver necessidade)
    public function cadastros()
    {
        return $this->belongsToMany(Cadastro::class, 'tb_responsavel_has_tb_cadastro', 'fk_responsavel', 'fk_cadastro')
            ->where('tb_cadastro.status', 1); // Mantém o filtro para cadastros ativos
    }

    // Se você quiser um escopo global para apenas responsáveis ativos por padrão
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('active', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $builder->where('tb_responsavel.status', 1);
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
