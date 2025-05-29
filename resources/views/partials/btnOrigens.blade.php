<button class="btn btn-sm btn-primary btn-edit-origem"
    data-id="{{ $row->id }}"
    data-name="{{ $row->nome }}"
    data-bs-toggle="tooltip" 
    data-bs-title="Editar">
    <i class="fas fa-edit"></i>
</button>

<button type="button"
    class="btn btn-sm btn-danger btn-delete-origem"
    data-id="{{ $row->id }}"
    data-nome="{{ $row->nome }}"
    data-bs-toggle="tooltip"
    data-bs-title="Excluir">
    <i class="fas fa-trash"></i>
</button>