@extends('layouts.app')
@section('title', 'Atendentes')
@section('content')

<div class="row mb-4">
    <div class="col-12 d-flex justify-content-between align-items-center">
        <h2>Gerenciamento de Atendentes</h2>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#atendenteModal">
            <i class="fas fa-user-plus me-2"></i>Novo Atendente
        </button>
    </div>
</div>

<div class="card">
    <div class="card-header">
        Lista de Atendentes
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table id="atendentesTable" class="table table-striped table-hover" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Unidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal Novo Atendente -->
<div class="modal fade" id="atendenteModal" tabindex="-1" aria-labelledby="atendenteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <form id="cadastroForm" class="ajax-form" action="{{ route('atendentes.store') }}" method="POST">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Novo Atendente</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label for="name" class="form-label">Nome*</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>

                        <div class="col-md-12">
                            <label for="email" class="form-label">E-mail*</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>

                        <div class="col-md-12">
                            <label for="fk_escolas" class="form-label">Unidade*</label>
                            <select class="form-select" id="fk_escolas" name="fk_escolas" required>
                                <option value="">Selecione</option>
                                @foreach($unidades as $unidade)
                                <option value="{{ $unidade->id }}">{{ $unidade->nome }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="col-md-12">
                            <label for="password" class="form-label">Senha*</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>

                        <div class="col-md-12">
                            <label for="password_confirmation" class="form-label">Confirmar senha*</label>
                            <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" required>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </div>
        </form>

    </div>
</div>

<!-- Modal Editar Atendente -->
<div class="modal fade" id="editAtendenteModal" tabindex="-1" aria-labelledby="editAtendenteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <form id="editAtendenteForm" class="ajax-form" method="POST">
            @csrf
            @method('PUT')
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Atendente</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="edit_id" name="id" />
                    <div class="mb-3">
                        <label for="edit_name" class="form-label">Nome*</label>
                        <input type="text" class="form-control" id="edit_name" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="edit_email" class="form-label">E-mail*</label>
                        <input type="email" class="form-control" id="edit_email" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="edit_password" class="form-label">Senha (deixe em branco para manter)</label>
                        <input type="password" class="form-control" id="edit_password" name="password">
                    </div>
                    <div class="mb-3">
                        <label for="edit_password_confirmation" class="form-label">Confirmar senha</label>
                        <input type="password" class="form-control" id="edit_password_confirmation" name="password_confirmation">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                </div>
            </div>
        </form>
    </div>
</div>

@endsection