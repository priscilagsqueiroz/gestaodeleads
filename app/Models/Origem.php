<?php

// app/Models/Origem.php (Assuming this model exists and is correct)
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Origem extends Model
{
    use HasFactory;
    protected $table = 'tb_origens';
    protected $fillable = ['nome'];
}
