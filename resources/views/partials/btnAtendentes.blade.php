<button class="btn btn-sm btn-primary btn-edit-atendente"
    data-id="{{ $row->id }}"
    data-name="{{ $row->name }}"
    data-email="{{ $row->email }}">
    Editar
</button>

<button type="button"
    class="btn btn-sm btn-danger btn-delete-atendente"
    data-id="{{ $row->id }}"
    data-nome="{{ $row->name }}">
    Excluir
</button>