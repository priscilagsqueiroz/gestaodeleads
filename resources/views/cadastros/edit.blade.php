<!-- "resources/views/cadastros/edit.blade.php" -->
@extends('layouts.app')
@section('title', 'Editar Cadastro')
@php
$hoje = date('Y-m-d');
@endphp
@section('content')
<div class="row mb-4">
    <div class="col-6 d-flex justify-content-between align-items-center">
        <h2>Editar Cadastro</h2>
    </div>
    <div class="col-6 d-flex justify-content-end align-items-center">
        <button class="btn btn-sm btn-info btn-view-observacoes" data-id="{{ $cadastro->id }}" data-bs-toggle="modal" data-bs-target="#observacoesModal" data-bs-title="Ver observações"><i class="fas fa-comments"></i></button>
    </div>
</div>
<form id="cadastroFormEdit" class="ajax-form" action="{{ route('cadastros.update', $cadastro->id) }}" method="POST">
    @csrf
    @method('PUT')

    <div class="card mb-4">
        <div class="card-header"><i class="fas fa-info-circle me-2"></i>Informações do Cadastro</div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="atendente" class="form-label">Atendente*</label>
                    <select class="form-select" id="atendente" name="fk_atendente" required>
                        <option value="">Selecione</option>
                        @foreach($atendentes as $atendente)
                        <option value="{{ $atendente->id }}" {{ $cadastro->atendente == $atendente->id ? 'selected' : '' }}>{{ $atendente->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="origem" class="form-label">Origem*</label>
                    <select class="form-select" id="origem" name="fk_origens" required>
                        <option value="">Selecione</option>
                        @foreach($origens as $origem)
                        <option value="{{ $origem->id }}" {{ $cadastro->fk_origens == $origem->id ? 'selected' : '' }}>{{ $origem->nome }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="situacao" class="form-label">Situação*</label>
                    <select class="form-select" id="situacao" name="fk_situacao" required>
                        <option value="">Selecione</option>
                        @foreach($situacoes as $situacao)
                        <option value="{{ $situacao->id }}" {{ $cadastro->fk_situacao == $situacao->id ? 'selected' : '' }}>{{ $situacao->nome }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div id="responsiblesContainer">
        @foreach($cadastro->responsaveis as $responsavel_item)
        <div class="card mb-4 responsible-card" data-responsible-id="{{ $responsavel_item->id }}">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="fas fa-user-tie me-2"></i>Informações do Responsável</span>
                <div>
                    <!--button type="button" class="btn btn-sm btn-danger remove-responsible"><i class="fas fa-trash me-1"></i>Remover Responsável</button-->
                </div>
            </div>
            <div class="card-body">
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <label class="form-label">Nome:*</label>
                        <input type="text" class="form-control" name="responsibles[{{ $responsavel_item->id }}][nome]" value="{{ $responsavel_item->nome }}" required>
                        <input type="hidden" name="responsibles[{{ $responsavel_item->id }}][id]" value="{{ $responsavel_item->id }}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">E-mail:</label>
                        <input type="email" class="form-control" name="responsibles[{{ $responsavel_item->id }}][email]" value="{{ $responsavel_item->email }}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Celular:</label>
                        <input type="text" class="form-control phone-mask" name="responsibles[{{ $responsavel_item->id }}][celular]" value="{{ $responsavel_item->celular }}">
                    </div>
                </div>

                <div class="card mb-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-user-graduate me-2"></i>Alunos Relacionados</span>
                        <button type="button" class="btn btn-sm btn-success add-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-responsible-id="{{ $responsavel_item->id }}">
                            <i class="fas fa-plus-circle me-1"></i>Adicionar Aluno
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped students-table">
                                <thead>
                                    <th>Nome</th>
                                    <th>Data de Nascimento</th>
                                    <th>Série</th>
                                    <th>Unidade</th>
                                    <th>Colégio Atual</th>
                                    <th>Ações</th>
                                </thead>
                                <tbody>
                                    @foreach($responsavel_item->alunos as $aluno)
                                    @php
                                    // Prepara os dados do aluno de forma similar ao que o JS espera para o 'data-student-raw'
                                    // Isso é útil para popular o modal de edição de aluno corretamente.
                                    $dadosAlunoParaJs = [
                                    'id' => $aluno->id,
                                    'nome' => $aluno->nome,
                                    'dt_nascimento' => $aluno->dt_nascimento, // O JS vai formatar se necessário
                                    'data_nascimento' => $aluno->dt_nascimento, // Para consistência com o objeto JS
                                    'fk_serie' => $aluno->fk_serie,
                                    'fk_escola' => $aluno->fk_escola,
                                    'serie_nome' => $aluno->serie->nome ?? null, // Nome da série para exibição e modal
                                    'unidade_nome' => $aluno->escola->nome ?? null, // Nome da unidade/escola para exibição e modal
                                    'escola' => $aluno->escola ? ['id' => $aluno->escola->id, 'nome' => $aluno->escola->nome] : null,
                                    'serie' => $aluno->serie ? ['id' => $aluno->serie->id, 'nome' => $aluno->serie->nome] : null,
                                    'colegio_atual' => $aluno->colegio_atual
                                    ];

                                    // Formata a data de nascimento para o formato YYYY-MM-DD para o input hidden
                                    $dataNascimentoInputValue = '';
                                    if ($aluno->dt_nascimento) {
                                    try {
                                    // Tenta parsear a data; ajuste o formato de origem se 'Y-m-d H:i:s' não for o padrão
                                    $dataNascimentoInputValue = \Carbon\Carbon::parse($aluno->dt_nascimento)->format('Y-m-d');
                                    } catch (\Exception $e) {
                                    // Se falhar, tenta converter de d/m/Y para Y-m-d
                                    try {
                                    $dataNascimentoInputValue = \Carbon\Carbon::createFromFormat('d/m/Y', $aluno->dt_nascimento)->format('Y-m-d');
                                    } catch (\Exception $e2) {
                                    $dataNascimentoInputValue = $aluno->dt_nascimento; // Mantém o original se a conversão falhar
                                    }
                                    }
                                    }
                                    @endphp
                                    <tr data-student-id="{{ $aluno->id }}">
                                        <td>{{ $aluno->nome ?? 'N/A' }}</td>
                                        <td>{{ $aluno->dt_nascimento ? (\Carbon\Carbon::parse($dataNascimentoInputValue)->format('d/m/Y')) : 'N/A' }}</td>
                                        <td>{{ $aluno->serie->nome ?? 'N/A' }}</td>
                                        <td>{{ $aluno->escola->nome ?? 'N/A' }}</td>
                                        <td>
                                            {{ $aluno->colegio_atual ?? 'N/A' }}
                                            {{-- Inputs Hidden para submissão dos dados do aluno --}}
                                            <input type="hidden" name="responsibles[{{ $responsavel_item->id }}][alunos][{{ $aluno->id }}][id]" value="{{ $aluno->id }}">
                                            <input type="hidden" name="responsibles[{{ $responsavel_item->id }}][alunos][{{ $aluno->id }}][nome]" value="{{ $aluno->nome ?? '' }}">
                                            <input type="hidden" name="responsibles[{{ $responsavel_item->id }}][alunos][{{ $aluno->id }}][data_nascimento]" value="{{ $dataNascimentoInputValue }}">
                                            <input type="hidden" name="responsibles[{{ $responsavel_item->id }}][alunos][{{ $aluno->id }}][fk_serie]" value="{{ $aluno->fk_series ?? '' }}">
                                            <input type="hidden" name="responsibles[{{ $responsavel_item->id }}][alunos][{{ $aluno->id }}][fk_escola]" value="{{ $aluno->fk_escolas ?? '' }}">
                                            <input type="hidden" name="responsibles[{{ $responsavel_item->id }}][alunos][{{ $aluno->id }}][colegio_atual]" value="{{ $aluno->colegio_atual ?? '' }}">
                                        </td>
                                        <td>
                                            {{-- Botões de Ação --}}
                                            <button type="button" class="btn btn-sm btn-info edit-student-btn"
                                                data-bs-toggle="modal" data-bs-target="#addStudentModal"
                                                data-student-raw="{{ htmlspecialchars(json_encode($dadosAlunoParaJs), ENT_QUOTES, 'UTF-8') }}"
                                                data-responsible-id="{{ $responsavel_item->id }}" data-bs-title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-danger remove-student-btn" data-bs-toggle="tooltip" data-bs-title="Excluir">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>

    <!-- <button type="button" class="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#addResponsavelModal"><i class="fas fa-plus-circle me-1"></i>Adicionar Outro Responsável</button> -->

    <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-success me-2">Salvar Cadastro</button>
        <a href="{{ route('cadastros.index') }}" class="btn btn-secondary">Cancelar</a>
    </div>
</form>

<div class="modal fade" id="addResponsavelModal" tabindex="-1" aria-labelledby="addResponsavelModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addResponsavelModalLabel">Adicionar Responsável</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="responsavelForm">
                    <div class="mb-3">
                        <label for="responsavelNome" class="form-label">Nome*</label>
                        <input type="text" class="form-control" id="responsavelNome" required>
                    </div>
                    <div class="mb-3">
                        <label for="responsavelEmail" class="form-label">E-mail</label>
                        <input type="email" class="form-control" id="responsavelEmail">
                    </div>
                    <div class="mb-3">
                        <label for="responsavelCelular" class="form-label">Celular</label>
                        <input type="text" class="form-control phone-mask" id="responsavelCelular">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnSaveResponsible">Salvar Responsável</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="addStudentModal" tabindex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addStudentModalLabel">Adicionar/Editar Aluno</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="studentForm">
                    <input type="hidden" id="currentStudentId">
                    <input type="hidden" id="responsibleForStudentId">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="nomeAluno" class="form-label">Nome do Aluno*</label>
                            <input type="text" class="form-control" id="nomeAluno" required>
                        </div>
                        <div class="col-md-6">
                            <label for="dataNascimentoAluno" class="form-label">Data de Nascimento*</label>
                            <input type="date" class="form-control" id="dataNascimentoAluno" max="{{ $hoje }}" required>
                        </div>
                        <div class="col-md-6">
                            <label for="unidadeAluno" class="form-label">Unidade*</label>
                            <select class="form-select" id="unidadeAluno" name="unidade" required>
                                <option value="">Selecione</option>
                                @foreach($unidades as $unidade)
                                <option value="{{ $unidade->id }}">{{ $unidade->nome }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="serieAluno" class="form-label">Série*</label>
                            <select class="form-select" id="serieAluno" name="serie" required>
                                <option value="">Selecione uma unidade antes</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="colegioAtualAluno" class="form-label">Colégio Atual</label>
                            <input type="text" class="form-control" id="colegioAtualAluno">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnSaveStudent">Salvar Aluno</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="observacoesModal" tabindex="-1" aria-labelledby="observacoesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="observacoesModalLabel">Observações do Cadastro</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="novaObservacaoTexto" class="form-label">Adicionar Nova Observação:</label>
                    <textarea class="form-control" id="novaObservacaoTexto" rows="3"></textarea>
                    <input type="hidden" id="observacaoCadastroId" value="">
                    <input type="hidden" id="editingObservacaoId" value="">
                </div>
                <button type="button" class="btn btn-primary mb-3" id="btnSalvarNovaObservacao">
                    <i class="fas fa-save me-1"></i> Salvar Observação
                </button>
                <hr>
                <h5>Histórico de Observações:</h5>
                <div id="observacoesConteudo">
                    <p>Carregando observações...</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    // Define a variável JavaScript com a rota do Laravel
    const rotaObservacoesBase = "{{ route('cadastros.observacoes', ['cadastro' => ':id']) }}";
    const rotaObservacoesStoreBase = "{{ route('cadastros.observacoes.store', ['cadastro' => ':id']) }}";
</script>
@endpush