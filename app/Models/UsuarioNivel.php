<?php
// app/Models/UsuarioNivel.php (Assuming this model exists and is correct)
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioNivel extends Model
{
    use HasFactory;
    protected $table = 'tb_usuario_nivel';
    protected $fillable = ['nome'];
}

