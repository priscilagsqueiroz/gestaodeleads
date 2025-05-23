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
        'status', // Adicione esta se ela for fillable e estiver presente
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
}