<!-- "resources/views/cadastros/index.blade.php" -->
@extends('layouts.app')
@section('title', 'Cadastros')
@section('content')
<div class="row mb-4">
    <div class="col-12 d-flex justify-content-between align-items-center">
        <h2>Gerenciamento de Cadastros</h2>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cadastroModal">
            <i class="fas fa-plus-circle me-2"></i>Novo Cadastro
        </button>
    </div>
</div>

<!-- Filters Card -->
<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span>Filtros</span>
        <button class="btn btn-sm btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilters">
            <i class="fas fa-filter"></i>
        </button>
    </div>
    <div class="collapse" id="collapseFilters">
        <div class="card-body">
            <form id="filterForm">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label for="filterUnidade" class="form-label">Unidade</label>
                        <select class="form-select" id="filterUnidade">
                            <!-- opções das escolas -->
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="filterSerie" class="form-label">Série</label>
                        <select class="form-select" id="filterSerie">
                            <option value="">Selecione uma série</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="filterSituacao" class="form-label">Situação</label>
                        <select class="form-select" id="filterSituacao">
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="filterOrigem" class="form-label">Origem</label>
                        <select class="form-select" id="filterOrigem">
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="filterDataInicio" class="form-label">Data Início</label>
                        <input type="date" class="form-control" id="filterDataInicio">
                    </div>
                    <div class="col-md-3">
                        <label for="filterDataFim" class="form-label">Data Fim</label>
                        <input type="date" class="form-control" id="filterDataFim">
                    </div>
                    <div class="col-md-6 d-flex align-items-center">
                        <div class="d-grid gap-2 d-md-flex">
                            <button type="button" class="btn btn-primary" id="btnFiltrar">
                                <i class="fas fa-search me-2"></i>Filtrar
                            </button>
                            <button type="reset" class="btn btn-outline-secondary">
                                <i class="fas fa-eraser me-2"></i>Limpar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>


<div class="card">
    <div class="card-header">
        <i class="fas fa-list me-2"></i>Lista de Cadastros
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-striped table-bordered" id="cadastros-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Código</th>
                        <th>Responsável</th>
                        <th>E-mail</th>
                        <th>WhatsApp</th>
                        <th>Atendente</th>
                        <th>Origem</th>
                        <th>Situação</th>
                        <th>Data de Cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="cadastroModal" tabindex="-1" aria-labelledby="cadastroModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="cadastroModalLabel">Novo Cadastro</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="cadastroFormNovo" class="ajax-form" action="{{ route('cadastros.store') }}" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="card mb-4">
                        <div class="card-header"><i class="fas fa-info-circle me-2"></i>Informações do Cadastro</div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label for="atendenteNovo" class="form-label">Atendente*</label>
                                    <select class="form-select" id="atendenteNovo" name="fk_atendente" required>
                                        <option value="">Selecione</option>
                                        @foreach($atendentes as $atendente)
                                        <option value="{{ $atendente->id }}">{{ $atendente->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="origemNovo" class="form-label">Origem*</label>
                                    <select class="form-select" id="origemNovo" name="fk_origens" required>
                                        <option value="">Selecione</option>
                                        @foreach($origens as $origem)
                                        <option value="{{ $origem->id }}">{{ $origem->nome }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="situacaoNovo" class="form-label">Situação*</label>
                                    <select class="form-select" id="situacaoNovo" name="fk_situacao" required>
                                        <option value="">Selecione</option>
                                        @foreach($situacoes as $situacao)
                                        <option value="{{ $situacao->id }}">{{ $situacao->nome }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label for="observacoesNovo" class="form-label">Observações</label>
                                    <textarea class="form-control" id="observacoesNovo" name="observacoes" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="newResponsiblesContainer">
                        {{-- O primeiro responsável será adicionado via JS --}}
                    </div>
                    <!-- <button type="button" class="btn btn-primary mb-4" id="addNewResponsibleBtn"><i class="fas fa-plus-circle me-1"></i>Adicionar Outro Responsável</button> -->

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="btnSalvar">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>

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
                    <input type="hidden" id="responsibleForStudentId"> {{-- Para vincular o aluno ao responsável --}}
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="nomeAluno" class="form-label">Nome do Aluno*</label>
                            <input type="text" class="form-control" id="nomeAluno" required>
                        </div>
                        <div class="col-md-6">
                            <label for="dataNascimentoAluno" class="form-label">Data de Nascimento*</label>
                            <input type="date" class="form-control" id="dataNascimentoAluno" max="{{ date('Y-m-d') }}" required>
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
    const cadastrosListarRoute = "{{ route('cadastros.listar') }}";
    const cadastrosIndexRoute = "{{ route('cadastros.index') }}";
    const rotaObservacoesBase = "{{ route('cadastros.observacoes', ['cadastro' => ':id']) }}";
    const rotaObservacoesStoreBase = "{{ route('cadastros.observacoes.store', ['cadastro' => ':id']) }}";
</script>
@endpush