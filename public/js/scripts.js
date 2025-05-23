$(document).ready(function () {
    // Toggle Sidebar
    const toggleSidebar = () => {
        $('.sidebar').toggleClass('active');
        $('.main-content').toggleClass('active');
    };

    $('#sidebarCollapse').on('click', function () {
        toggleSidebar();
        $(this).toggleClass('active');
    });

    $('#sidebarToggle').on('click', toggleSidebar);

    // Initialize Sales Chart
    const salesCtx = $('#salesChart').get(0)?.getContext('2d');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales',
                    data: [12, 19, 3, 5, 2, 3, 20, 33, 23, 12, 33, 55],
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderColor: '#FFC107',
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Initialize Traffic Chart
    const trafficCtx = $('#trafficChart').get(0)?.getContext('2d');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Referral', 'Social'],
                datasets: [{
                    data: [300, 50, 100],
                    backgroundColor: ['#FFC107', '#28A745', '#17A2B8'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }

    // Função para preencher selects dinamicamente
    function preencherSelect(selectId, data, valueField, textField, selectedValue = null) {
        const $select = $(selectId);
        $select.html('<option value="">Selecione</option>');
        $.each(data, function (key, value) {
            const selected = (selectedValue !== null && value[valueField] == selectedValue) ? 'selected' : '';
            $select.append(`<option value="${value[valueField]}" ${selected}>${value[textField]}</option>`);
        });
    }

    // Carregar opções para filtros e modais
    function carregarOpcoes(prefixo = '') {
        $.getJSON('/cadastros/opcoes', function (data) {
            preencherSelect(`#${prefixo}Unidade`, data.unidades, 'id', 'nome');
            preencherSelect(`#${prefixo}Situacao`, data.situacoes, 'id', 'nome');
            preencherSelect(`#${prefixo}Origem`, data.origens, 'id', 'nome');
            // Para o modal de novo cadastro, preencher atendentes
            if (prefixo === 'atendenteNovo') {
                preencherSelect(`#${prefixo}`, data.atendentes, 'id', 'name');
            }
        });
    }

    // Configura a atualização da série com base na unidade selecionada
    function setupAtualizaSerie(unidadeSelectId, serieSelectId) {
        $(document).on('change', `#${unidadeSelectId}`, function () {
            const val = $(this).val();
            const $serieSelect = $(`#${serieSelectId}`);

            if (!val) {
                $serieSelect.html('<option value="">Selecione uma unidade antes</option>');
                return;
            }

            $serieSelect.html('<option value="">Carregando...</option>');

            $.getJSON(`/series/escola/${val}`, function (data) {
                if (data.length) {
                    preencherSelect(`#${serieSelectId}`, data, 'id', 'nome');
                } else {
                    $serieSelect.html('<option value="">Nenhuma série encontrada</option>');
                }
            }).fail(function () {
                $serieSelect.html('<option value="">Erro ao carregar</option>');
            });
        });
    }

    // --- Gerenciamento Dinâmico de Responsáveis e Alunos ---

    // Contador para novos responsáveis (para atribuir IDs únicos temporários)
    let responsibleCounter = 0;
    // Contador para novos alunos (para atribuir IDs únicos temporários)
    let studentCounter = 0;

    // Função para adicionar um novo card de responsável
    function addResponsibleCard(containerId, responsibleData = {}) {
        const responsibleId = responsibleData.id || 'new_' + responsibleCounter++;
        const responsibleName = responsibleData.nome || '';
        const responsibleEmail = responsibleData.email || '';
        const responsibleCelular = responsibleData.celular || '';

        const newResponsibleHtml = `
            <div class="card mb-4 responsible-card" data-responsible-id="${responsibleId}">
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
                            <input type="text" class="form-control" name="responsibles[${responsibleId}][nome]" value="${responsibleName}" required>
                            <input type="hidden" name="responsibles[${responsibleId}][id]" value="${responsibleId}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">E-mail:</label>
                            <input type="email" class="form-control" name="responsibles[${responsibleId}][email]" value="${responsibleEmail}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Celular:</label>
                            <input type="text" class="form-control phone-mask" name="responsibles[${responsibleId}][celular]" value="${responsibleCelular}">
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-user-graduate me-2"></i>Alunos Relacionados</span>
                            <button type="button" class="btn btn-sm btn-success add-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-responsible-id="${responsibleId}">
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
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $(`#${containerId}`).append(newResponsibleHtml);
        $('.phone-mask').mask('(00) 00000-0000'); // Reaplica a máscara a novos elementos
    }

    // Função para adicionar/atualizar uma linha de aluno
    function addOrUpdateStudentRow(responsibleId, studentData) {
        const studentUniqueId = studentData.id || 'new_' + studentCounter++;
        const responsiblePrefix = `responsibles[${responsibleId}][alunos][${studentUniqueId}]`;

        const studentRowHtml = `
            <tr data-student-id="${studentUniqueId}">
                <td>${studentData.nome}</td>
                <td>${studentData.data_nascimento ? new Date(studentData.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informado'}</td>
                <td>${studentData.serie_nome}</td>
                <td>${studentData.unidade_nome}</td>
                <td>
                    ${studentData.colegio_atual || 'Não informado'}
                    <input type="hidden" name="${responsiblePrefix}[id]" value="${studentUniqueId}">
                    <input type="hidden" name="${responsiblePrefix}[nome]" value="${studentData.nome}">
                    <input type="hidden" name="${responsiblePrefix}[data_nascimento]" value="${studentData.data_nascimento}">
                    <input type="hidden" name="${responsiblePrefix}[fk_serie]" value="${studentData.fk_serie}">
                    <input type="hidden" name="${responsiblePrefix}[fk_escola]" value="${studentData.fk_escola}">
                    <input type="hidden" name="${responsiblePrefix}[colegio_atual]" value="${studentData.colegio_atual}">
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-info edit-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-student-data='${JSON.stringify(studentData)}' data-responsible-id="${responsibleId}"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-sm btn-danger remove-student-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;

        const $studentsTableBody = $(`.responsible-card[data-responsible-id="${responsibleId}"] .students-table tbody`);
        const existingRow = $studentsTableBody.find(`tr[data-student-id="${studentUniqueId}"]`);

        if (existingRow.length) {
            existingRow.replaceWith(studentRowHtml);
        } else {
            $studentsTableBody.append(studentRowHtml);
        }
    }

    // Lida com o clique no botão "Adicionar Responsável" no modal de edição (para adicionar novos)
    $('#addResponsavelModal').on('show.bs.modal', function (event) {
        $('#responsavelForm')[0].reset();
        $('#addResponsavelModalLabel').text('Adicionar Responsável');
    });

    // Lida com o salvamento de um novo responsável do modal
    $('#btnSaveResponsible').on('click', function () {
        const nome = $('#responsavelNome').val();
        const email = $('#responsavelEmail').val();
        const celular = $('#responsavelCelular').val();

        if (!nome) {
            alert('O nome do responsável é obrigatório.');
            return;
        }

        const responsibleData = { nome, email, celular };
        addResponsibleCard('responsiblesContainer', responsibleData); // Adiciona ao container da página de edição
        $('#addResponsavelModal').modal('hide');
    });

    // Remover Responsável
    $(document).on('click', '.remove-responsible', function () {
        if (confirm('Tem certeza que deseja remover este responsável e todos os seus alunos?')) {
            $(this).closest('.responsible-card').remove();
        }
    });

    // Lida com o clique no botão "Adicionar Aluno"
    $(document).on('click', '.add-student-btn', function () {
        const responsibleId = $(this).data('responsible-id');
        $('#responsibleForStudentId').val(responsibleId); // Define o ID do responsável para o modal do aluno
        $('#addStudentModalLabel').text('Adicionar Aluno');
        $('#studentForm')[0].reset(); // Limpa o formulário do aluno
        $('#currentStudentId').val(''); // Limpa o ID do aluno atual
        $('#serieAluno').html('<option value="">Selecione uma unidade antes</option>'); // Reseta o select de séries
        // Preencher unidades no modal do aluno
        $.getJSON('/cadastros/opcoes', function (data) {
            preencherSelect('#unidadeAluno', data.unidades, 'id', 'nome');
        });
    });

    // Lida com o clique no botão "Editar Aluno"
    $(document).on('click', '.edit-student-btn', function () {
        const studentData = $(this).data('student-data');
        const responsibleId = $(this).data('responsible-id');

        $('#responsibleForStudentId').val(responsibleId);
        $('#currentStudentId').val(studentData.id);
        $('#addStudentModalLabel').text('Editar Aluno');

        $('#nomeAluno').val(studentData.nome);
        $('#dataNascimentoAluno').val(studentData.data_nascimento);

        // Preencher unidades no modal do aluno e selecionar a unidade correta
        $.getJSON('/cadastros/opcoes', function (data) {
            preencherSelect('#unidadeAluno', data.unidades, 'id', 'nome', studentData.fk_escola);
            // Carregar séries com base na unidade selecionada e depois selecionar a série correta
            $.getJSON(`/series/escola/${studentData.fk_escola}`, function (seriesData) {
                preencherSelect('#serieAluno', seriesData, 'id', 'nome', studentData.fk_serie);
            });
        });
        $('#colegioAtualAluno').val(studentData.colegio_atual);
    });

    // Lida com o clique no botão "Salvar Aluno"
    $('#btnSaveStudent').on('click', function () {
        const responsibleId = $('#responsibleForStudentId').val();
        const studentId = $('#currentStudentId').val();
        const nomeAluno = $('#nomeAluno').val();
        const dataNascimentoAluno = $('#dataNascimentoAluno').val();
        const unidadeId = $('#unidadeAluno').val();
        const serieId = $('#serieAluno').val();
        const colegioAtual = $('#colegioAtualAluno').val();

        if (!nomeAluno || !dataNascimentoAluno || !unidadeId || !serieId) {
            alert('Por favor, preencha todos os campos obrigatórios do aluno.');
            return;
        }

        // Obter valores de texto para exibição
        const unidadeNome = $('#unidadeAluno option:selected').text();
        const serieNome = $('#serieAluno option:selected').text();

        const studentData = {
            id: studentId, // Será 'new_X' para novos alunos, ou o ID real para existentes
            nome: nomeAluno,
            data_nascimento: dataNascimentoAluno,
            fk_escola: unidadeId,
            unidade_nome: unidadeNome,
            fk_serie: serieId,
            serie_nome: serieNome,
            colegio_atual: colegioAtual
        };

        addOrUpdateStudentRow(responsibleId, studentData);
        $('#addStudentModal').modal('hide');
    });

    // Remover Aluno
    $(document).on('click', '.remove-student-btn', function () {
        if (confirm('Tem certeza que deseja remover este aluno?')) {
            $(this).closest('tr').remove();
        }
    });

    // Lida com a submissão do formulário (ajax-form) para edição e novo cadastro
    $(document).on('submit', '.ajax-form', function (e) {
        e.preventDefault();
        const $form = $(this);
        const responsiblesData = {};

        // Organiza os dados dos responsáveis e alunos
        $form.find('.responsible-card').each(function () {
            const responsibleId = $(this).data('responsible-id');
            const responsibleName = $(this).find(`input[name="responsibles[${responsibleId}][nome]"]`).val();
            const responsibleEmail = $(this).find(`input[name="responsibles[${responsibleId}][email]"]`).val();
            const responsibleCelular = $(this).find(`input[name="responsibles[${responsibleId}][celular]"]`).val();

            responsiblesData[responsibleId] = {
                id: responsibleId,
                nome: responsibleName,
                email: responsibleEmail,
                celular: celular,
                alunos: {}
            };

            $(this).find('.students-table tbody tr').each(function () {
                const studentId = $(this).data('student-id');
                // Recupera os valores dos inputs hidden
                const studentName = $(this).find(`input[name$="[${studentId}][nome]"]`).val();
                const studentDataNascimento = $(this).find(`input[name$="[${studentId}][data_nascimento]"]`).val();
                const studentFkSerie = $(this).find(`input[name$="[${studentId}][fk_serie]"]`).val();
                const studentFkEscola = $(this).find(`input[name$="[${studentId}][fk_escola]"]`).val();
                const studentColegioAtual = $(this).find(`input[name$="[${studentId}][colegio_atual]"]`).val();

                responsiblesData[responsibleId].alunos[studentId] = {
                    id: studentId,
                    nome: studentName,
                    data_nascimento: studentDataNascimento,
                    fk_serie: studentFkSerie,
                    fk_escola: studentFkEscola,
                    colegio_atual: studentColegioAtual
                };
            });
        });

        const mainCadastroData = {
            fk_atendente: $form.find('[name="fk_atendente"]').val(),
            fk_origens: $form.find('[name="fk_origens"]').val(),
            fk_situacao: $form.find('[name="fk_situacao"]').val(),
            observacoes: $form.find('[name="observacoes"]').val(),
            responsibles: responsiblesData // Envia os dados estruturados
        };

        // Envia os dados via AJAX
        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            data: mainCadastroData, // Envia como JSON
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    window.location.href = "{{ route('cadastros.index') }}";
                } else {
                    alert('Erro ao salvar o cadastro: ' + response.error);
                }
            },
            error: function (xhr) {
                let errorMessage = 'Erro ao salvar o cadastro.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage += '\n' + xhr.responseJSON.message;
                    if (xhr.responseJSON.errors) {
                        for (const key in xhr.responseJSON.errors) {
                            errorMessage += `\n${key}: ${xhr.responseJSON.errors[key].join(', ')}`;
                        }
                    }
                }
                alert(errorMessage);
            }
        });
    });

    // Inicialização do DataTables
    var cadastrosTable = $('#cadastros-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: cadastrosListarRoute,
            ddata: function (d) {
                d.unidade = $('#filterUnidade').val();
                d.serie = $('#filterSerie').val();
                d.situacao = $('#filterSituacao').val();
                d.origem = $('#filterOrigem').val();
                d.data_inicio = $('#filterDataInicio').val();
                d.data_fim = $('#filterDataFim').val();
            }
        },
        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: ''
            },
            { data: 'id', name: 'codigo' },
            { data: 'responsavel_nome', name: 'responsavel_nome' },
            { data: 'responsavel_email', name: 'responsavel_email' },
            { data: 'responsavel_celular', name: 'responsavel_celular' }, // Exibir como WhatsApp
            { data: 'atendente_nome', name: 'atendente_nome' },
            { data: 'origem_nome', name: 'origem_nome' },
            { data: 'situacao_nome', name: 'situacao_nome' },
            { data: 'data_cadastro', name: 'data_cadastro' },
            { data: 'acoes', name: 'acoes', orderable: false, searchable: false }
        ],
        order: [[1, 'asc']], // Ordenar por Código por padrão
        language: {
            url: '/js/pt-BR.json'
        }
    });

    // Adicionar listener de evento para abrir e fechar detalhes
    $('#cadastros-table tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = cadastrosTable.row(tr);

        if (row.child.isShown()) {
            // Esta linha já está aberta - fechar
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Abrir esta linha
            const cadastroId = row.data().id;
            if (cadastroId) {
                $.ajax({
                    url: `/cadastros/${cadastroId}/details`, // Novo endpoint para detalhes
                    method: 'GET',
                    success: function (data) {
                        row.child(format(data)).show();
                        tr.addClass('shown');
                    },
                    error: function (xhr) {
                        console.error('Erro ao carregar detalhes:', xhr);
                        row.child('Erro ao carregar detalhes.').show();
                        tr.addClass('shown');
                    }
                });
            } else {
                row.child('ID do cadastro não encontrado.').show();
                tr.addClass('shown');
            }
        }
    });

    // Função para formatar os detalhes da linha (sub-tabela)
    function format(d) { // 'd' é o objeto JSON que vem do servidor
        let html = '<div class="card p-3 bg-light">';

        // Exibir Alunos
        if (d.alunos && d.alunos.length > 0) {
            html += `
            <h5><i class="fas fa-user-graduate me-2"></i>Alunos Associados</h5>
            <table class="table table-sm table-bordered mb-3">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data de Nascimento</th>
                        <th>Série</th>
                        <th>Escola</th>
                        <th>Colégio Atual</th>
                    </tr>
                </thead>
                <tbody>
        `;
            d.alunos.forEach(aluno => {
                html += `
                <tr>
                    <td>${aluno.nome || 'Não informado'}</td>
                    <td>${aluno.data_nascimento ? new Date(aluno.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informado'}</td>
                    <td>${aluno.serie_nome || 'Não informado'}</td>
                    <td>${aluno.escola_nome || 'Não informado'}</td>
                    <td>${aluno.colegio_atual || 'Não informado'}</td>
                </tr>
            `;
            });
            html += `
                </tbody>
            </table>
        `;
        } else {
            html += '<p>Nenhum aluno associado.</p>';
        }

        // Exibir Responsáveis Adicionais (se houver)
        if (d.responsaveis && d.responsaveis.length > 0) {
            // A lógica para 'responsaveis' continua aqui...
            // Certifique-se que ela também usa as chaves corretas do JSON para 'responsaveis'
            html += `
            <h5><i class="fas fa-users me-2"></i>Outros Responsáveis</h5>
            <table class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Celular</th>
                    </tr>
                </thead>
                <tbody>
        `;
            d.responsaveis.forEach(responsavel => {
                html += `
                <tr>
                    <td>${responsavel.nome || 'Não informado'}</td>
                    <td>${responsavel.email || 'Não informado'}</td>
                    <td>${responsavel.celular || 'Não informado'}</td>
                </tr>
            `;
            });
            html += `
                </tbody>
            </table>
        `;
        } else {
            // Se não houver outros responsáveis, você pode optar por não mostrar nada
            // ou uma mensagem como '<p>Não há outros responsáveis adicionais.</p>'
            // dependendo da lógica do seu controller para a chave 'responsaveis'
        }

        html += '</div>';
        return html;
    }
    // Botão Filtrar - recarrega a tabela com filtros aplicados
    $('#btnFiltrar').on('click', function () {
        cadastrosTable.ajax.reload();
    });

    // Botão Limpar - reseta formulário e recarrega tabela sem filtro
    $('#filterForm').on('reset', function () {
        // Dá um pequeno delay para que os selects sejam resetados antes do reload
        setTimeout(() => {
            $('#filterSerie').html('<option value="">Selecione uma unidade antes</option>');
            cadastrosTable.ajax.reload();
        }, 10);
    });

    // Modal para novo cadastro
    $('#cadastroModal').on('show.bs.modal', function () {
        // Limpa os campos do formulário
        $('#novoCadastroForm')[0].reset();
        // Limpa as seções dinâmicas (responsáveis e alunos)
        $('#newResponsiblesContainer').html('');
        // Adiciona o responsável inicial para um novo cadastro
        addResponsibleCard('newResponsiblesContainer', { id: 'new_0', nome: '', email: '', celular: '' }); // Começa com um responsável vazio
    });

    // Lida com o clique no botão "Adicionar Outro Responsável" no modal de novo cadastro
    $('#addNewResponsibleBtn').on('click', function () {
        addResponsibleCard('newResponsiblesContainer', {}); // Adiciona um novo card de responsável vazio
    });

    // Inicialização das opções de selects para filtros e modais
    carregarOpcoes('filter'); // Para filtros
    carregarOpcoes('atendenteNovo'); // Para atendente no modal de novo cadastro
    carregarOpcoes('origemNovo'); // Para origem no modal de novo cadastro
    carregarOpcoes('situacaoNovo'); // Para situação no modal de novo cadastro

    // Configuração para carregamento de séries no modal de aluno (para edição e novo cadastro)
    setupAtualizaSerie('unidadeAluno', 'serieAluno');

    // Inicializa para prefixo vazio (sem prefixo) para a página de edição (se houver)
    // e para o modal de novo cadastro (unidade/serie no aluno)
    setupAtualizaSerie('unidade', 'serie'); // Para o formulário de edição principal (se houver)

    // Reaplicar máscara de telefone em novos elementos (ex: quando um responsável é adicionado dinamicamente)
    $(document).on('focus', '.phone-mask', function () {
        if (!$(this).data('masked')) {
            $(this).mask('(00) 00000-0000');
            $(this).data('masked', true);
        }
    });

    // Lida com o botão de exclusão da tabela principal
    $(document).on('click', '.btn-delete', function () {
        const cadastroId = $(this).data('id');
        if (confirm('Tem certeza que deseja excluir este cadastro?')) {
            $.ajax({
                url: `/cadastros/${cadastroId}`,
                type: 'POST', // Laravel usa POST para DELETE com @method('DELETE')
                data: {
                    _method: 'DELETE',
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        cadastrosTable.ajax.reload(); // Recarrega a tabela
                    } else {
                        alert('Erro ao excluir o cadastro: ' + response.error);
                    }
                },
                error: function (xhr) {
                    alert('Erro ao excluir o cadastro.');
                    console.error(xhr);
                }
            });
        }
    });
});
