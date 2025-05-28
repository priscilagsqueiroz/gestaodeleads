<a href="{{ $editUrl }}" class="btn btn-sm btn-warning" data-bs-toggle="tooltip" data-bs-title="Editar" data-bs-placement="top">
    <i class="fas fa-edit"></i>
</a>
<button class="btn btn-sm btn-info btn-view-observacoes" 
        data-id="{{ $id }}" 
        data-bs-toggle="modal"
        data-bs-target="#observacoesModal" 
        data-bs-toggle-tooltip="true"
        data-bs-title="Ver observações"
        data-bs-placement="top">
    <i class="fas fa-comments"></i>
</button>
<button class="btn btn-sm btn-danger btn-delete" 
        data-id="{{ $id }}" 
        data-bs-toggle="tooltip" 
        data-bs-title="Excluir"
        data-bs-placement="top">
    <i class="fas fa-trash"></i>
</button>