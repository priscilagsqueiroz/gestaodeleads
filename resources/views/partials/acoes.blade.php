<a href="{{ route('cadastros.edit', $row->codigo) }}" class="btn btn-sm btn-primary">Editar</a>
<form action="{{ route('cadastros.destroy', $row->codigo) }}" method="POST" style="display:inline;" class="ajax-form">
    @csrf
    @method('DELETE')
    <button class="btn btn-sm btn-danger" onclick="return confirm('Tem certeza?')">Excluir</button>
</form>