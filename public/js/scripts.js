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
    function preencherSelect(selectId, data, valueField, textField, selectedValue = null, placeholder = "Selecione") {
        const $select = $(selectId);
        $select.html(`<option value="">${placeholder}</option>`);
        $.each(data, function (key, value) {
            const selected = (selectedValue !== null && String(value[valueField]) === String(selectedValue)) ? 'selected' : '';
            $select.append(`<option value="${value[valueField]}" ${selected}>${value[textField]}</option>`);
        });
    }

    // Carregar opções para filtros e modais (adaptado para diferentes contextos)
    function carregarOpcoesParaFiltro() {
        $.getJSON("cadastros/opcoes/", function (data) {
            preencherSelect('#filterUnidade', data.unidades, 'id', 'nome', null, 'Todas as Unidades');
            preencherSelect('#filterSituacao', data.situacoes, 'id', 'nome', null, 'Todas as Situações');
            preencherSelect('#filterOrigem', data.origens, 'id', 'nome', null, 'Todas as Origens');
            // Séries no filtro principal é dependente da unidade e não é carregada aqui inicialmente
            $('#filterSerie').html('<option value="">Selecione uma unidade</option>');
        });
    }
    // Para o modal de novo cadastro (carrega atendentes, origens, situações)
    function carregarOpcoesParaNovoCadastro() {
        // Os selects de atendente, origem, situação no modal de novo cadastro
        // já são populados pelo Blade em index.blade.php.
        // Se precisar de carregamento dinâmico para eles também, adicione aqui.
        // Ex:
        // $.getJSON("{{ route('cadastros.opcoes') }}", function (data) {
        //     preencherSelect('#atendenteNovo', data.atendentes, 'id', 'name');
        //     preencherSelect('#origemNovo', data.origens, 'id', 'nome');
        //     preencherSelect('#situacaoNovo', data.situacoes, 'id', 'nome');
        // });
    }


    // Configura a atualização da série com base na unidade selecionada
    function setupAtualizaSerie(unidadeSelectId, serieSelectId, urlBase = '/series/escola/') {
        $(document).on('change', `#${unidadeSelectId}`, function () {
            const val = $(this).val();
            const $serieSelect = $(`#${serieSelectId}`);

            if (!val) {
                $serieSelect.html('<option value="">Selecione uma unidade antes</option>').prop('disabled', true);
                return;
            }

            $serieSelect.html('<option value="">Carregando...</option>').prop('disabled', true);

            // Usar a rota nomeada do Laravel via JavaScript (se você passou via Blade)
            // ou construir a URL diretamente
            const seriesUrl = urlBase.endsWith('/') ? `${urlBase}${val}` : `${urlBase}/${val}`;


            $.getJSON(seriesUrl, function (data) {
                if (data && data.length) {
                    preencherSelect(`#${serieSelectId}`, data, 'id', 'nome', null, 'Selecione uma série');
                    $serieSelect.prop('disabled', false);
                } else {
                    $serieSelect.html('<option value="">Nenhuma série encontrada</option>').prop('disabled', true);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error("Erro ao carregar séries:", textStatus, errorThrown, jqXHR.responseText);
                $serieSelect.html('<option value="">Erro ao carregar séries</option>').prop('disabled', true);
            });
        });
    }

    // --- Gerenciamento Dinâmico de Responsáveis e Alunos ---
    let responsibleCounter = 0;
    let studentCounter = 0;

    function addResponsibleCard(containerId, responsibleData = {}, isEditMode = false) {
        const responsibleId = isEditMode && responsibleData.id ? responsibleData.id : 'new_' + responsibleCounter++;
        const responsibleName = responsibleData.nome || '';
        const responsibleEmail = responsibleData.email || '';
        const responsibleCelular = responsibleData.celular || '';

        const newResponsibleHtml = `
            <div class="card mb-4 responsible-card" data-responsible-id="${responsibleId}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><i class="fas fa-user-tie me-2"></i>Informações do Responsável</span>
                    <div>
                        ${responsibleId.toString().startsWith('new_') || !isEditMode ? '<button type="button" class="btn btn-sm btn-danger remove-responsible"><i class="fas fa-trash me-1"></i>Remover Responsável</button>' : ''}
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label">Nome do Responsável*</label>
                            <input type="text" class="form-control" name="responsibles[${responsibleId}][nome]" value="${responsibleName}" required>
                            <input type="hidden" name="responsibles[${responsibleId}][id]" value="${responsibleId}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">E-mail do Responsável</label>
                            <input type="email" class="form-control" name="responsibles[${responsibleId}][email]" value="${responsibleEmail}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Celular do Responsável</label>
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
                                        ${isEditMode && responsibleData.alunos ? responsibleData.alunos.map(aluno => generateStudentRowHtml(responsibleId, aluno, true)).join('') : '<tr><td colspan="6" class="text-center">Nenhum aluno adicionado.</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $(`#${containerId}`).append(newResponsibleHtml);
        $('.phone-mask').mask('(00) 00000-0000');
        if ($(`#${containerId} .students-table tbody tr td[colspan="6"]`).length && $(`#${containerId} .students-table tbody tr`).length > 1) {
            $(`#${containerId} .students-table tbody tr td[colspan="6"]`).closest('tr').remove();
        }
    }

    function generateStudentRowHtml(responsibleId, studentData, isEditMode = false) {
        const studentUniqueId = isEditMode && studentData.id && !studentData.id.toString().startsWith('new_') ? studentData.id : 'new_S' + studentCounter++;
        const responsiblePrefix = `responsibles[${responsibleId}][alunos][${studentUniqueId}]`;

        // Formata a data para o formato yyyy-mm-dd para o input hidden, se vier do banco pode estar diferente
        let formattedDataNascimento = studentData.data_nascimento || studentData.dt_nascimento;
        if (formattedDataNascimento && formattedDataNascimento.includes('/')) {
            const parts = formattedDataNascimento.split('/');
            formattedDataNascimento = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }


        return `
            <tr data-student-id="${studentUniqueId}">
                <td>${studentData.nome || 'N/A'}</td>
                <td>${formattedDataNascimento ? new Date(formattedDataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td>${studentData.serie_nome || studentData.serie?.nome || 'N/A'}</td>
                <td>${studentData.unidade_nome || studentData.escola?.nome || 'N/A'}</td>
                <td>
                    ${studentData.colegio_atual || 'N/A'}
                    <input type="hidden" name="${responsiblePrefix}[id]" value="${studentUniqueId}">
                    <input type="hidden" name="${responsiblePrefix}[nome]" value="${studentData.nome || ''}">
                    <input type="hidden" name="${responsiblePrefix}[data_nascimento]" value="${formattedDataNascimento || ''}">
                    <input type="hidden" name="${responsiblePrefix}[fk_serie]" value="${studentData.fk_serie || studentData.fk_series || ''}">
                    <input type="hidden" name="${responsiblePrefix}[fk_escola]" value="${studentData.fk_escola || studentData.fk_escolas || ''}">
                    <input type="hidden" name="${responsiblePrefix}[colegio_atual]" value="${studentData.colegio_atual || ''}">
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-info edit-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-student-raw='${JSON.stringify(studentData)}' data-responsible-id="${responsibleId}"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-sm btn-danger remove-student-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }


    function addOrUpdateStudentRow(responsibleId, studentData, isEditMode = false) {
        console.log("addOrUpdateStudentRow called for responsibleId:", responsibleId, "studentData:", studentData);

        const studentRowHtml = generateStudentRowHtml(responsibleId, studentData, isEditMode);
        const $studentsTableBody = $(`.responsible-card[data-responsible-id="${responsibleId}"] .students-table tbody`);

        if (!$studentsTableBody.length) {
            console.error("Tabela de alunos não encontrada para o responsável:", responsibleId);
            return;
        }

        // Remove a linha "Nenhum aluno adicionado" se existir
        const $placeholderRow = $studentsTableBody.find('td[colspan="6"]').closest('tr');
        if ($placeholderRow.length) {
            $placeholderRow.remove();
        }

        const studentUniqueIdToSearch = studentData.id && !studentData.id.toString().startsWith('new_') ? studentData.id : studentData.temp_id_for_edit;

        const existingRow = studentUniqueIdToSearch ? $studentsTableBody.find(`tr[data-student-id="${studentUniqueIdToSearch}"]`) : $();

        if (existingRow.length) {
            console.log("Atualizando linha do aluno:", studentUniqueIdToSearch);
            existingRow.replaceWith(studentRowHtml);
        } else {
            console.log("Adicionando nova linha do aluno.");
            $studentsTableBody.append(studentRowHtml);
        }
    }


    // Lida com o clique no botão "Adicionar Aluno"
    $(document).on('click', '.add-student-btn', function () {
        const responsibleId = $(this).data('responsible-id');
        console.log("Botão Adicionar Aluno clicado para responsibleId:", responsibleId);
        $('#responsibleForStudentId').val(responsibleId);
        $('#addStudentModalLabel').text('Adicionar Novo Aluno');
        $('#studentForm')[0].reset();
        $('#currentStudentId').val(''); // Garante que é um novo aluno
        $('#unidadeAluno').val('').trigger('change'); // Reseta unidade e dispara change para limpar série
        $('#serieAluno').html('<option value="">Selecione uma unidade antes</option>').prop('disabled', true);

        // Preencher unidades no modal do aluno - já está no HTML via Blade, não precisa recarregar
        // a menos que queira sempre a lista mais atualizada do servidor.
        // Se os @foreach($unidades) no modal já populam, essa chamada abaixo pode ser desnecessária
        // ou causar um "flash" no select.
        // $.getJSON("{{ route('cadastros.opcoes') }}", function (data) {
        //     preencherSelect('#unidadeAluno', data.unidades, 'id', 'nome', null, 'Selecione');
        // });
    });

    // Lida com o clique no botão "Editar Aluno"
    $(document).on('click', '.edit-student-btn', function () {
        let studentRawData = $(this).data('student-raw');
        if (typeof studentRawData === 'string') {
            try {
                studentRawData = JSON.parse(studentRawData);
            } catch (e) {
                console.error("Erro ao parsear student-raw JSON:", e, studentRawData);
                alert("Erro ao carregar dados do aluno para edição.");
                return;
            }
        }
        const studentData = studentRawData; // Agora é um objeto
        const responsibleId = $(this).data('responsible-id');
        const studentRowId = $(this).closest('tr').data('student-id');


        console.log("Editando aluno, Raw Data:", studentData, "Responsible ID:", responsibleId, "Student Row ID:", studentRowId);

        $('#responsibleForStudentId').val(responsibleId);
        // Usar o ID da linha da tabela se for um ID temporário (new_S), ou o ID do banco se existir
        $('#currentStudentId').val(studentRowId);
        $('#addStudentModalLabel').text('Editar Aluno');

        $('#nomeAluno').val(studentData.nome);
        // Ajustar data: o input date espera YYYY-MM-DD
        let dataNascimento = studentData.data_nascimento || studentData.dt_nascimento;
        if (dataNascimento && dataNascimento.includes('/')) {
            const parts = dataNascimento.split('/');
            dataNascimento = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        $('#dataNascimentoAluno').val(dataNascimento);

        const escolaId = studentData.fk_escola || studentData.fk_escolas || (studentData.escola ? studentData.escola.id : '');
        const serieId = studentData.fk_serie || studentData.fk_series || (studentData.serie ? studentData.serie.id : '');

        $('#unidadeAluno').val(escolaId).trigger('change'); // Dispara change para carregar séries

        // É preciso esperar o AJAX de carregar séries terminar antes de setar a série
        // Isso pode ser feito com uma promise ou um delay, ou encadeando
        if (escolaId) {
            const seriesUrl = `/series/escola/${escolaId}`; // Ajuste se necessário
            $.getJSON(seriesUrl, function (seriesData) {
                if (seriesData && seriesData.length) {
                    preencherSelect('#serieAluno', seriesData, 'id', 'nome', serieId, 'Selecione uma série');
                    $('#serieAluno').prop('disabled', false).val(serieId);
                } else {
                    $('#serieAluno').html('<option value="">Nenhuma série encontrada</option>').prop('disabled', true);
                }
            }).fail(function () {
                $('#serieAluno').html('<option value="">Erro ao carregar séries</option>').prop('disabled', true);
            });
        } else {
            $('#serieAluno').html('<option value="">Selecione uma unidade antes</option>').prop('disabled', true);
        }

        $('#colegioAtualAluno').val(studentData.colegio_atual);
    });


    // Lida com o clique no botão "Salvar Aluno" (#btnSaveStudent)
    $('#btnSaveStudent').on('click', function () {
        const responsibleId = $('#responsibleForStudentId').val();
        const studentIdInForm = $('#currentStudentId').val(); // Este será o ID da linha (data-student-id), que pode ser 'new_SX' ou um ID numérico
        const nomeAluno = $('#nomeAluno').val();
        const dataNascimentoAluno = $('#dataNascimentoAluno').val(); // Formato YYYY-MM-DD
        const unidadeId = $('#unidadeAluno').val();
        const serieId = $('#serieAluno').val();
        const colegioAtual = $('#colegioAtualAluno').val();

        if (!responsibleId) {
            alert('ID do responsável não encontrado. Não é possível salvar o aluno.');
            return;
        }
        if (!nomeAluno || !dataNascimentoAluno || !unidadeId || !serieId) {
            alert('Por favor, preencha todos os campos obrigatórios do aluno (Nome, Data de Nascimento, Unidade, Série).');
            return;
        }

        const unidadeNome = $('#unidadeAluno option:selected').text();
        const serieNome = $('#serieAluno option:selected').text();

        const studentData = {
            id: studentIdInForm, // Pode ser 'new_SX' ou um ID numérico para edição
            temp_id_for_edit: studentIdInForm, // Usado para encontrar a linha se for edição de um 'new_SX'
            nome: nomeAluno,
            data_nascimento: dataNascimentoAluno, // YYYY-MM-DD
            fk_escola: unidadeId,
            unidade_nome: unidadeNome,
            fk_serie: serieId,
            serie_nome: serieNome,
            colegio_atual: colegioAtual
        };
        console.log("Salvando aluno para responsibleId:", responsibleId, "Dados do aluno:", studentData);

        // Verifica se é uma edição de um aluno já existente (não 'new_') ou um novo
        const isEditingExistingDbRecord = studentIdInForm && !studentIdInForm.toString().startsWith('new_');
        addOrUpdateStudentRow(responsibleId, studentData, isEditingExistingDbRecord);

        $('#addStudentModal').modal('hide');
    });

    // Remover Aluno da lista no modal principal
    $(document).on('click', '.remove-student-btn', function () {
        if (confirm('Tem certeza que deseja remover este aluno da lista?')) {
            const $row = $(this).closest('tr');
            const $tbody = $row.closest('tbody');
            $row.remove();
            if ($tbody.find('tr').length === 0) {
                $tbody.html('<tr><td colspan="6" class="text-center">Nenhum aluno adicionado.</td></tr>');
            }
        }
    });

    // Modal para novo cadastro (#cadastroModal)
    $('#cadastroModal').on('show.bs.modal', function () {
        console.log("Modal Novo Cadastro está abrindo");
        $('#novoCadastroForm')[0].reset();
        $('#newResponsiblesContainer').html('');
        responsibleCounter = 0; // Reseta o contador de responsáveis
        studentCounter = 0; // Reseta o contador de alunos
        addResponsibleCard('newResponsiblesContainer', {}); // Adiciona o primeiro card de responsável
        // carregarOpcoesParaNovoCadastro(); // Se precisar carregar selects dinamicamente
    });

    // Botão "Adicionar Outro Responsável" no modal de novo cadastro
    $('#addNewResponsibleBtn').on('click', function () {
        addResponsibleCard('newResponsiblesContainer', {});
    });

    // Remover Responsável do modal de novo cadastro
    $(document).on('click', '.remove-responsible', function () {
        // Só permite remover se for um responsável novo (ID começando com 'new_')
        // ou se não estiver em modo de edição (a ser implementado para o form de edição)
        const responsibleCard = $(this).closest('.responsible-card');
        const responsibleId = responsibleCard.data('responsible-id');

        if (responsibleId && responsibleId.toString().startsWith('new_')) {
            if (confirm('Tem certeza que deseja remover este responsável e todos os seus alunos da lista?')) {
                responsibleCard.remove();
            }
        } else if (!responsibleId.toString().startsWith('new_') && $('#cadastroForm').length) { // Verifica se está no form de edição
            if (confirm('Tem certeza que deseja remover este responsável e todos os seus alunos? Esta ação não poderá ser desfeita até salvar o cadastro.')) {
                // Marcar para deleção ou apenas remover visualmente e tratar no backend.
                // Por simplicidade, vamos apenas remover visualmente e o backend lidará com os IDs não enviados.
                responsibleCard.remove();
            }
        } else {
            // Se for o primeiro responsável (new_0) no modal de novo cadastro, talvez não permitir remover
            // ou alertar que pelo menos um responsável é necessário.
            // Ou, se for um responsável já existente no form de edição (não implementado aqui ainda),
            // a lógica de remoção seria diferente (marcar para deleção).
            if (confirm('Tem certeza que deseja remover este responsável e todos os seus alunos da lista?')) {
                responsibleCard.remove();
            }
        }
    });


    // Submissão do formulário principal de NOVO CADASTRO e EDIÇÃO
    $(document).on('submit', 'form.ajax-form', function (e) {
        e.preventDefault();
        const $form = $(this);
        const formData = new FormData(this); // Usar FormData para arquivos, se houver

        // Coletar dados dos responsáveis e alunos de forma estruturada
        const responsiblesObject = {};
        $form.find('.responsible-card').each(function (indexR) {
            const $responsibleCard = $(this);
            const tempResponsibleId = $responsibleCard.data('responsible-id'); // ex: 'new_0' ou ID numérico

            const responsibleData = {
                id: tempResponsibleId, // ID original do card (pode ser 'new_X' ou ID do banco)
                nome: $responsibleCard.find(`input[name="responsibles[${tempResponsibleId}][nome]"]`).val(),
                email: $responsibleCard.find(`input[name="responsibles[${tempResponsibleId}][email]"]`).val(),
                celular: $responsibleCard.find(`input[name="responsibles[${tempResponsibleId}][celular]"]`).val(),
                alunos: [] // Mudar para array para ser mais fácil no backend
            };

            $responsibleCard.find('.students-table tbody tr').each(function (indexA) {
                const $studentRow = $(this);
                const tempStudentId = $studentRow.data('student-id'); // ex: 'new_S0' ou ID numérico

                if ($studentRow.find('td[colspan="6"]').length > 0) return; // Pula a linha "Nenhum aluno"

                const studentDetail = {
                    id: tempStudentId, // ID original da linha do aluno
                    nome: $studentRow.find(`input[name="responsibles[${tempResponsibleId}][alunos][${tempStudentId}][nome]"]`).val(),
                    data_nascimento: $studentRow.find(`input[name="responsibles[${tempResponsibleId}][alunos][${tempStudentId}][data_nascimento]"]`).val(),
                    fk_escola: $studentRow.find(`input[name="responsibles[${tempResponsibleId}][alunos][${tempStudentId}][fk_escola]"]`).val(),
                    fk_serie: $studentRow.find(`input[name="responsibles[${tempResponsibleId}][alunos][${tempStudentId}][fk_serie]"]`).val(),
                    colegio_atual: $studentRow.find(`input[name="responsibles[${tempResponsibleId}][alunos][${tempStudentId}][colegio_atual]"]`).val(),
                };
                responsibleData.alunos.push(studentDetail);
            });
            // Usar um índice numérico ou o ID temporário como chave
            responsiblesObject[tempResponsibleId] = responsibleData;
        });

        // Adicionar os dados dos responsáveis ao FormData
        // FormData não suporta objetos aninhados complexos diretamente de forma padrão em todas as libs de backend
        // Uma forma é serializar como JSON ou enviar campos individualmente com notação de array.
        // O Laravel lida bem com a notação de array: responsibles[0][nome], responsibles[0][alunos][0][nome]

        // Limpar FormData de campos 'responsibles' se existirem para evitar duplicação
        for (let key of formData.keys()) {
            if (key.startsWith('responsibles[')) {
                formData.delete(key);
            }
        }

        // Adicionar os dados estruturados dos responsáveis. O Laravel entenderá isso.
        Object.keys(responsiblesObject).forEach(respKey => {
            formData.append(`responsibles[${respKey}][id]`, responsiblesObject[respKey].id);
            formData.append(`responsibles[${respKey}][nome]`, responsiblesObject[respKey].nome);
            formData.append(`responsibles[${respKey}][email]`, responsiblesObject[respKey].email);
            formData.append(`responsibles[${respKey}][celular]`, responsiblesObject[respKey].celular);
            responsiblesObject[respKey].alunos.forEach((aluno, alunoIndex) => {
                const alunoKey = aluno.id; // Usar o ID do aluno (new_SX ou numérico) como chave
                formData.append(`responsibles[${respKey}][alunos][${alunoKey}][id]`, aluno.id);
                formData.append(`responsibles[${respKey}][alunos][${alunoKey}][nome]`, aluno.nome);
                formData.append(`responsibles[${respKey}][alunos][${alunoKey}][data_nascimento]`, aluno.data_nascimento);
                formData.append(`responsibles[${respKey}][alunos][${alunoKey}][fk_escola]`, aluno.fk_escola);
                formData.append(`responsibles[${respKey}][alunos][${alunoKey}][fk_serie]`, aluno.fk_serie);
                formData.append(`responsibles[${respKey}][alunos][${alunoKey}][colegio_atual]`, aluno.colegio_atual);
            });
        });


        // DEBUG: Logar o FormData (não é simples, precisa iterar)
        // console.log("Enviando dados do formulário principal:");
        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ': ' + pair[1]);
        // }

        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            data: formData,
            processData: false, // Necessário para FormData
            contentType: false, // Necessário para FormData
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') // Já presente no form @csrf
            },
            success: function (response) {
                if (response.success) {
                    alert(response.message || 'Operação realizada com sucesso!');
                    if (cadastrosTable) { // Se a tabela DataTables existir na página
                        cadastrosTable.ajax.reload();
                    }
                    const modalTarget = $form.closest('.modal').attr('id');
                    if (modalTarget) {
                        $('#' + modalTarget).modal('hide');
                    }
                    if ($form.attr('id') === 'novoCadastroForm' && response.redirect_url) {
                        window.location.href = response.redirect_url; // Para redirecionar após novo cadastro
                    } else if ($form.attr('id') === 'novoCadastroForm') {
                        window.location.href = "/cadastros"; // Fallback
                    }

                } else {
                    let errorMessage = response.error || response.message || 'Ocorreu um erro.';
                    if (response.errors) {
                        errorMessage += "\\n\\nDetalhes:\\n";
                        for (const field in response.errors) {
                            errorMessage += `- ${response.errors[field].join(', ')}\\n`;
                        }
                    }
                    alert(errorMessage);
                }
            },
            error: function (xhr) {
                let errorMessage = 'Erro ao realizar a operação.';
                if (xhr.responseJSON) {
                    if (xhr.responseJSON.message) {
                        errorMessage += `\\n${xhr.responseJSON.message}`;
                    }
                    if (xhr.responseJSON.errors) {
                        errorMessage += "\\n\\nDetalhes:\\n";
                        for (const field in xhr.responseJSON.errors) {
                            errorMessage += `- ${field}: ${xhr.responseJSON.errors[field].join(', ')}\\n`;
                        }
                    }
                } else {
                    errorMessage += `\\nStatus: ${xhr.status} - ${xhr.statusText}`;
                }
                alert(errorMessage);
                console.error("Erro AJAX:", xhr);
            }
        });
    });


    // Inicialização do DataTables (se estiver na página de listagem)
    if ($('#cadastros-table').length) {
        var cadastrosTable = $('#cadastros-table').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: cadastrosListarRoute, // Usando a variável JS definida no Blade
                data: function (d) {
                    d.unidade = $('#filterUnidade').val();
                    d.serie = $('#filterSerie').val();
                    d.situacao = $('#filterSituacao').val();
                    d.origem = $('#filterOrigem').val();
                    d.data_inicio = $('#filterDataInicio').val();
                    d.data_fim = $('#filterDataFim').val();
                }
            },
            columns: [
                { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
                { data: 'codigo', name: 'tb_cadastro.codigo' }, // Especificar tabela para desambiguação se necessário
                { data: 'responsavel_nome', name: 'tb_responsavel.nome' },
                { data: 'responsavel_email', name: 'tb_responsavel.email' },
                { data: 'responsavel_celular', name: 'tb_responsavel.celular' },
                { data: 'atendente_nome', name: 'users.name' },
                { data: 'origem_nome', name: 'tb_origens.nome' },
                { data: 'situacao_nome', name: 'tb_situacao.nome' },
                { data: 'data_cadastro', name: 'tb_cadastro.dt_insert' }, // Corresponde ao alias/coluna no backend
                { data: 'acoes', name: 'acoes', orderable: false, searchable: false }
            ],
            order: [[1, 'asc']],
            language: { url: '/js/pt-BR.json' }, // Certifique-se que este arquivo existe na pasta public/js
            // Configurações adicionais de responsividade e botões se necessário
        });

        // Listener para expandir/recolher detalhes
        $('#cadastros-table tbody').on('click', 'td.dt-control', function () {
            var tr = $(this).closest('tr');
            var row = cadastrosTable.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                const rowData = row.data();
                if (rowData && rowData.id) { // Certifique-se que 'id' do cadastro está presente em row.data()
                    const cadastroId = rowData.id;
                    // AJAX para buscar detalhes do cadastro
                    $.ajax({
                        url: `/cadastros/${cadastroId}/details`,
                        method: 'GET',
                        success: function (detailData) {
                            row.child(formatDetails(detailData)).show(); // Chama a função de formatação
                            tr.addClass('shown');
                        },
                        error: function (xhr) {
                            console.error('Erro ao carregar detalhes:', xhr);
                            row.child('Erro ao carregar detalhes. Verifique o console.').show();
                            tr.addClass('shown');
                        }
                    });
                } else {
                    row.child('ID do cadastro não encontrado para carregar detalhes.').show();
                    tr.addClass('shown');
                }
            }
        });
    }


    // Função para formatar os detalhes da linha (sub-tabela) - Renomeada para formatDetails
    function formatDetails(d) {
        let html = '<div class="card p-3 bg-light border-primary shadow-sm">'; // Estilização adicional

        if (d.alunos && d.alunos.length > 0) {
            html += `
                <h6 class="mb-2 text-primary"><i class="fas fa-user-graduate me-2"></i>Alunos Associados</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered table-striped mb-3">
                        <thead class="table-light">
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
                        <td>${aluno.nome || 'N/A'}</td>
                        <td>${aluno.data_nascimento ? new Date(aluno.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}</td>
                        <td>${aluno.serie_nome || 'N/A'}</td>
                        <td>${aluno.escola_nome || 'N/A'}</td>
                        <td>${aluno.colegio_atual || 'N/A'}</td>
                    </tr>
                `;
            });
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            html += '<p class="mb-2"><i class="fas fa-info-circle me-1"></i>Nenhum aluno associado a este responsável principal.</p>';
        }

        if (d.responsaveis && d.responsaveis.length > 0 && Array.isArray(d.responsaveis)) {
            html += `<hr class="my-3">`;
            html += `<h6 class="mb-2 text-primary"><i class="fas fa-users me-2"></i>Outros Responsáveis Associados ao Cadastro</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered table-striped">
                        <thead class="table-light">
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
                        <td>${responsavel.nome || 'N/A'}</td>
                        <td>${responsavel.email || 'N/A'}</td>
                        <td>${responsavel.celular || 'N/A'}</td>
                    </tr>
                `;
            });
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        } else if (d.responsaveis && Object.keys(d.responsaveis).length > 0 && !Array.isArray(d.responsaveis)) {
            // Se for um objeto, converter para array ou iterar sobre as chaves
            console.warn("Formato de 'responsaveis' é objeto, esperado array. Tentando converter.");
            const responsaveisArray = Object.values(d.responsaveis);
            if (responsaveisArray.length > 0) {
                html += `<hr class="my-3">`;
                html += `<h6 class="mb-2 text-primary"><i class="fas fa-users me-2"></i>Outros Responsáveis Associados ao Cadastro</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered table-striped">
                            <thead class="table-light">
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Celular</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                responsaveisArray.forEach(responsavel => {
                    html += `
                        <tr>
                            <td>${responsavel.nome || 'N/A'}</td>
                            <td>${responsavel.email || 'N/A'}</td>
                            <td>${responsavel.celular || 'N/A'}</td>
                        </tr>
                    `;
                });
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            }
        } else {
            // Nenhuma mensagem específica se não houver *outros* responsáveis, pois o principal já está na linha.
        }

        html += '</div>';
        return html;
    }


    // Botão Filtrar
    $('#btnFiltrar').on('click', function () {
        if (cadastrosTable) cadastrosTable.ajax.reload();
    });

    // Botão Limpar Filtros
    $('#filterForm').on('reset', function () {
        setTimeout(() => {
            $('#filterSerie').html('<option value="">Selecione uma unidade antes</option>').prop('disabled', true);
            if (cadastrosTable) cadastrosTable.ajax.reload();
        }, 100); // Pequeno delay para garantir que os campos resetem antes do reload
    });

    // Inicialização
    if ($('#cadastros-table').length) {
        carregarOpcoesParaFiltro();
        const rotaSeriesEscola = "{{ route('series.by.escola', ['escolaId' => ':escolaId']) }}";
        setupAtualizaSerie('filterUnidade', 'filterSerie', rotaSeriesEscola.replace(':escolaId', ''));
    }
    // Para o modal de aluno, as unidades são carregadas via Blade.
    // A rota /series/escola/:id é chamada diretamente.
    const rotaSeriesEscolaModal = "{{ route('series.by.escola', ['escolaId' => ':escolaId']) }}";
    setupAtualizaSerie('unidadeAluno', 'serieAluno', rotaSeriesEscolaModal.replace(':escolaId', ''));


    // Lida com o botão de exclusão (já existe no código fornecido)
    $(document).on('click', '.btn-delete', function () {
        const cadastroId = $(this).data('id');
        if (confirm('Tem certeza que deseja excluir este cadastro? Esta ação marcará o cadastro e seus relacionados como inativos.')) {
            $.ajax({
                url: `/cadastros/${cadastroId}`,
                type: 'POST',
                data: {
                    _method: 'DELETE',
                    _token: $('meta[name="csrf-token"]').attr('content') || $('input[name="_token"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        alert(response.message || 'Cadastro excluído com sucesso.');
                        if (cadastrosTable) cadastrosTable.ajax.reload();
                    } else {
                        alert('Erro ao excluir cadastro: ' + (response.error || response.message || 'Erro desconhecido.'));
                    }
                },
                error: function (xhr) {
                    alert('Erro de comunicação ao excluir o cadastro.');
                    console.error("Erro AJAX ao excluir:", xhr);
                }
            });
        }
    });

    // Máscara de telefone (já existe)
    $('.phone-mask').mask('(00) 00000-0000');
    $(document).on('focus', '.phone-mask', function () {
        if (!$(this).data('masked')) {
            $(this).mask('(00) 00000-0000');
            $(this).data('masked', true);
        }
    });


    // --- Lógica específica para o formulário de EDIÇÃO de Cadastro ---
    if ($('#cadastroForm[action*="/cadastros/"][action*="/edit"]').length || $('#cadastroForm[method="POST"]').attr('action').includes('update')) {
        // Este bloco é para a página de edição (ex: /cadastros/{id}/edit)
        console.log("Página de Edição de Cadastro detectada.");
        // carregarOpcoesParaEdicao(); // Se precisar carregar selects dinamicamente para o formulário de edição

        // Lógica para popular responsáveis e alunos existentes (já feito pelo Blade em edit.blade.php)
        // Mas garantir que os contadores sejam inicializados corretamente se houver IDs numéricos
        let maxResponsibleId = 0;
        $('#responsiblesContainer .responsible-card').each(function () {
            const id = $(this).data('responsible-id');
            if (typeof id === 'number' && id > maxResponsibleId) maxResponsibleId = id;
        });
        responsibleCounter = maxResponsibleId + 1; // Para novos responsáveis na edição

        let maxStudentId = 0;
        $('#responsiblesContainer .students-table tbody tr').each(function () {
            const id = $(this).data('student-id');
            if (typeof id === 'number' && id > maxStudentId) maxStudentId = id;
        });
        studentCounter = maxStudentId + 1; // Para novos alunos na edição

        // Botão para adicionar NOVO responsável no formulário de EDIÇÃO
        // O modal #addResponsavelModal é usado aqui
        $('#btnSaveResponsible').off('click').on('click', function () { // .off para evitar múltiplos binds
            const nome = $('#responsavelNome').val();
            const email = $('#responsavelEmail').val();
            const celular = $('#responsavelCelular').val();

            if (!nome) {
                alert('O nome do responsável é obrigatório.');
                return;
            }
            // Adiciona como um NOVO responsável, mesmo na edição
            addResponsibleCard('responsiblesContainer', { nome, email, celular }, false);
            $('#addResponsavelModal').modal('hide');
            $('#responsavelForm')[0].reset();
        });
    }

});