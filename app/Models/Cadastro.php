<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cadastro extends Model
{
    use HasFactory;

    protected $table = 'tb_cadastro';
    protected $primaryKey = 'id'; // Já deve estar assim por padrão

    // Define as colunas de timestamp personalizadas
    const CREATED_AT = 'dt_insert';
    const UPDATED_AT = 'dt_update';

    protected $fillable = [
        'fk_indique',       // Certifique-se que todos estes campos são realmente 'fillable'
        'fk_responsavel',
        'atendente',        // Esta é a sua chave estrangeira para users (o atendente que cadastrou)
        'fk_situacao',
        'fk_origens',
        'forma_contato',
        'codigo',
        'dt_agenda',
        'dt_retorno',
        'horario_agenda',
        'campanha_atual',
        'sms_cobranca',
        'sms_lembrete',
        'sms_pesquisa',
        'status',
        // 'observacoes' foi removido daqui
        // 'dt_insert' e 'dt_update' serão gerenciados pelo Eloquent
    ];

    public function responsavel()
    {
        // Relacionamento com o Responsável principal (fk_responsavel)
        return $this->belongsTo(Responsavel::class, 'fk_responsavel', 'id')
            ->where('status', 1); // Garante que apenas responsável principal ativo seja carregado
    }

    public function responsaveis()
    {
        // Relacionamento com todos os responsáveis associados a este cadastro (tb_responsavel_has_tb_cadastro)
        return $this->belongsToMany(Responsavel::class, 'tb_responsavel_has_tb_cadastro', 'fk_cadastro', 'fk_responsavel')
            ->where('tb_responsavel.status', 1); // Garante que apenas responsáveis ativos são carregados
    }

    public function alunos()
    {
        // Pega alunos através dos responsáveis associados a este cadastro
        // Isso pode ser complexo, pois um aluno é vinculado a um responsável, e o responsável ao cadastro.
        // Uma forma é pegar todos os responsáveis do cadastro, e depois os alunos desses responsáveis.
        return $this->hasManyThrough(
            Aluno::class,
            Responsavel::class,
            'id', // Chave no Responsavel (fk_responsavel da tabela tb_responsavel_has_tb_cadastro)
            'id', // Chave no Aluno (fk_aluno da tabela tb_responsavel_has_tb_aluno)
            'fk_responsavel', // Chave local no Cadastro (seu fk_responsavel)
            'id' // Chave no Responsavel (id do Responsavel)
        )->where('tb_aluno.status', 1); // Garante que apenas alunos ativos são carregados

        // Alternativamente, se a relação principal for Responsavel -> Aluno,
        // e você quer todos os alunos de TODOS os responsáveis ligados a este cadastro,
        // pode-se fazer algo como:
        // return Aluno::whereHas('responsaveis', function($query) {
        //     $query->whereHas('cadastros', function($q) {
        //         $q->where('tb_cadastro.id', $this->id)->where('tb_cadastro.status', 1);
        //     })->where('tb_responsavel.status', 1);
        // })->where('tb_aluno.status', 1);
        // Este é mais complexo, mas mais preciso se um aluno pode ter múltiplos responsáveis e alguns não ligados a este cadastro.
        // Por enquanto, o hasManyThrough para o RESPONSAVEL PRINCIPAL pode ser o suficiente para o 'details'.
        // Para a exibição dos detalhes do DataTables, você carregou os alunos através da relação do 'Cadastro' com 'Responsavel' e 'Responsavel.alunos'. Isso está ok.
    }
    // Relação com Atendente (User)
    public function atendente() // Nome corrigido da relação (era atendenteRelacao no log)
    {
        // A coluna 'atendente' na tb_cadastro é a FK para users.id
        return $this->belongsTo(User::class, 'atendente', 'id');
    }

    // Relação com todos os responsáveis associados (muitos para muitos)
    public function responsaveisPivot()
    {
        return $this->belongsToMany(Responsavel::class, 'tb_responsavel_has_tb_cadastro', 'fk_cadastro', 'fk_responsavel');
    }

    // Relação com Origem
    public function origem()
    {
        return $this->belongsTo(Origem::class, 'fk_origens');
    }

    // Relação com Situação
    public function situacao()
    {
        return $this->belongsTo(Situacao::class, 'fk_situacao');
    }

    // Relação com Observacoes
    public function observacoes()
    {
        return $this->hasMany(Observacao::class, 'fk_cadastro', 'id')->orderBy('dt_insert', 'desc'); // Ordena da mais recente para a mais antiga
    }

    // Se você quiser um escopo global para apenas cadastros ativos por padrão
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('active', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $builder->where('tb_cadastro.status', 1);
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
