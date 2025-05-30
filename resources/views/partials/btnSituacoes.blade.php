<button class="btn btn-sm btn-primary btn-edit-situacao"
    data-id="{{ $row->id }}"
    data-name="{{ $row->nome }}"
    data-legenda="{{ $row->legenda }}"
    data-bs-toggle="tooltip" 
    data-bs-title="Editar">
    <i class="fas fa-edit"></i>
</button>

<button type="button"
    class="btn btn-sm btn-danger btn-delete-situacao"
    data-id="{{ $row->id }}"
    data-nome="{{ $row->nome }}"
    data-legenda="{{ $row->legenda }}"
    data-bs-toggle="tooltip"
    data-bs-title="Excluir">
    <i class="fas fa-trash"></i>
</button>