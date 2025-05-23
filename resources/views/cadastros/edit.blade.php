@extends('layouts.app')
@section('title', 'Editar Cadastro')
@php
    $hoje = date('Y-m-d');
@endphp
@section('content')
<div class="row mb-4">
    <div class="col-12 d-flex justify-content-between align-items-center">
        <h2>Editar Cadastro</h2>
    </div>
</div>
<form id="cadastroForm" class="ajax-form" action="{{ route('cadastros.update', $cadastro->id) }}" method="POST">
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
                            <option value="{{ $atendente->id }}" {{ $cadastro->fk_atendente == $atendente->id ? 'selected' : '' }}>{{ $atendente->name }}</option>
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
                <div class="col-12">
                    <label for="observacoes" class="form-label">Observações</label>
                    <textarea class="form-control" id="observacoes" name="observacoes" rows="3">{{ $cadastro->observacoes }}</textarea>
                </div>
            </div>
        </div>
    </div>

    <div id="responsiblesContainer">
        @foreach($cadastro->responsavel as $responsavel)
            <div class="card mb-4 responsible-card" data-responsible-id="{{ $responsavel->id }}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><i class="fas fa-user-tie me-2"></i>Informações do Responsável</span>
                    <div>
                        <button type="button" class="btn btn-sm btn-danger remove-responsible"><i class="fas fa-trash me-1"></i>Remover Responsável</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label">Nome:*</label>
                            <input type="text" class="form-control" name="responsibles[{{ $responsavel->id }}][nome]" value="{{ $responsavel->nome }}" required>
                            <input type="hidden" name="responsibles[{{ $responsavel->id }}][id]" value="{{ $responsavel->id }}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">E-mail:</label>
                            <input type="email" class="form-control" name="responsibles[{{ $responsavel->id }}][email]" value="{{ $responsavel->email }}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Celular:</label>
                            <input type="text" class="form-control phone-mask" name="responsibles[{{ $responsavel->id }}][celular]" value="{{ $responsavel->celular }}">
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-user-graduate me-2"></i>Alunos Relacionados</span>
                            <button type="button" class="btn btn-sm btn-success add-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-responsible-id="{{ $responsavel->id }}">
                                <i class="fas fa-plus-circle me-1"></i>Adicionar Aluno
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered table-striped students-table">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Data de Nascimento</th>
                                            <th>Série</th>
                                            <th>Escola</th>
                                            <th>Colégio Atual</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($responsavel->alunos as $aluno)
                                            <tr data-student-id="{{ $aluno->id }}">
                                                <td>{{ $aluno->nome }}</td>
                                                <td>{{ \Carbon\Carbon::parse($aluno->data_nascimento)->format('d/m/Y') }}</td>
                                                <td>{{ $aluno->serie->nome ?? 'N/A' }}</td>
                                                <td>{{ $aluno->escola->nome ?? 'N/A' }}</td>
                                                <td>
                                                    {{ $aluno->colegio_atual }}
                                                    <input type="hidden" name="responsibles[{{ $responsavel->id }}][alunos][{{ $aluno->id }}][id]" value="{{ $aluno->id }}">
                                                    <input type="hidden" name="responsibles[{{ $responsavel->id }}][alunos][{{ $aluno->id }}][nome]" value="{{ $aluno->nome }}">
                                                    <input type="hidden" name="responsibles[{{ $responsavel->id }}][alunos][{{ $aluno->id }}][data_nascimento]" value="{{ $aluno->data_nascimento }}">
                                                    <input type="hidden" name="responsibles[{{ $responsavel->id }}][alunos][{{ $aluno->id }}][fk_serie]" value="{{ $aluno->fk_serie }}">
                                                    <input type="hidden" name="responsibles[{{ $responsavel->id }}][alunos][{{ $aluno->id }}][fk_escola]" value="{{ $aluno->fk_escola }}">
                                                    <input type="hidden" name="responsibles[{{ $responsavel->id }}][alunos][{{ $aluno->id }}][colegio_atual]" value="{{ $aluno->colegio_atual }}">
                                                </td>
                                                <td>
                                                    <button type="button" class="btn btn-sm btn-info edit-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-student-data="{{ json_encode($aluno) }}" data-responsible-id="{{ $responsavel->id }}"><i class="fas fa-edit"></i></button>
                                                    <button type="button" class="btn btn-sm btn-danger remove-student-btn"><i class="fas fa-trash"></i></button>
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

    <button type="button" class="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#addResponsavelModal"><i class="fas fa-plus-circle me-1"></i>Adicionar Outro Responsável</button>

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
                    <input type="hidden" id="responsibleForStudentId"> {{-- Para vincular o aluno ao responsável --}}
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
@endsection
