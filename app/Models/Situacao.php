<?php
// app/Models/Situacao.php (Assuming this model exists and is correct)
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Situacao extends Model
{
    use HasFactory;
    protected $table = 'tb_situacao';
    protected $fillable = ['nome', 'legenda'];
    public $timestamps = false; // Adicione esta linha
}