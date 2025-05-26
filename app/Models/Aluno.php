<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// REMOVA a linha abaixo se existir: use Illuminate\Database\Eloquent\SoftDeletes;

class Aluno extends Model
{
    use HasFactory;
    // REMOVA a linha abaixo se existir: use SoftDeletes;

    protected $table = 'tb_aluno';
    protected $primaryKey = 'id';

    const CREATED_AT = 'dt_insert'; // Informa ao Eloquent para usar 'dt_insert' como campo de criação
    const UPDATED_AT = null;       // Informa ao Eloquent que não há campo de atualização para gerenciar

    protected $fillable = [
        'fk_escolas',
        'fk_series',
        'fk_aluno_categoria',
        'nome',
        'dt_nascimento',
        'colegio_atual',
        'inclusao',
        'status',
    ];

    // REMOVA a linha abaixo se existir: protected $dates = ['deleted_at'];

    // Relacionamento com Escola
    public function escola()
    {
        return $this->belongsTo(Escola::class, 'fk_escolas', 'id');
    }

    // Relacionamento com Serie
    public function serie()
    {
        return $this->belongsTo(Serie::class, 'fk_series', 'id');
    }

    // Se você quiser um escopo global para apenas alunos ativos por padrão
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('active', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $builder->where('tb_aluno.status', 1);
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