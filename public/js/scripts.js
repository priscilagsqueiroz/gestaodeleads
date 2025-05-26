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


        responsibleCounter++; // Garante que o contador seja incrementado
        const responsibleId = responsibleData.id || 'new_responsible_' + Date.now() + '_' + responsibleCounter;
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
                            <button type="button" class="btn btn-sm btn-success add-student-btn" data-responsible-id="${responsibleId}">
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

        // Prepara o modal de aluno
        $('#responsibleForStudentId').val(responsibleId);
        $('#addStudentModalLabel').text('Adicionar Novo Aluno');
        $('#studentForm')[0].reset();
        $('#currentStudentId').val('');
        $('#unidadeAluno').val('').trigger('change');
        $('#serieAluno').html('<option value="">Selecione uma unidade antes</option>').prop('disabled', true);

        // IMPORTANTE: Verifique se o modal principal ainda está com 'show' ANTES de abrir o novo.
        // Se ele perde 'show' aqui, o problema é ainda mais fundamental.
        // console.log("Antes de abrir #addStudentModal, #cadastroModal tem 'show'?", $('#cadastroModal').hasClass('show'));

        // Abre o modal de aluno programaticamente
        var addStudentModal = new bootstrap.Modal(document.getElementById('addStudentModal'));
        addStudentModal.show();

        // DEPOIS de chamar .show() no modal de aluno,
        // vamos garantir que o modal principal (#cadastroModal) não tenha perdido a classe 'show'
        // e que o body ainda esteja em 'modal-open'.
        // Isso é um pouco de "forçar a barra" com o Bootstrap.
        if ($('#cadastroModal').length && !$('#cadastroModal').hasClass('show')) {
            // Se o #cadastroModal perdeu 'show', algo está errado na interação.
            // Tentativa de reassegurar seu estado.
            // console.warn('#cadastroModal perdeu "show" ao abrir #addStudentModal. Tentando restaurar.');
            // $('#cadastroModal').addClass('show'); // Isso pode não ser suficiente sem o backdrop
        }

        // A principal preocupação é o estado do body.
        // O Bootstrap pode remover 'modal-open' ao abrir um segundo modal se não estiver
        // ciente que o primeiro deve permanecer.
        // Vamos garantir que o modal-open persista para o modal de baixo.
        // setTimeout é para dar um pequeno tempo para o Bootstrap processar a abertura do addStudentModal
        setTimeout(function () {
            if ($('#cadastroModal').hasClass('show')) { // Verifique se o modal principal DEVERIA estar visível
                $('body').addClass('modal-open');
                // Adicionar aria-hidden=false ao modal principal se o BS o escondeu
                $('#cadastroModal').attr('aria-hidden', 'false').css('display', 'block');
            }
        }, 0); // 0 ms de delay, apenas para enfileirar a execução após o processamento atual do Bootstrap

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
        const studentId = $('#currentStudentId').val(); // Pode ser '' para novo ou o ID para edição
        const nomeAluno = $('#nomeAluno').val();
        const dataNascimentoAluno = $('#dataNascimentoAluno').val();
        const unidadeId = $('#unidadeAluno').val();
        const serieId = $('#serieAluno').val();
        const colegioAtual = $('#colegioAtualAluno').val();

        if (!nomeAluno || !dataNascimentoAluno || !unidadeId || !serieId) {
            alert('Por favor, preencha todos os campos obrigatórios do aluno.');
            return;
        }

        const unidadeNome = $('#unidadeAluno option:selected').text();
        const serieNome = $('#serieAluno option:selected').text();

        const studentData = {
            // Usar um ID temporário mais robusto para novos alunos
            id: studentId || 'new_student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
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
        // A lógica para restaurar o modal principal será tratada no evento 'hidden.bs.modal'
    });

    // Quando o modal de aluno (#addStudentModal) for completamente escondido
    $('#addStudentModal').on('hidden.bs.modal', function () {
        console.log("Modal de aluno fechado.");
        // A classe 'show' no modal principal é o indicador mais importante
        if ($('#cadastroModal').hasClass('show')) {
            console.log("Modal de cadastro principal AINDA TEM a classe 'show'. Restaurando body e foco.");
            $('body').addClass('modal-open');
            $('#cadastroModal').attr('aria-hidden', 'false').css('display', 'block'); // Garanta que ele seja visualmente presente
            $('#cadastroModal').focus();
        } else {
            console.log("Modal de cadastro principal NÃO TEM MAIS a classe 'show' após fechar modal de aluno.");
            // Se isso acontecer, o problema é mais complexo do que apenas o fechamento.
            // Pode ser que a abertura do modal de aluno já esteja fechando o principal.
        }
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
    $(document).on('submit', '.ajax-form', function (e) {
        e.preventDefault();
        const $form = $(this);
        const responsiblesData = {};

        $form.find('.responsible-card').each(function () {
            const $responsibleCard = $(this);
            const responsibleId = $responsibleCard.data('responsible-id'); // ID original (pode ser numérico ou 'new_...')

            // Usar um identificador único do formulário para o backend, especialmente para novos.
            // O name do input já deve estar correto: responsibles[ID_TEMP_DO_CARD][propriedade]
            const responsibleFormKey = responsibleId;

            const responsibleName = $responsibleCard.find(`input[name="responsibles[${responsibleFormKey}][nome]"]`).val();
            const responsibleEmail = $responsibleCard.find(`input[name="responsibles[${responsibleFormKey}][email]"]`).val();
            const responsibleCelular = $responsibleCard.find(`input[name="responsibles[${responsibleFormKey}][celular]"]`).val();

            responsiblesData[responsibleFormKey] = {
                id: responsibleId, // Envia o ID original (seja numérico ou 'new_...')
                nome: responsibleName,
                email: responsibleEmail,
                celular: responsibleCelular,
                alunos: {}
            };

            $responsibleCard.find('.students-table tbody tr').each(function () {
                const $studentRow = $(this);
                const studentId = $studentRow.data('student-id'); // ID original do aluno
                const studentFormKey = studentId;

                const studentName = $studentRow.find(`input[name$="[${studentFormKey}][nome]"]`).val();
                const studentDataNascimento = $studentRow.find(`input[name$="[${studentFormKey}][data_nascimento]"]`).val();
                const studentFkSerie = $studentRow.find(`input[name$="[${studentFormKey}][fk_serie]"]`).val();
                const studentFkEscola = $studentRow.find(`input[name$="[${studentFormKey}][fk_escola]"]`).val();
                const studentColegioAtual = $studentRow.find(`input[name$="[${studentFormKey}][colegio_atual]"]`).val();

                responsiblesData[responsibleFormKey].alunos[studentFormKey] = {
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
            _token: $form.find('input[name="_token"]').val(), // Garante o token CSRF
            _method: $form.find('input[name="_method"]').val() || $form.attr('method'), // Para PUT/PATCH
            fk_atendente: $form.find('[name="fk_atendente"]').val(),
            fk_origens: $form.find('[name="fk_origens"]').val(),
            fk_situacao: $form.find('[name="fk_situacao"]').val(),
            observacoes: $form.find('[name="observacoes"]').val(),
            responsibles: Object.values(responsiblesData) // Envia como um array de responsáveis
        };


        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            data: mainCadastroData,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    // Tenta usar a variável global para a rota, se definida
                    if (typeof cadastrosIndexRoute !== 'undefined') {
                        window.location.href = cadastrosIndexRoute;
                    } else {
                        // Fallback para uma URL hardcoded, caso a variável não esteja definida
                        window.location.href = '/cadastros'; // Ajuste se sua rota base for diferente
                    }
                } else {
                    alert('Erro ao salvar o cadastro: ' + (response.error || 'Erro desconhecido.'));
                }
            },
            error: function (xhr) {
                let errorMessage = 'Erro ao salvar o cadastro.';
                if (xhr.responseJSON) {
                    if (xhr.responseJSON.message) {
                        errorMessage += '\n' + xhr.responseJSON.message;
                    }
                    if (xhr.responseJSON.errors) {
                        for (const key in xhr.responseJSON.errors) {
                            errorMessage += `\n- ${xhr.responseJSON.errors[key].join(', ')}`;
                        }
                    }
                }
                alert(errorMessage);
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
        setupAtualizaSerie('filterUnidade', 'filterSerie');
    }
    // Para o modal de aluno, as unidades são carregadas via Blade.
    // A rota /series/escola/:id é chamada diretamente.
    setupAtualizaSerie('unidadeAluno', 'serieAluno');


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
    // --- Lógica específica para o formulário de EDIÇÃO de Cadastro ---
    var $editForm = $('#cadastroForm'); // Procura pelo formulário com ID 'cadastroForm'

    // Verifica se o formulário de edição #cadastroForm existe E se ele contém um input _method com valor PUT
    if ($editForm.length && $editForm.find('input[name="_method"][value="PUT"]').length) {
        console.log("Página de Edição de Cadastro detectada (ID: cadastroForm, Method: PUT).");
        // carregarOpcoesParaEdicao(); // Se precisar carregar selects dinamicamente para o formulário de edição

        // Lógica para popular responsáveis e alunos existentes (já feito pelo Blade em edit.blade.php)
        // Mas garantir que os contadores sejam inicializados corretamente se houver IDs numéricos
        let maxResponsibleId = 0;
        $('#responsiblesContainer .responsible-card').each(function () {
            const id = $(this).data('responsible-id');
            if (typeof id === 'number' && id > maxResponsibleId) maxResponsibleId = id;
        });
        // Se não houver responsáveis existentes, o contador começa de 0, senão do próximo número.
        // O ++ é feito em addResponsibleCard, então aqui garantimos a base.
        responsibleCounter = maxResponsibleId > 0 ? maxResponsibleId : 0;


        let maxStudentId = 0;
        $('#responsiblesContainer .students-table tbody tr').each(function () {
            const id = $(this).data('student-id');
            if (typeof id === 'number' && id > maxStudentId) maxStudentId = id;
        });
        studentCounter = maxStudentId > 0 ? maxStudentId : 0; // Contador para novos alunos na edição

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
            // O terceiro parâmetro 'true' indica que estamos no modo de edição para addResponsibleCard
            addResponsibleCard('responsiblesContainer', { nome, email, celular }, true);
            $('#addResponsavelModal').modal('hide');
            $('#responsavelForm')[0].reset();
        });
    }
});