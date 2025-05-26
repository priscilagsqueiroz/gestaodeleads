<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observacao extends Model
{
    use HasFactory;

    protected $table = 'tb_observacao'; // Nome da sua tabela de observações

    const CREATED_AT = 'dt_insert'; // Informa ao Eloquent para usar 'dt_insert' como campo de criação
    const UPDATED_AT = null;       // Informa ao Eloquent que não há campo de atualização para gerenciar

    protected $fillable = [
        'fk_cadastro',
        'fk_usuarios', // ID do usuário que fez a observação
        'texto',
        // 'dt_insert' será tratado automaticamente pelo Eloquent se CREATED_AT estiver definido
    ];

    /**
     * Relacionamento: Observacao pertence a um Cadastro.
     */
    public function cadastro()
    {
        return $this->belongsTo(Cadastro::class, 'fk_cadastro', 'id');
    }

    /**
     * Relacionamento: Observacao pertence a um Usuario (quem fez a observação).
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'fk_usuarios', 'id');
    }
}