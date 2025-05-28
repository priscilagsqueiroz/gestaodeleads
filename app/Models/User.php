<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes; // remova HasApiTokens se você não for usar Sanctum

    // Adicione esta linha se sua tabela de usuários não se chamar 'users'
    // protected $table = 'users'; // Se sua tabela se chama 'users', você não precisa disso

    protected $fillable = [
        'name',
        'email',
        'password',
        'fk_tipo_usuario', // Adicione esta se ela for fillable
        'fk_escolas', // Adicione esta se ela for fillable e estiver presente
        // Adicione outras colunas que podem ser atribuídas em massa
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // ESSENCIAL: Garante que a senha é hashed automaticamente
    ];

    // Se você tiver uma relação com a tabela de níveis de usuário
    public function nivel()
    {
        return $this->belongsTo(UsuarioNivel::class, 'fk_tipo_usuario');
    }

    /**
     * Define o relacionamento do Usuário com a Unidade (Escola).
     * Um usuário pertence a uma unidade.
     */
    public function unidade()
    {
        // O segundo argumento 'fk_escolas' é a chave estrangeira na tabela 'users'
        // O terceiro argumento 'id' (omitido aqui pois é o padrão) é a chave primária na tabela 'tb_escolas'
        return $this->belongsTo(Escola::class, 'fk_escolas');
    }
}
