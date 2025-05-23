<?php

// app/Models/Escola.php (Assuming this model exists and is correct)
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Escola extends Model
{
    use HasFactory;
    protected $table = 'tb_escolas';
    protected $fillable = ['nome'];

    public function series()
    {
        return $this->hasMany(Serie::class, 'fk_escolas');
    }
}
