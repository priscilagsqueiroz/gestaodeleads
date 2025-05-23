<?php
// app/Models/Serie.php (Assuming this model exists and is correct)
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Serie extends Model
{
    use HasFactory;
    protected $table = 'tb_series';
    protected $fillable = ['nome', 'fk_escolas'];

    public function escola()
    {
        return $this->belongsTo(Escola::class, 'fk_escolas');
    }
}