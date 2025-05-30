<!-- "resources/views/situacoes/index.blade.php" -->
@extends('layouts.app')
@section('title', 'Situações')
@section('content')

<div class="row mb-4">
    <div class="col-12 d-flex justify-content-between align-items-center">
        <h2>Gerenciamento de Situações</h2>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#situacaoModal">
            <i class="fas fa-user-plus me-2"></i>Nova Situação
        </button>
    </div>
</div>

<div class="card">
    <div class="card-header">
        Lista de Situações
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table id="situacaoTable" class="table table-striped table-hover" style="width:100%">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Legenda</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal Nova Situação -->
<div class="modal fade" id="situacaoModal" tabindex="-1" aria-labelledby="situacaoModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <form id="situacaoFormNovo" class="ajax-form" action="{{ route('situacoes.store') }}" method="POST">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nova Situação</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label for="name" class="form-label">Nome*</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="col-md-12">
                            <label for="legenda" class="form-label">Legenda*</label>
                            <input type="text" class="form-control" id="legenda" name="legenda" required>
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

<!-- Modal Editar Situação -->
<div class="modal fade" id="situacaoFormEdit" tabindex="-1" aria-labelledby="editSituacaoModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <form id="editSituacaoForm" class="ajax-form" method="POST">
            @csrf
            @method('PUT')
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Situação</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="edit_id" name="id" />
                    <div class="mb-3">
                        <label for="edit_name" class="form-label">Nome*</label>
                        <input type="text" class="form-control" id="edit_name" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="edit_legenda" class="form-label">Legenda*</label>
                        <input type="text" class="form-control" id="edit_legenda" name="legenda" required>
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

@push('scripts')
<script>
    // Define a variável JavaScript com a rota do Laravel
    const situacaoListarRoute = "{{ route('situacoes.listar') }}";
</script>
@endpush