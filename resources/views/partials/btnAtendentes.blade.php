<button class="btn btn-sm btn-primary btn-edit-atendente"
    data-id="{{ $row->id }}"
    data-name="{{ $row->name }}"
    data-email="{{ $row->email }}"
    data-bs-toggle="tooltip" 
    data-bs-title="Editar">
    <i class="fas fa-edit"></i>
</button>

<button type="button"
    class="btn btn-sm btn-danger btn-delete-atendente"
    data-id="{{ $row->id }}"
    data-nome="{{ $row->name }}"
    data-bs-toggle="tooltip"
    data-bs-title="Excluir">
    <i class="fas fa-trash"></i>
</button>