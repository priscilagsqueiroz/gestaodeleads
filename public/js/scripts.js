/**
 * Preenche um select dropdown com os dados fornecidos.
 * @param {string} idElementoSelect - O ID do elemento select (ex: '#meuSelect').
 * @param {Array} dados - O array de objetos para popular o select.
 * @param {string} campoValor - O nome da propriedade a ser usada para o valor da option.
 * @param {string} campoTexto - O nome da propriedade a ser usada para o texto da option.
 * @param {string|number|null} [valorSelecionado=null] - O valor a ser pré-selecionado.
 * @param {string} [placeholder="Selecione"] - O texto do placeholder para a option padrão.
 */
function preencherSelect(idElementoSelect, dados, campoValor, campoTexto, valorSelecionado = null, placeholder = "Selecione") {
    const $select = $(idElementoSelect);
    $select.html(`<option value="">${placeholder}</option>`);
    if (dados && Array.isArray(dados)) {
        $.each(dados, function (chave, item) {
            const selecionado = (valorSelecionado !== null && String(item[campoValor]) === String(valorSelecionado)) ? 'selected' : '';
            $select.append(`<option value="${item[campoValor]}" ${selecionado}>${item[campoTexto]}</option>`);
        });
    }
}

/**
 * Gera o HTML para uma linha de aluno na tabela de alunos.
 * @param {string|number} idResponsavel - O ID do responsável.
 * @param {object} dadosAluno - Os dados do aluno.
 * @returns {string} String HTML para a linha da tabela.
 */
function gerarHtmlLinhaAluno(idResponsavel, dadosAluno) {
    // dadosAluno.id é o ID definitivo (do BD ou temporário do cliente como 'new_Sxxx')
    const idUnicoAluno = dadosAluno.id;
    const prefixoResponsavel = `responsibles[${idResponsavel}][alunos][${idUnicoAluno}]`;

    let dataNascimentoFormatada = dadosAluno.data_nascimento || dadosAluno.dt_nascimento;
    if (dataNascimentoFormatada && typeof dataNascimentoFormatada === 'string') {
        if (dataNascimentoFormatada.includes('/')) { // DD/MM/YYYY para YYYY-MM-DD
            const partes = dataNascimentoFormatada.split('/');
            if (partes.length === 3) {
                dataNascimentoFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
            } else {
                dataNascimentoFormatada = ''; // Formato inválido
            }
        } else if (!dataNascimentoFormatada.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Se não for YYYY-MM-DD, tenta converter
            try {
                const objetoData = new Date(dataNascimentoFormatada);
                if (!isNaN(objetoData.getTime())) {
                    dataNascimentoFormatada = objetoData.toISOString().split('T')[0];
                } else {
                    dataNascimentoFormatada = '';
                }
            } catch (e) {
                dataNascimentoFormatada = '';
            }
        }
    } else if (dataNascimentoFormatada instanceof Date && !isNaN(dataNascimentoFormatada.getTime())) {
        dataNascimentoFormatada = dataNascimentoFormatada.toISOString().split('T')[0];
    } else {
        dataNascimentoFormatada = '';
    }

    const exibirDataNascimento = dataNascimentoFormatada ? new Date(dataNascimentoFormatada + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A';

    return `
    <tr data-student-id="${idUnicoAluno}">
        <td>${dadosAluno.nome || 'N/A'}</td>
        <td>${exibirDataNascimento}</td>
        <td>${dadosAluno.serie_nome || dadosAluno.serie?.nome || 'N/A'}</td>
        <td>${dadosAluno.unidade_nome || dadosAluno.escola?.nome || 'N/A'}</td>
        <td>
            ${dadosAluno.colegio_atual || 'N/A'}
            <input type="hidden" name="${prefixoResponsavel}[id]" value="${idUnicoAluno}">
            <input type="hidden" name="${prefixoResponsavel}[nome]" value="${dadosAluno.nome || ''}">
            <input type="hidden" name="${prefixoResponsavel}[data_nascimento]" value="${dataNascimentoFormatada || ''}">
            <input type="hidden" name="${prefixoResponsavel}[fk_serie]" value="${dadosAluno.fk_serie || dadosAluno.fk_series || ''}">
            <input type="hidden" name="${prefixoResponsavel}[fk_escola]" value="${dadosAluno.fk_escola || dadosAluno.fk_escolas || ''}">
            <input type="hidden" name="${prefixoResponsavel}[colegio_atual]" value="${dadosAluno.colegio_atual || ''}">
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-info edit-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-student-raw='${JSON.stringify(dadosAluno).replace(/'/g, '&apos;')}' data-responsible-id="${idResponsavel}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-sm btn-danger remove-student-btn"><i class="fas fa-trash"></i></button>
        </td>
    </tr>`;
}

/**
 * Formata os dados da observação em um item de lista HTML.
 * @param {object} observacao - O objeto da observação.
 * @returns {string} String HTML para o item da lista.
 */
function formatarObservacaoParaLista(observacao) {
    let htmlBotaoEditar = '';
    const MAX_MINUTOS_EDICAO = 10; // Constante para tempo máximo de edição

    // Garante que obs_id e data_insercao_raw estejam presentes para checar editabilidade
    if (observacao.obs_id && observacao.data_insercao_raw) {
        const agora = new Date();
        const dataObservacaoObj = new Date(observacao.data_insercao_raw);
        const diferencaMilissegundos = agora - dataObservacaoObj;
        const diferencaMinutos = diferencaMilissegundos / (1000 * 60);

        if (diferencaMinutos < MAX_MINUTOS_EDICAO) {
            htmlBotaoEditar = `
        <button class="btn btn-sm btn-outline-secondary py-0 px-1 ms-2 btn-editar-observacao"
                data-obs-id="${observacao.obs_id}"
                data-obs-texto="${observacao.texto_original || observacao.texto}"
                title="Editar esta observação (criada há menos de ${MAX_MINUTOS_EDICAO} min)">
            <i class="fas fa-pencil-alt fa-xs"></i>
        </button>`;
        }
    }

    return `
<li class="list-group-item" data-obs-id-li="${observacao.obs_id || ''}">
    <div class="d-flex justify-content-between align-items-start">
        <p class="mb-1 observacao-texto">${observacao.texto}</p> ${htmlBotaoEditar}
    </div>
    <small class="text-muted">
        Por: ${observacao.usuario_nome || 'N/A'} em ${observacao.data_insercao || 'N/A'}
    </small>
</li>`;
}

/**
 * Formata os detalhes para uma linha filha (child row) do DataTables.
 * @param {object} dadosDetalhes - Dados para a seção de detalhes.
 * @returns {string} String HTML para a seção de detalhes.
 */
function formatarDetalhesLinha(dadosDetalhes) {
    let html = '<div class="card p-3 bg-light border-primary shadow-sm">';

    // Alunos Associados
    if (dadosDetalhes.alunos && dadosDetalhes.alunos.length > 0) {
        html += `
        <h6 class="mb-2 text-primary"><i class="fas fa-user-graduate me-2"></i>Alunos Associados</h6>
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-striped mb-3">
                <thead class="table-light">
                    <tr><th>Nome</th><th>Data de Nascimento</th><th>Série</th><th>Escola</th><th>Colégio Atual</th></tr>
                </thead>
                <tbody>`;
        dadosDetalhes.alunos.forEach(aluno => {
            const dataNascFormatada = aluno.data_nascimento ? new Date(aluno.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A';
            html += `
            <tr>
                <td>${aluno.nome || 'N/A'}</td>
                <td>${dataNascFormatada}</td>
                <td>${aluno.serie_nome || 'N/A'}</td>
                <td>${aluno.escola_nome || 'N/A'}</td>
                <td>${aluno.colegio_atual || 'N/A'}</td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
    } else {
        html += '<p class="mb-2"><i class="fas fa-info-circle me-1"></i>Nenhum aluno associado a este responsável principal.</p>';
    }

    // Outros Responsáveis
    const arrayResponsaveis = Array.isArray(dadosDetalhes.responsaveis) ? dadosDetalhes.responsaveis : (dadosDetalhes.responsaveis ? Object.values(dadosDetalhes.responsaveis) : []);
    if (arrayResponsaveis.length > 0) {
        html += `<hr class="my-3"><h6 class="mb-2 text-primary"><i class="fas fa-users me-2"></i>Outros Responsáveis Associados ao Cadastro</h6>
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-striped">
                <thead class="table-light">
                    <tr><th>Nome</th><th>E-mail</th><th>Celular</th></tr>
                </thead>
                <tbody>`;
        arrayResponsaveis.forEach(responsavel => {
            html += `
            <tr>
                <td>${responsavel.nome || 'N/A'}</td>
                <td>${responsavel.email || 'N/A'}</td>
                <td>${responsavel.celular || 'N/A'}</td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
    }
    html += '</div>';
    return html;
}


$(document).ready(function () {
    // Seletores cacheados (melhora performance)
    const $barraLateral = $('.sidebar');
    const $conteudoPrincipal = $('.main-content');
    const $botaoRecolherBarraLateral = $('#sidebarCollapse');
    const $botaoAlternarBarraLateral = $('#sidebarToggle');

    const $canvasGraficoVendas = $('#salesChart');
    const $canvasGraficoTrafego = $('#trafficChart');

    const $filtroUnidade = $('#filterUnidade');
    const $filtroSituacao = $('#filterSituacao');
    const $filtroOrigem = $('#filterOrigem');
    const $filtroSerie = $('#filterSerie');
    const $filtroDataInicio = $('#filterDataInicio');
    const $filtroDataFim = $('#filterDataFim');
    const $formularioFiltro = $('#filterForm');
    const $botaoFiltrar = $('#btnFiltrar');

    const $modalCadastro = $('#cadastroModal');
    // ATUALIZADO: ID do formulário de NOVO cadastro
    const $formularioNovoCadastro = $('#cadastroFormNovo');
    const $containerNovosResponsaveis = $('#newResponsiblesContainer');
    const $botaoAdicionarNovoResponsavel = $('#addNewResponsibleBtn');

    const $modalAdicionarAluno = $('#addStudentModal');
    const $labelModalAdicionarAluno = $('#addStudentModalLabel');
    const $formularioAluno = $('#studentForm');
    const $idResponsavelParaAluno = $('#responsibleForStudentId');
    const $idAlunoAtual = $('#currentStudentId'); // Input hidden com ID do aluno para edição
    const $nomeAluno = $('#nomeAluno');
    const $dataNascimentoAluno = $('#dataNascimentoAluno');
    const $unidadeAluno = $('#unidadeAluno'); // Select da unidade do aluno no modal
    const $serieAluno = $('#serieAluno');     // Select da série do aluno no modal
    const $colegioAtualAluno = $('#colegioAtualAluno');
    const $botaoSalvarAluno = $('#btnSaveStudent');

    const $modalObservacoes = $('#observacoesModal');
    const $labelModalObservacoes = $('#observacoesModalLabel');
    const $conteudoObservacoes = $('#observacoesConteudo');
    const $idCadastroObservacao = $('#observacaoCadastroId');
    const $textoNovaObservacao = $('#novaObservacaoTexto');
    const $idObservacaoEmEdicao = $('#editingObservacaoId');
    const $botaoSalvarNovaObservacao = $('#btnSalvarNovaObservacao');

    const $elementoTabelaCadastros = $('#cadastros-table');
    const $elementoTabelaAtendentes = $('#atendentesTable');

    // ATUALIZADO: IDs dos formulários de atendente
    const $modalNovoAtendente = $('#atendenteModal');
    const $formularioNovoAtendente = $('#atendenteFormNovo');
    const $modalEditarAtendente = $('#atendenteFormEdit');
    const $formularioEditarAtendente = $('#editAtendenteForm');


    // Contadores para gerar IDs temporários no lado do cliente
    let contadorResponsaveis = 0;
    let contadorAlunos = 0; // Usado para o prefixo 'new_S...'

    // --- Funções Auxiliares ---
    /**
     * Reinicia um elemento select para uma mensagem de placeholder padrão.
     * @param {jQuery} $elementoSelect - O objeto jQuery do elemento select.
     * @param {string} mensagem - A mensagem para a option de placeholder.
     */
    function reiniciarSelectSerie($elementoSelect, mensagem = 'Selecione uma unidade antes') {
        $elementoSelect.html(`<option value="">${mensagem}</option>`).prop('disabled', true);
    }

    /**
     * Carrega opções de séries para uma unidade escolar (unidade) via AJAX.
     * @param {jQuery} $elementoSelectSerie - O objeto jQuery do elemento select de séries.
     * @param {string|number} idUnidade - O ID da unidade escolar.
     * @param {string|number|null} [idSerieSelecionada=null] - O ID da série a ser pré-selecionada.
     * @param {string} [urlBase='/series/escola/'] - A URL base para buscar os dados das séries.
     */
    function carregarSeriesParaUnidade($elementoSelectSerie, idUnidade, idSerieSelecionada = null, urlBase = '/series/escola/') {
        const idSelectSerieAtual = $elementoSelectSerie.attr('id');
        if (!idSelectSerieAtual) {
            console.error("Elemento select de séries requer um ID.");
            return;
        }

        if (!idUnidade) {
            reiniciarSelectSerie($elementoSelectSerie, 'Selecione uma unidade antes');
            return;
        }

        $elementoSelectSerie.html('<option value="">Carregando...</option>').prop('disabled', true);
        const urlSeriesCompleta = urlBase.endsWith('/') ? `${urlBase}${idUnidade}` : `${urlBase}/${idUnidade}`;

        $.getJSON(urlSeriesCompleta)
            .done(function (dados) {
                if (dados && dados.length > 0) {
                    preencherSelect('#' + idSelectSerieAtual, dados, 'id', 'nome', idSerieSelecionada, 'Selecione uma série');
                    $elementoSelectSerie.prop('disabled', false);
                    if (idSerieSelecionada) { // Garante que o valor seja definido corretamente após popular
                        $elementoSelectSerie.val(idSerieSelecionada);
                    }
                } else {
                    reiniciarSelectSerie($elementoSelectSerie, 'Nenhuma série encontrada');
                }
            })
            .fail(function (jqXHR, statusTexto, erroLancado) {
                console.error("Erro ao carregar séries:", statusTexto, erroLancado, jqXHR.responseText);
                reiniciarSelectSerie($elementoSelectSerie, 'Erro ao carregar séries');
            });
    }

    // --- Barra Lateral (Sidebar) ---
    const alternarBarraLateral = () => {
        $barraLateral.toggleClass('active');
        $conteudoPrincipal.toggleClass('active');
    };
    $botaoRecolherBarraLateral.on('click', function () {
        alternarBarraLateral();
        $(this).toggleClass('active'); // Alterna classe 'active' no próprio botão
    });
    $botaoAlternarBarraLateral.on('click', alternarBarraLateral);

    // --- Gráficos ---
    if ($canvasGraficoVendas.length) {
        const contextoGraficoVendas = $canvasGraficoVendas.get(0).getContext('2d');
        new Chart(contextoGraficoVendas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Vendas',
                    data: [12, 19, 3, 5, 2, 3, 20, 33, 23, 12, 33, 55],
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderColor: '#FFC107',
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    if ($canvasGraficoTrafego.length) {
        const contextoGraficoTrafego = $canvasGraficoTrafego.get(0).getContext('2d');
        new Chart(contextoGraficoTrafego, {
            type: 'doughnut',
            data: {
                labels: ['Direto', 'Referência', 'Social'],
                datasets: [{ data: [300, 50, 100], backgroundColor: ['#FFC107', '#28A745', '#17A2B8'], hoverOffset: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // --- Preenchimento Dinâmico de Selects ---
    function carregarOpcoesParaFiltro() {
        // Verifica se a rota 'cadastros.opcoes' está definida (pode não estar em todas as páginas)
        if (typeof cadastrosOpcoesRoute !== 'undefined') {
            $.getJSON(cadastrosOpcoesRoute, function (dados) { // Rota para buscar opções de filtros
                preencherSelect('#filterUnidade', dados.unidades, 'id', 'nome', null, 'Todas as Unidades');
                preencherSelect('#filterSituacao', dados.situacoes, 'id', 'nome', null, 'Todas as Situações');
                preencherSelect('#filterOrigem', dados.origens, 'id', 'nome', null, 'Todas as Origens');
                reiniciarSelectSerie($filtroSerie, 'Selecione uma unidade');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error("Erro ao carregar opções de filtro para cadastros:", textStatus, errorThrown, jqXHR.responseText);
            });
        } else {
            // console.warn("A variável 'cadastrosOpcoesRoute' não está definida. Os filtros de cadastro podem não ser populados.");
        }
    }


    function configurarAtualizacaoSerie(idSelectUnidade, idSelectSerie, urlBase = '/series/escola/') {
        // Assume que #filterUnidade e #unidadeAluno são estáticos ao carregar a página.
        $('#' + idSelectUnidade).on('change', function () {
            const idUnidadeSelecionada = $(this).val();
            const $selectSerieAlvo = $('#' + idSelectSerie);
            carregarSeriesParaUnidade($selectSerieAlvo, idUnidadeSelecionada, null, urlBase);
        });
    }


    // --- Gerenciamento Dinâmico de Responsáveis e Alunos ---

    /**
     * Adiciona um novo cartão de responsável ao container especificado.
     * @param {string} idContainerCartoes - O ID do container para adicionar o cartão.
     * @param {object} [dadosResponsavelExistente={}] - Dados de um responsável existente (opcional).
     * @param {boolean} [ehContextoFormularioEdicao=false] - True se for para o contexto do formulário principal de edição.
     */
    function adicionarCartaoResponsavel(idContainerCartoes, dadosResponsavelExistente = {}, ehContextoFormularioEdicao = false) {
        contadorResponsaveis++; // Incrementa para IDs únicos
        const sufixoIdTempResponsavel = Date.now() + '_' + contadorResponsaveis;
        // Usa ID fornecido se existir (do BD), senão gera um ID temporário do cliente.
        const idFinalResponsavel = dadosResponsavelExistente.id || `new_responsible_${sufixoIdTempResponsavel}`;
        const nomeDoResponsavel = dadosResponsavelExistente.nome || '';
        const emailDoResponsavel = dadosResponsavelExistente.email || '';
        const celularDoResponsavel = dadosResponsavelExistente.celular || '';

        // Determina se o botão de remover deve ser exibido.
        // No formulário de EDIÇÃO de cadastro, o primeiro responsável (se já existir no BD) não deve ser removível por aqui.
        // Apenas responsáveis adicionados dinamicamente (new_responsible_...) ou em formulário de NOVO cadastro.
        let exibirBotaoRemover = true;
        if (ehContextoFormularioEdicao) {
            // Verifica se é o primeiro cartão e se o ID não é 'new_'
            const $container = $('#' + idContainerCartoes);
            const $primeiroCartao = $container.find('.responsible-card:first');
            if ($primeiroCartao.length && $primeiroCartao.data('responsible-id') === idFinalResponsavel && !String(idFinalResponsavel).startsWith('new_')) {
                // Não exibir botão de remover para o primeiro responsável já existente no form de edição.
                // A remoção dele implicaria em remover o cadastro principal, o que não é o objetivo aqui.
                // exibirBotaoRemover = false; // DESCOMENTE SE QUISER ESSA LÓGICA MAIS RESTRITA
            }
        }


        const htmlNovoCartaoResponsavel = `
        <div class="card mb-4 responsible-card" data-responsible-id="${idFinalResponsavel}">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="fas fa-user-tie me-2"></i>Informações do Responsável</span>
                <div>
                    ${exibirBotaoRemover ? `<button type="button" class="btn btn-sm btn-danger remove-responsible"><i class="fas fa-trash me-1"></i>Remover Responsável</button>` : ''}
                </div>
            </div>
            <div class="card-body">
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <label class="form-label">Nome do Responsável*</label>
                        <input type="text" class="form-control" name="responsibles[${idFinalResponsavel}][nome]" value="${nomeDoResponsavel}" required>
                        <input type="hidden" name="responsibles[${idFinalResponsavel}][id]" value="${idFinalResponsavel}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">E-mail do Responsável</label>
                        <input type="email" class="form-control" name="responsibles[${idFinalResponsavel}][email]" value="${emailDoResponsavel}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Celular do Responsável</label>
                        <input type="text" class="form-control phone-mask" name="responsibles[${idFinalResponsavel}][celular]" value="${celularDoResponsavel}">
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-user-graduate me-2"></i>Alunos Relacionados</span>
                        <button type="button" class="btn btn-sm btn-success add-student-btn" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-responsible-id="${idFinalResponsavel}">
                            <i class="fas fa-plus-circle me-1"></i>Adicionar Aluno
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped students-table">
                                <thead>
                                    <tr><th>Nome</th><th>Data de Nascimento</th><th>Série</th><th>Escola</th><th>Colégio Atual</th><th>Ações</th></tr>
                                </thead>
                                <tbody>
                                    ${(dadosResponsavelExistente.alunos && dadosResponsavelExistente.alunos.length > 0) ? // ATUALIZADO: Checa se é form de edição ou novo
                dadosResponsavelExistente.alunos.map(aluno => gerarHtmlLinhaAluno(idFinalResponsavel, aluno)).join('') :
                '<tr><td colspan="6" class="text-center">Nenhum aluno adicionado.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        $('#' + idContainerCartoes).append(htmlNovoCartaoResponsavel);
        // Aplica máscara aos inputs de telefone recém-adicionados
        $('.phone-mask:not([data-masked])').each(function () {
            $(this).mask('(00) 00000-0000').data('masked', true);
        });

        // Limpa placeholder se alunos foram adicionados a partir de dadosResponsavelExistente
        const $corpoTabAlunos = $(`#${idContainerCartoes} .responsible-card[data-responsible-id="${idFinalResponsavel}"] .students-table tbody`);
        if ($corpoTabAlunos.find('tr').length > 1 && $corpoTabAlunos.find('td[colspan="6"]').length) {
            $corpoTabAlunos.find('td[colspan="6"]').closest('tr').remove();
        } else if ($corpoTabAlunos.find('tr').length === 1 && !$corpoTabAlunos.find('td[colspan="6"]').length && dadosResponsavelExistente.alunos && dadosResponsavelExistente.alunos.length > 0) {
            // Caso especial: apenas 1 aluno foi adicionado e não havia placeholder
        } else if ($corpoTabAlunos.find('tr').length === 0) { // Se ficou vazio após remoção
            $corpoTabAlunos.html('<tr><td colspan="6" class="text-center">Nenhum aluno adicionado.</td></tr>');
        }
    }


    /**
     * Adiciona ou atualiza uma linha de aluno na tabela de alunos do respectivo responsável.
     * @param {string|number} idDoResponsavel - O ID do responsável.
     * @param {object} dadosDoAluno - Os dados do aluno, incluindo dadosDoAluno.id.
     */
    function adicionarOuAtualizarLinhaAluno(idDoResponsavel, dadosDoAluno) {
        const htmlDaLinhaAluno = gerarHtmlLinhaAluno(idDoResponsavel, dadosDoAluno);
        const $corpoTabelaAlunosAtual = $(`.responsible-card[data-responsible-id="${idDoResponsavel}"] .students-table tbody`);

        if (!$corpoTabelaAlunosAtual.length) {
            console.error("Tabela de alunos não encontrada para o responsável:", idDoResponsavel);
            return;
        }

        const $linhaDePlaceholder = $corpoTabelaAlunosAtual.find('td[colspan="6"]').closest('tr');
        const $linhaJaExistente = $corpoTabelaAlunosAtual.find(`tr[data-student-id="${dadosDoAluno.id}"]`);

        if ($linhaJaExistente.length) {
            $linhaJaExistente.replaceWith(htmlDaLinhaAluno);
        } else {
            if ($linhaDePlaceholder.length) {
                $linhaDePlaceholder.remove();
            }
            $corpoTabelaAlunosAtual.append(htmlDaLinhaAluno);
        }
    }

    // Evento: Clique no botão "Adicionar Aluno" (abre modal de aluno)
    $(document).on('click', '.add-student-btn', function () {
        const idDoResponsavelClicado = $(this).data('responsible-id');
        $idResponsavelParaAluno.val(idDoResponsavelClicado);
        $labelModalAdicionarAluno.text('Adicionar Novo Aluno');
        $formularioAluno[0].reset();
        $idAlunoAtual.val(''); // Limpa ID do aluno para nova entrada
        $unidadeAluno.val('').trigger('change'); // Reseta e dispara change para séries
        reiniciarSelectSerie($serieAluno, 'Selecione uma unidade antes');

        const elModalPai = $(this).closest('.modal.fade.show'); // Encontra o modal pai visível, se houver

        const instanciaModalAlunoAtual = new bootstrap.Modal($modalAdicionarAluno[0]);
        instanciaModalAlunoAtual.show();

        // Após exibir o modal do aluno, reafirma o estado do modal pai, se existir e dever estar visível.
        if (elModalPai.length) {
            setTimeout(function () {
                $('body').addClass('modal-open'); // Garante que o body mantenha a classe para scroll lock
                // Não precisa mexer nos atributos do modal pai, o Bootstrap deve lidar com isso.
            }, 150); // Pequeno delay para Bootstrap
        }
    });

    // Evento: Clique no botão "Editar Aluno" (preenche e abre modal de aluno)
    $(document).on('click', '.edit-student-btn', function () {
        let dadosBrutosDoAlunoString = $(this).data('student-raw');
        let dadosParseadosDoAluno;

        if (typeof dadosBrutosDoAlunoString === 'string') {
            try {
                // 1. Criar um elemento temporário para decodificar as entidades HTML
                const textarea = document.createElement('textarea');
                textarea.innerHTML = dadosBrutosDoAlunoString;
                const decodedString = textarea.value; // Ou textarea.textContent

                // 2. Agora parsear a string decodificada
                dadosParseadosDoAluno = JSON.parse(decodedString);

            } catch (e) {
                // Loga a string original (com entidades) se o parse falhar
                console.error("Erro ao parsear JSON student-raw. String original:", dadosBrutosDoAlunoString, "Erro:", e);
                alert("Erro ao carregar dados do aluno para edição. Verifique o console.");
                return;
            }
        } else if (typeof dadosBrutosDoAlunoString === 'object') {
            // Se o jQuery já parseou para objeto (menos provável com entidades HTML)
            dadosParseadosDoAluno = dadosBrutosDoAlunoString;
        } else {
            alert("Formato inesperado para os dados do aluno.");
            console.error("Formato inesperado para student-raw:", dadosBrutosDoAlunoString);
            return;
        }

        const dadosFinaisAluno = dadosParseadosDoAluno; // dadosFinaisAluno agora é o objeto JavaScript correto
        const idDoResponsavelPai = $(this).data('responsible-id');
        const idLinhaAlunoAtual = $(this).closest('tr').data('student-id'); // Este é o ID a ser editado

        $idResponsavelParaAluno.val(idDoResponsavelPai);
        $idAlunoAtual.val(idLinhaAlunoAtual); // Define o ID do aluno sendo editado
        $labelModalAdicionarAluno.text('Editar Aluno');
        $formularioAluno[0].reset(); // Reseta formulário antes de popular

        $nomeAluno.val(dadosFinaisAluno.nome);

        let dataNascAluno = dadosFinaisAluno.data_nascimento || dadosFinaisAluno.dt_nascimento;
        if (dataNascAluno && typeof dataNascAluno === 'string' && dataNascAluno.includes('/')) {
            const partesData = dataNascAluno.split('/');
            dataNascAluno = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
        }
        $dataNascimentoAluno.val(dataNascAluno);

        const idEscolaAluno = dadosFinaisAluno.fk_escola || dadosFinaisAluno.fk_escolas || dadosFinaisAluno.escola?.id || '';
        const idSerieAluno = dadosFinaisAluno.fk_serie || dadosFinaisAluno.fk_series || dadosFinaisAluno.serie?.id || '';

        $unidadeAluno.val(idEscolaAluno);
        $unidadeAluno.val(idEscolaAluno);
        if (idAlunoSendoEditado && !String(idAlunoSendoEditado).startsWith('new_S')) { // Checa se é um aluno existente
            $unidadeAluno.prop('disabled', true); // Desabilita o select de unidade
        } else {
            $unidadeAluno.prop('disabled', false); // Habilita para novos alunos
        }
        // Carrega séries para a unidade selecionada, depois define o valor da série
        carregarSeriesParaUnidade($serieAluno, idEscolaAluno, idSerieAluno);
        if (!idEscolaAluno) { // Se não houver ID de escola, reseta o select de séries
            reiniciarSelectSerie($serieAluno);
        }

        $colegioAtualAluno.val(dadosFinaisAluno.colegio_atual);

        const elModalPaiEdicao = $(this).closest('.modal.fade.show'); // Encontra o modal pai visível
        const instanciaModalAlunoEdicao = new bootstrap.Modal($modalAdicionarAluno[0]);
        instanciaModalAlunoEdicao.show();

        if (elModalPaiEdicao.length) {
            setTimeout(function () {
                $('body').addClass('modal-open');
            }, 150);
        }
    });

    // Evento: Clique em "Salvar Aluno" no modal de aluno
    $botaoSalvarAluno.on('click', function () {
        const idDoResponsavelForm = $idResponsavelParaAluno.val();
        const idAlunoExistenteForm = $idAlunoAtual.val();
        const nomeAlunoForm = $nomeAluno.val();
        const dataNascAlunoForm = $dataNascimentoAluno.val();
        const idUnidadeAlunoForm = $unidadeAluno.val();
        const idSerieAlunoForm = $serieAluno.val();

        // 1. VALIDAÇÃO PRIMEIRO
        if (!nomeAlunoForm || !dataNascAlunoForm || !idUnidadeAlunoForm || !idSerieAlunoForm) {
            alert('Por favor, preencha todos os campos obrigatórios do aluno (Nome, Data Nasc., Unidade, Série).');
            return; // Para a execução aqui, modal permanece aberto para correção
        }

        // 2. SE VALIDAÇÃO PASSOU, PREPARE OS DADOS
        const dadosCompletosAluno = {
            id: idAlunoExistenteForm || ('new_S' + Date.now() + '_' + contadorAlunos++), // ID único temporário
            nome: nomeAlunoForm,
            data_nascimento: dataNascAlunoForm,
            fk_escola: idUnidadeAlunoForm,
            unidade_nome: $unidadeAluno.find('option:selected').text(),
            fk_serie: idSerieAlunoForm,
            serie_nome: $serieAluno.find('option:selected').text(),
            colegio_atual: $colegioAtualAluno.val()
        };

        // 3. ATUALIZE A INTERFACE DA PÁGINA PRINCIPAL
        adicionarOuAtualizarLinhaAluno(idDoResponsavelForm, dadosCompletosAluno);

        // 4. AGORA, GERENCIE O FOCO E FECHE O MODAL
        console.log("Tentando fechar o modal do aluno após validação e atualização da UI...");

        try {
            // Tenta mover o foco para o body e depois desfocar.
            // Isso é uma tentativa mais forte de garantir que nada dentro do modal tenha foco.
            document.body.focus();
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
        } catch (e) {
            console.warn("Aviso ao tentar gerenciar o foco antes de fechar o modal:", e);
            // Se o body não for focável ou ocorrer outro problema, tenta o blur anterior como fallback
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
        }

        const modalElement = $modalAdicionarAluno[0];
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                // O evento 'hidden.bs.modal' pode ser usado para qualquer limpeza APÓS o modal fechar.
                // Para garantir que o modal realmente feche e o backdrop seja removido,
                // vamos confiar no .hide() e na gestão de foco.
                modalInstance.hide();
                console.log("Comando hide() do modal chamado com sucesso.");

                // Forçar a remoção da classe 'modal-open' do body se ela persistir indevidamente
                // Isso é mais um "curativo" se o Bootstrap não limpar corretamente devido a interrupções.
                // Faça isso após um pequeno delay para dar tempo ao Bootstrap.
                setTimeout(function () {
                    if (!$('.modal.show').length) { // Se não houver outros modais abertos
                        $('body').removeClass('modal-open');
                        // Remove o backdrop manualmente se ele ainda existir
                        $('.modal-backdrop').remove();
                    }
                }, 500); // Ajuste o tempo se necessário

            } else {
                console.warn("Não foi possível obter a instância Bootstrap do modal para fechar.");
            }
        } else {
            console.warn("Elemento do modal não encontrado para fechar.");
        }
    });

    // Evento: Após o modal de aluno (#addStudentModal) ser ocultado
    $modalAdicionarAluno.on('hidden.bs.modal', function () {
        // Verifica se algum outro modal deveria estar ativo e restaura o 'modal-open' no body se necessário
        if ($('.modal.fade.show').length > 0) {
            $('body').addClass('modal-open');
        }
    });


    // Evento: Remover aluno da lista
    $(document).on('click', '.remove-student-btn', function () {
        if (confirm('Tem certeza que deseja remover este aluno da lista?')) {
            const $linhaAlunoRemover = $(this).closest('tr');
            const $corpoTabela = $linhaAlunoRemover.closest('tbody');
            $linhaAlunoRemover.remove();
            if ($corpoTabela.find('tr').length === 0) {
                $corpoTabela.html('<tr><td colspan="6" class="text-center">Nenhum aluno adicionado.</td></tr>');
            }
        }
    });

    // Evento: Antes do #cadastroModal (novo cadastro) ser exibido
    $modalCadastro.on('show.bs.modal', function () {
        if ($formularioNovoCadastro.length) $formularioNovoCadastro[0].reset();
        $containerNovosResponsaveis.html('');
        contadorResponsaveis = 0; // Reseta contador para novos responsáveis neste modal
        contadorAlunos = 0;     // Reseta contador para novos alunos neste modal
        adicionarCartaoResponsavel('newResponsiblesContainer', {}, false); // Adiciona cartão inicial de responsável
        // Carregamento de selects dinâmicos para este modal iria aqui, ex: carregarOpcoesParaNovoCadastro();
    });

    // Evento: Clique em "Adicionar Outro Responsável" no #cadastroModal
    $botaoAdicionarNovoResponsavel.on('click', function () {
        adicionarCartaoResponsavel('newResponsiblesContainer', {}, false);
    });

    // Evento: Remover cartão de responsável
    $(document).on('click', '.remove-responsible', function () {
        const $cartaoResponsavelRemover = $(this).closest('.responsible-card');
        const idResponsavelCartao = $cartaoResponsavelRemover.data('responsible-id');
        const mensagemConfirmacaoRemocao = 'Tem certeza que deseja remover este responsável e todos os seus alunos da lista?';
        const $formPai = $cartaoResponsavelRemover.closest('form'); // Encontra o formulário pai

        // Não permitir remover o primeiro responsável em um formulário de edição se ele não for 'new_'
        if ($formPai.is('#cadastroFormEdit') && // É o formulário de EDIÇÃO de cadastro
            $cartaoResponsavelRemover.is(':first-child') && // É o primeiro cartão de responsável
            !String(idResponsavelCartao).startsWith('new_responsible_')) { // E o ID não é temporário
            alert('O responsável principal de um cadastro existente não pode ser removido diretamente por aqui.');
            return;
        }


        if (confirm(mensagemConfirmacaoRemocao)) {
            $cartaoResponsavelRemover.remove();
            // Se for o último responsável removido, e for o formulário de NOVO cadastro, adicionar um novo vazio
            if ($formPai.is('#cadastroFormNovo') && $formPai.find('.responsible-card').length === 0) {
                adicionarCartaoResponsavel('newResponsiblesContainer', {}, false);
            }
        }
    });


    // Função genérica para coletar dados de responsáveis e alunos de um formulário
    function coletarDadosResponsaveisAlunos($form) {
        const arrayResponsaveisForm = [];
        $form.find('.responsible-card').each(function () {
            const $cartaoAtual = $(this);
            const idResponsavelAtual = $cartaoAtual.data('responsible-id');
            const responsavelObj = {
                id: idResponsavelAtual,
                nome: $cartaoAtual.find(`input[name="responsibles[${idResponsavelAtual}][nome]"]`).val(),
                email: $cartaoAtual.find(`input[name="responsibles[${idResponsavelAtual}][email]"]`).val(),
                celular: $cartaoAtual.find(`input[name="responsibles[${idResponsavelAtual}][celular]"]`).val(),
                alunos: []
            };

            $cartaoAtual.find('.students-table tbody tr[data-student-id]').each(function () {
                const $linhaAlunoAtual = $(this);
                const idAlunoLinha = $linhaAlunoAtual.data('student-id');
                // Certifique-se que os inputs hidden dos alunos estão corretos
                responsavelObj.alunos.push({
                    id: idAlunoLinha,
                    nome: $linhaAlunoAtual.find(`input[name$="[${idAlunoLinha}][nome]"]`).val(),
                    data_nascimento: $linhaAlunoAtual.find(`input[name$="[${idAlunoLinha}][data_nascimento]"]`).val(),
                    fk_serie: $linhaAlunoAtual.find(`input[name$="[${idAlunoLinha}][fk_serie]"]`).val(),
                    fk_escola: $linhaAlunoAtual.find(`input[name$="[${idAlunoLinha}][fk_escola]"]`).val(),
                    colegio_atual: $linhaAlunoAtual.find(`input[name$="[${idAlunoLinha}][colegio_atual]"]`).val(),
                });
            });
            arrayResponsaveisForm.push(responsavelObj);
        });
        return arrayResponsaveisForm;
    }


    // Evento: Submissão do formulário principal de Novo Cadastro
    $(document).on('submit', '#cadastroFormNovo', function (e) {
        e.preventDefault();
        const $formSubmetido = $(this);

        const dadosResponsaveis = coletarDadosResponsaveisAlunos($formSubmetido);
        if (dadosResponsaveis.length === 0 || !dadosResponsaveis[0].nome) {
            alert('É necessário adicionar pelo menos um responsável com nome.');
            return;
        }


        const dadosCadastroFinal = {
            _token: $formSubmetido.find('input[name="_token"]').val(),
            fk_atendente: $formSubmetido.find('[name="fk_atendente"]').val(),
            fk_origens: $formSubmetido.find('[name="fk_origens"]').val(),
            fk_situacao: $formSubmetido.find('[name="fk_situacao"]').val(),
            observacoes: $formSubmetido.find('[name="observacoes"]').val(),
            responsibles: dadosResponsaveis
        };

        $.ajax({
            url: $formSubmetido.attr('action'),
            method: $formSubmetido.attr('method').toUpperCase(),
            data: dadosCadastroFinal,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (resposta) {
                alert(resposta.message || 'Cadastro salvo com sucesso!');
                if (typeof cadastrosIndexRoute !== 'undefined') {
                    window.location.href = cadastrosIndexRoute;
                } else {
                    window.location.href = '/cadastros'; // Fallback
                }
            },
            error: function (xhr) {
                let msgErro = 'Erro ao salvar o cadastro.';
                if (xhr.responseJSON) {
                    if (xhr.responseJSON.message) msgErro += `\n${xhr.responseJSON.message}`;
                    if (xhr.responseJSON.errors) {
                        Object.values(xhr.responseJSON.errors).forEach(erros => msgErro += `\n- ${erros.join(', ')}`);
                    }
                }
                alert(msgErro);
            }
        });
    });

    // NOVO: Evento: Submissão do formulário de Edição de Cadastro
    $(document).on('submit', '#cadastroFormEdit', function (e) { // ID do formulário de EDIÇÃO
        e.preventDefault();
        const $formSubmetido = $(this);

        const dadosResponsaveis = coletarDadosResponsaveisAlunos($formSubmetido);
        if (dadosResponsaveis.length === 0 || !dadosResponsaveis[0].nome) {
            alert('É necessário manter pelo menos um responsável com nome.');
            return;
        }

        const dadosCadastroFinal = {
            _token: $formSubmetido.find('input[name="_token"]').val(),
            _method: $formSubmetido.find('input[name="_method"]').val(), // Deverá ser 'PUT'
            fk_atendente: $formSubmetido.find('[name="fk_atendente"]').val(),
            fk_origens: $formSubmetido.find('[name="fk_origens"]').val(),
            fk_situacao: $formSubmetido.find('[name="fk_situacao"]').val(),
            // Observações são tratadas em modal separado, não inclusas aqui diretamente,
            // a menos que haja um campo de observação principal no form de edição.
            // observacoes: $formSubmetido.find('[name="observacoes"]').val(),
            responsibles: dadosResponsaveis
        };

        $.ajax({
            url: $formSubmetido.attr('action'),
            method: 'POST', // Laravel usa POST para _method PUT/PATCH
            data: dadosCadastroFinal,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (resposta) {
                alert(resposta.message || 'Cadastro atualizado com sucesso!');
                if (typeof cadastrosIndexRoute !== 'undefined') {
                    window.location.href = cadastrosIndexRoute;
                } else {
                    window.location.href = '/cadastros'; // Fallback
                }
            },
            error: function (xhr) {
                let msgErro = 'Erro ao atualizar o cadastro.';
                console.error("Detalhes do erro de validação:", xhr.responseJSON); // Linha para logar no console

                if (xhr.responseJSON) {
                    if (xhr.responseJSON.message) {
                        // Remove a mensagem genérica "(and X more errors)" se vamos listar os campos
                        let mainMessage = xhr.responseJSON.message;
                        if (mainMessage.includes("(and") && mainMessage.includes("more errors)")) {
                            mainMessage = mainMessage.substring(0, mainMessage.indexOf("(and")).trim();
                        }
                        msgErro += `\n${mainMessage}`;
                    }

                    if (xhr.responseJSON.errors) {
                        Object.keys(xhr.responseJSON.errors).forEach(campo => {
                            // campo vai ser algo como "responsibles.0.nome" ou "fk_atendente"
                            // xhr.responseJSON.errors[campo] é um array de mensagens de erro para aquele campo
                            msgErro += `\n- ${campo}: ${xhr.responseJSON.errors[campo].join(', ')}`;
                        });
                    }
                } else {
                    msgErro += "\nNão foi possível obter detalhes do erro do servidor.";
                }
                alert(msgErro);
            }
        });
    });


    // --- DataTable para Cadastros ---
    let tabelaCadastrosRef; // Mantém uma referência
    if ($elementoTabelaCadastros.length) {
        tabelaCadastrosRef = $elementoTabelaCadastros.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: typeof cadastrosListarRoute !== 'undefined' ? cadastrosListarRoute : '/cadastros/listar', // Usa rota global ou fallback
                data: function (d) {
                    d.unidade = $filtroUnidade.val();
                    d.serie = $filtroSerie.val();
                    d.situacao = $filtroSituacao.val();
                    d.origem = $filtroOrigem.val();
                    d.data_inicio = $filtroDataInicio.val();
                    d.data_fim = $filtroDataFim.val();
                }
            },
            columns: [
                { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
                { data: 'id', name: 'tb_cadastro.id' },
                { data: 'responsavel_nome', name: 'tb_responsavel.nome' },
                {
                    data: 'responsavel_celular',
                    name: 'tb_responsavel.celular',
                    render: function (data, type, row) {
                        if (type === 'display' && data) {
                            // Remove caracteres não numéricos do telefone (parênteses, traços, espaços)
                            // Assumimos que o 'data' é o número local (Ex: (11) 98765-4321 ou 11987654321)
                            // e que precisamos adicionar o código do país '55'
                            const numeroLimpo = String(data).replace(/\D/g, '');

                            if (numeroLimpo.length >= 10) { // Verifica se tem pelo menos DDD + número (10 ou 11 dígitos)
                                const whatsappUrl = 'https://api.whatsapp.com/send?phone=55' + numeroLimpo;
                                // O 'data' original (com formatação) é usado como texto do link para melhor leitura
                                return '<a href="' + whatsappUrl + '" target="_blank" class="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">' + data + '</a>';
                            } else {
                                return data; // Retorna o dado original se não parecer um número válido para linkar
                            }
                        }
                        return data; // Retorna o dado original para ordenação, filtro, etc.
                    }
                },
                {
                    data: 'atendente_nome',
                    name: 'users.name',
                    render: function (data, type, row) {
                        // 'data' aqui é o valor de 'atendente_nome'
                        // Verifica se o dado existe para evitar "<strong>null</strong>" ou "<strong>undefined</strong>"
                        if (type === 'display' && data) {
                            return '<strong>' + data + '</strong>';
                        }
                        return data; // Retorna o dado original para outros tipos (sort, filter, etc.)
                    }
                },
                { data: 'agenda_completa', name: 'tb_cadastro.dt_agenda' },
                { data: 'origem_nome', name: 'tb_origens.nome' },
                { data: 'situacao_nome', name: 'tb_situacao.nome' },
                { data: 'data_cadastro', name: 'tb_cadastro.dt_insert' },
                { data: 'acoes', name: 'acoes', orderable: false, searchable: false }
            ],
            order: [[1, 'desc']],
            language: { url: '/js/pt-BR.json' }, // Certifique-se que este arquivo existe
            responsive: true
        });

        // Listener para expandir/recolher detalhes no DataTable
        $elementoTabelaCadastros.on('click', 'tbody td.dt-control', function () {
            const $linhaClicada = $(this).closest('tr');
            const linhaDataTableObj = tabelaCadastrosRef.row($linhaClicada);

            if (linhaDataTableObj.child.isShown()) {
                linhaDataTableObj.child.hide();
                $linhaClicada.removeClass('shown');
            } else {
                const dadosDaLinha = linhaDataTableObj.data();
                if (dadosDaLinha && dadosDaLinha.id) {
                    // ATUALIZADO: Garante que a rota de detalhes do cadastro exista
                    const urlDetalhes = (typeof cadastrosDetalhesRouteBase !== 'undefined')
                        ? cadastrosDetalhesRouteBase.replace(':id', dadosDaLinha.id)
                        : `/cadastros/${dadosDaLinha.id}/details`;
                    $.ajax({
                        url: urlDetalhes,
                        method: 'GET',
                        success: function (dadosDetalhesRetorno) {
                            linhaDataTableObj.child(formatarDetalhesLinha(dadosDetalhesRetorno)).show();
                            $linhaClicada.addClass('shown');
                        },
                        error: function (xhr) {
                            console.error('Erro ao carregar detalhes:', xhr);
                            linhaDataTableObj.child('Erro ao carregar detalhes.').show();
                            $linhaClicada.addClass('shown');
                        }
                    });
                } else {
                    linhaDataTableObj.child('ID do cadastro não encontrado.').show();
                    $linhaClicada.addClass('shown');
                }
            }
        });
    }

    // --- Modal de Observações ---
    function carregarObservacoes(idDoCadastro) {
        // Garanta que rotaObservacoesBase seja definida (ex: no Blade)
        const urlFinalObservacoes = (typeof rotaObservacoesBase !== 'undefined' ? rotaObservacoesBase.replace(':id', idDoCadastro) : `/cadastros/${idDoCadastro}/observacoes`);

        $labelModalObservacoes.text('Observações do Cadastro #' + idDoCadastro);
        $conteudoObservacoes.html('<p class="text-center"><i class="fas fa-spinner fa-spin"></i> Carregando...</p>');
        $idCadastroObservacao.val(idDoCadastro);

        $.getJSON(urlFinalObservacoes)
            .done(function (resposta) {
                if (resposta.success && resposta.data && resposta.data.length > 0) {
                    let htmlLista = '<ul class="list-group list-group-flush">';
                    resposta.data.forEach(obs => htmlLista += formatarObservacaoParaLista(obs));
                    htmlLista += '</ul>';
                    $conteudoObservacoes.html(htmlLista);
                } else {
                    $conteudoObservacoes.html('<p class="text-center">Nenhuma observação encontrada.</p>');
                }
            })
            .fail(function (xhr) {
                $conteudoObservacoes.html('<p class="text-center text-danger">Erro ao carregar observações.</p>');
                console.error("Erro AJAX ao buscar observações:", xhr);
            });
    }

    $(document).on('click', '.btn-view-observacoes', function () {
        const idCadastroClicado = $(this).data('id');
        carregarObservacoes(idCadastroClicado);
        // Modal é aberto pelos atributos data-bs-toggle no botão
    });

    $(document).on('click', '.btn-editar-observacao', function () {
        const idObsSelecionada = $(this).data('obs-id');
        const textoOriginalObs = $(this).data('obs-texto'); // Deve ser o texto original/cru

        $textoNovaObservacao.val(textoOriginalObs).focus();
        $idObservacaoEmEdicao.val(idObsSelecionada);
        $botaoSalvarNovaObservacao.text('Atualizar Observação').removeClass('btn-primary').addClass('btn-success is-editing');
    });

    $botaoSalvarNovaObservacao.on('click', function () {
        const idCadastroAtual = $idCadastroObservacao.val();
        const textoObservacaoAtual = $textoNovaObservacao.val().trim();
        const idObsEditando = $idObservacaoEmEdicao.val();
        const $botaoClicado = $(this);

        if (!textoObservacaoAtual) {
            alert('Por favor, escreva a observação.');
            $textoNovaObservacao.focus();
            return;
        }
        if (!idObsEditando && !idCadastroAtual) { // Precisa de um contexto
            alert('Erro: Contexto do cadastro ou da observação não encontrado.');
            return;
        }

        let urlAcaoObs, metodoHttpObs, payloadDadosObs = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            texto: textoObservacaoAtual
        };

        if (idObsEditando) { // Se idObsEditando tem valor, estamos atualizando
            // ATUALIZADO: Garante que a rota de update da observação exista
            urlAcaoObs = (typeof rotaObservacoesUpdateBase !== 'undefined')
                ? rotaObservacoesUpdateBase.replace(':id_observacao', idObsEditando)
                : `/observacoes/${idObsEditando}/update`;
            metodoHttpObs = 'PUT';
            payloadDadosObs._method = 'PUT';
        } else { // Senão, estamos criando uma nova
            // ATUALIZADO: Garante que a rota de store da observação exista
            urlAcaoObs = (typeof rotaObservacoesStoreBase !== 'undefined')
                ? rotaObservacoesStoreBase.replace(':id', idCadastroAtual)
                : `/cadastros/${idCadastroAtual}/observacoes`;
            metodoHttpObs = 'POST';
        }

        $botaoClicado.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Salvando...');

        $.ajax({ url: urlAcaoObs, type: metodoHttpObs, data: payloadDadosObs, dataType: 'json' })
            .done(function (resposta) {
                if (resposta.success && resposta.data) {
                    $textoNovaObservacao.val('');
                    $idObservacaoEmEdicao.val(''); // Limpa ID de edição

                    if (idObsEditando) { // Atualizou uma existente
                        const $itemListaObs = $conteudoObservacoes.find(`li[data-obs-id-li="${idObsEditando}"]`);
                        if ($itemListaObs.length) {
                            $itemListaObs.replaceWith(formatarObservacaoParaLista(resposta.data)); // Re-renderiza o item específico
                        } else { // Fallback: recarrega todas se não encontrar o item
                            carregarObservacoes(idCadastroAtual || resposta.data.fk_cadastro);
                        }
                    } else { // Criou uma nova
                        const htmlNovaObs = formatarObservacaoParaLista(resposta.data);
                        const $ulExistente = $conteudoObservacoes.children('ul.list-group');
                        if ($ulExistente.length === 0 || $ulExistente.find('p:contains("Nenhuma observação encontrada")').length > 0) {
                            $conteudoObservacoes.html('<ul class="list-group list-group-flush">' + htmlNovaObs + '</ul>');
                        } else {
                            $ulExistente.prepend(htmlNovaObs);
                        }
                    }
                    alert(resposta.message || `Observação ${idObsEditando ? 'atualizada' : 'salva'}!`);
                } else {
                    alert(resposta.message || 'Erro ao processar a observação.');
                }
            })
            .fail(function (xhr) {
                alert('Erro de comunicação ao salvar/atualizar a observação.');
                console.error("Erro AJAX:", xhr);
            })
            .always(function () {
                $botaoClicado.prop('disabled', false);
                // Reseta estado do botão
                $botaoClicado.text('Salvar Observação').removeClass('btn-success is-editing').addClass('btn-primary');
                if (!$idObservacaoEmEdicao.val()) { // Limpo se edição bem-sucedida
                    $botaoClicado.html('<i class="fas fa-save me-1"></i> Salvar Observação');
                }
            });
    });

    $modalObservacoes.on('hidden.bs.modal', function () {
        $conteudoObservacoes.html('<p>Carregando observações...</p>'); // Placeholder
        $labelModalObservacoes.text('Observações do Cadastro');
        $textoNovaObservacao.val('');
        $idCadastroObservacao.val('');
        $idObservacaoEmEdicao.val('');
        $botaoSalvarNovaObservacao.text('Salvar Observação')
            .removeClass('btn-success is-editing').addClass('btn-primary')
            .html('<i class="fas fa-save me-1"></i> Salvar Observação')
            .prop('disabled', false);
    });


    // --- Filtros para Tabela de Cadastros ---
    $botaoFiltrar.on('click', function () {
        if (tabelaCadastrosRef) tabelaCadastrosRef.ajax.reload();
    });

    $formularioFiltro.on('reset', function () {
        setTimeout(() => { // Delay para permitir que os campos do formulário realmente resetem
            reiniciarSelectSerie($filtroSerie, 'Selecione uma unidade antes');
            if (tabelaCadastrosRef) tabelaCadastrosRef.ajax.reload();
        }, 50);
    });

    // Inicializa filtros e listeners de atualização de séries se estiver na página de listagem de cadastros
    if ($elementoTabelaCadastros.length) {
        carregarOpcoesParaFiltro();
        configurarAtualizacaoSerie('filterUnidade', 'filterSerie');
    }
    // Configura para modal de aluno (dropdowns de unidade/série)
    configurarAtualizacaoSerie('unidadeAluno', 'serieAluno');


    // --- Exclusão de Cadastro ---
    $(document).on('click', '.btn-delete', function () {
        const idCadastroExcluir = $(this).data('id');
        // ATUALIZADO: Garante que a rota de delete do cadastro exista
        const urlDelete = (typeof cadastrosDestroyRouteBase !== 'undefined')
            ? cadastrosDestroyRouteBase.replace(':id', idCadastroExcluir)
            : `/cadastros/${idCadastroExcluir}`;

        if (confirm('Tem certeza que deseja excluir este cadastro? Esta ação marcará o cadastro e seus relacionados como inativos.')) {
            $.ajax({
                url: urlDelete,
                type: 'POST', // Usando POST com _method para DELETE
                data: {
                    _method: 'DELETE',
                    _token: $('meta[name="csrf-token"]').attr('content') || ($formularioNovoCadastro.length ? $formularioNovoCadastro.find('input[name="_token"]').val() : '')
                },
                success: function (resposta) {
                    alert(resposta.message || 'Cadastro excluído com sucesso.');
                    if (tabelaCadastrosRef) tabelaCadastrosRef.ajax.reload();
                },
                error: function (xhr) {
                    alert('Erro de comunicação ao excluir o cadastro: ' + (xhr.responseJSON?.message || xhr.statusText));
                    console.error("Erro AJAX ao excluir:", xhr);
                }
            });
        }
    });

    // --- Máscara de Telefone ---
    // Aplicação inicial para elementos existentes
    $('.phone-mask').each(function () {
        if (!$(this).data('masked')) {
            $(this).mask('(00) 00000-0000').data('masked', true);
        }
    });
    // Para elementos adicionados dinamicamente, é aplicada dentro de adicionarCartaoResponsavel.


    // --- Lógica Específica do Formulário de Edição de Cadastro ---
    // ATUALIZADO: ID correto do formulário de EDIÇÃO de cadastro
    const $formularioEdicaoCadastroPrincipal = $('#cadastroFormEdit');
    if ($formularioEdicaoCadastroPrincipal.length && $formularioEdicaoCadastroPrincipal.find('input[name="_method"][value="PUT"]').length) {
        // Inicializa contadores com base nos maiores IDs numéricos existentes na página de edição
        let maiorIdResponsavelNumerico = 0;
        // ATUALIZADO: Seletor do container de responsáveis no form de edição
        $('#responsiblesContainer .responsible-card').each(function () {
            const id = $(this).data('responsible-id');
            if (typeof id === 'number' && id > maiorIdResponsavelNumerico) maiorIdResponsavelNumerico = id;
            else if (String(id).startsWith('new_responsible_')) { // Considera IDs temporários se houver
                const numTemp = parseInt(String(id).split('_').pop(), 10);
                if (!isNaN(numTemp) && numTemp > contadorResponsaveis) contadorResponsaveis = numTemp;
            }
        });
        if (maiorIdResponsavelNumerico > contadorResponsaveis) contadorResponsaveis = maiorIdResponsavelNumerico;


        let maiorIdAlunoNumerico = 0;
        $('#responsiblesContainer .students-table tbody tr').each(function () {
            const id = $(this).data('student-id');
            if (typeof id === 'number' && id > maiorIdAlunoNumerico) maiorIdAlunoNumerico = id;
            else if (String(id).startsWith('new_S')) { // Considera IDs temporários se houver
                const numTempAluno = parseInt(String(id).split('_').pop(), 10);
                if (!isNaN(numTempAluno) && numTempAluno > contadorAlunos) contadorAlunos = numTempAluno;
            }
        });
        if (maiorIdAlunoNumerico > contadorAlunos) contadorAlunos = maiorIdAlunoNumerico;


        // Botão para salvar um NOVO responsável via modal na página de EDIÇÃO de cadastro
        // Este modal é o #addResponsavelModal e o form #responsavelForm (que é genérico)
        $('#btnSaveResponsible').off('click').on('click', function () {
            // Verifica se o modal #addResponsavelModal está associado ao contexto de edição de cadastro
            // (pode ser verificando se o form #cadastroForm está presente na página)
            if (!$('#cadastroFormEdit').length) {
                // Se não for a página de edição de cadastro, não faz nada aqui (outra lógica pode tratar)
                return;
            }

            const nomeNovoResponsavel = $('#responsavelNome').val(); // Do #addResponsavelModal
            const emailNovoResponsavel = $('#responsavelEmail').val();
            const celularNovoResponsavel = $('#responsavelCelular').val();

            if (!nomeNovoResponsavel) {
                alert('O nome do responsável é obrigatório.');
                return;
            }
            // Adiciona como novo cartão em 'responsiblesContainer' (container do form de edição)
            adicionarCartaoResponsavel('responsiblesContainer', { nome: nomeNovoResponsavel, email: emailNovoResponsavel, celular: celularNovoResponsavel }, true);

            const elModalAddResp = document.getElementById('addResponsavelModal');
            if (elModalAddResp) {
                const instanciaModalAddResp = bootstrap.Modal.getInstance(elModalAddResp);
                if (instanciaModalAddResp) instanciaModalAddResp.hide();
            }
            const formResp = document.getElementById('responsavelForm');
            if (formResp) formResp.reset();
        });

        // Botão para adicionar outro responsável diretamente no formulário de edição (se existir tal botão)
        // Exemplo: <button type="button" id="addAnotherResponsibleEditPage">Adicionar Responsável</button>
        $('#addAnotherResponsibleEditPage').on('click', function () { // Crie este botão no seu HTML de edição se necessário
            adicionarCartaoResponsavel('responsiblesContainer', {}, true);
        });
    }

    // --- DataTable e AJAX para Atendentes ---
    let tabelaAtendentesRef;
    if ($elementoTabelaAtendentes.length) {
        tabelaAtendentesRef = $elementoTabelaAtendentes.DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: typeof atendentesListarRoute !== 'undefined' ? atendentesListarRoute : '/atendentes/listar',
                error: function (xhr, error, thrown) {
                    console.error("Erro no AJAX da DataTable de Atendentes:", xhr.responseText);
                    console.log("XHR Object:", xhr); // Informações detalhadas do erro
                    console.log("Error string:", error);
                    console.log("Thrown error:", thrown);
                    alert("Erro ao carregar a lista de atendentes. Verifique o console para mais detalhes.");
                }
            },
            language: { url: '/js/pt-BR.json' },
            dom: 'Bfrtip',
            buttons: [
                { extend: 'excel', text: '<i class="fas fa-file-excel me-1"></i> Excel', className: 'btn btn-sm', exportOptions: { columns: ':visible' } },
                { extend: 'pdf', text: '<i class="fas fa-file-pdf me-1"></i> PDF', className: 'btn btn-sm', exportOptions: { columns: ':visible' } },
                { extend: 'print', text: '<i class="fas fa-print me-1"></i> Imprimir', className: 'btn btn-sm', exportOptions: { columns: ':visible' } }
            ],
            order: [[0, 'desc']],
            columns: [
                { data: 'id', name: 'users.id' }, // Assumindo que a tabela de atendentes é 'users'
                { data: 'name', name: 'users.name' },
                { data: 'email', name: 'users.email' },
                { data: 'unidade.nome', name: 'unidade.nome', defaultContent: 'N/A' },
                { data: 'acoes', orderable: false, searchable: false }
            ]
        });

        // NOVO: Submissão do formulário de NOVO atendente
        $formularioNovoAtendente.on('submit', function (e) {
            e.preventDefault();
            const formAtual = this;
            if (!formAtual.checkValidity()) {
                formAtual.reportValidity();
                return;
            }

            const urlAcaoForm = $(formAtual).attr('action'); // Vem do HTML: {{ route('atendentes.store') }}
            const dadosForm = $(formAtual).serialize();

            $.ajax({
                url: urlAcaoForm,
                type: 'POST',
                data: dadosForm,
                headers: { 'X-CSRF-TOKEN': $(formAtual).find('input[name="_token"]').val() },
                success: function (resposta) {
                    alert(resposta.message || 'Atendente salvo com sucesso!');
                    if ($modalNovoAtendente.length) {
                        const instanciaModal = bootstrap.Modal.getInstance($modalNovoAtendente[0]);
                        if (instanciaModal) instanciaModal.hide();
                    }
                    if (tabelaAtendentesRef) tabelaAtendentesRef.ajax.reload();
                    formAtual.reset(); // Limpa o formulário
                },
                error: function (xhr) {
                    console.error('Erro ao salvar novo atendente:', xhr);
                    let msgErro = 'Erro ao salvar o atendente.';
                    if (xhr.responseJSON) {
                        if (xhr.responseJSON.message) msgErro += `\n${xhr.responseJSON.message}`;
                        if (xhr.responseJSON.errors) {
                            Object.values(xhr.responseJSON.errors).forEach(erros => msgErro += `\n- ${erros.join(', ')}`);
                        }
                    }
                    alert(msgErro);
                }
            });
        });


        // Submissão do formulário de edição de atendente (já existente, mas revisado)
        $formularioEditarAtendente.on('submit', function (e) {
            e.preventDefault();
            const formAtual = this;
            if (!formAtual.checkValidity()) {
                formAtual.reportValidity();
                return;
            }

            const urlAcaoForm = $(formAtual).attr('action'); // Dinamicamente setado ao abrir modal
            const dadosForm = $(formAtual).serialize(); // Inclui _method=PUT

            $.ajax({
                url: urlAcaoForm,
                type: 'POST', // Laravel usa POST com _method para PUT/PATCH
                data: dadosForm,
                headers: { 'X-CSRF-TOKEN': $(formAtual).find('input[name="_token"]').val() },
                success: function (resposta) {
                    alert(resposta.mensagem || 'Atendente atualizado com sucesso!');
                    if ($modalEditarAtendente.length) {
                        const instanciaModal = bootstrap.Modal.getInstance($modalEditarAtendente[0]);
                        if (instanciaModal) instanciaModal.hide();
                    }
                    if (tabelaAtendentesRef) tabelaAtendentesRef.ajax.reload();
                },
                error: function (xhr) {
                    console.error('Erro ao editar atendente:', xhr);
                    let msgErro = 'Erro ao atualizar o atendente.';
                    if (xhr.responseJSON) {
                        if (xhr.responseJSON.message) msgErro += `\n${xhr.responseJSON.message}`;
                        if (xhr.responseJSON.errors) {
                            Object.values(xhr.responseJSON.errors).forEach(erros => msgErro += `\n- ${erros.join(', ')}`);
                        }
                    }
                    alert(msgErro);
                }
            });
        });

        // Preenche e exibe modal de edição de atendente (já existente, mas revisado)
        $(document).on('click', '.btn-edit-atendente', function () { // CLASSE MAIS ESPECÍFICA
            const idAtendente = $(this).data('id');
            const nomeAtendente = $(this).data('name');
            const emailAtendente = $(this).data('email');
            const unidadeIdAtendente = $(this).data('unidade-id'); // Adicione data-unidade-id="{{ $atendente->fk_escolas }}" no botão

            // ATUALIZADO: Garante que a rota de update do atendente exista
            const urlUpdateAtendente = (typeof atendentesUpdateRouteBase !== 'undefined')
                ? atendentesUpdateRouteBase.replace(':id', idAtendente)
                : `/atendentes/${idAtendente}`;
            $formularioEditarAtendente.attr('action', urlUpdateAtendente);

            $formularioEditarAtendente.find('#edit_id').val(idAtendente);
            $formularioEditarAtendente.find('#edit_name').val(nomeAtendente);
            $formularioEditarAtendente.find('#edit_email').val(emailAtendente);
            $formularioEditarAtendente.find('#edit_password').val('');
            $formularioEditarAtendente.find('#edit_password_confirmation').val('');

            // Se o modal de edição de atendente tiver um select para unidade:
            // const $selectUnidadeEdit = $formularioEditarAtendente.find('#edit_fk_escolas'); // Assumindo ID do select
            // if ($selectUnidadeEdit.length) {
            //     $selectUnidadeEdit.val(unidadeIdAtendente);
            // }

            if ($modalEditarAtendente.length) {
                const instanciaModalEdicao = new bootstrap.Modal($modalEditarAtendente[0]);
                instanciaModalEdicao.show();
            }
        });

        // Exclusão de Atendente
        $(document).on('click', '.btn-delete-atendente', function () { // CLASSE MAIS ESPECÍFICA
            const idAtendente = $(this).data('id');
            const nomeAtendente = $(this).data('name'); // Para mensagem de confirmação

            // ATUALIZADO: Garante que a rota de delete do atendente exista
            const urlDeleteAtendente = (typeof atendentesDestroyRouteBase !== 'undefined')
                ? atendentesDestroyRouteBase.replace(':id', idAtendente)
                : `/atendentes/${idAtendente}`;

            if (confirm(`Tem certeza que deseja excluir o atendente "${nomeAtendente || idAtendente}"?`)) {
                $.ajax({
                    url: urlDeleteAtendente,
                    type: 'POST',
                    data: {
                        _method: 'DELETE',
                        _token: $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (resposta) {
                        alert(resposta.message || 'Atendente excluído com sucesso.');
                        if (tabelaAtendentesRef) tabelaAtendentesRef.ajax.reload();
                    },
                    error: function (xhr) {
                        alert('Erro ao excluir o atendente: ' + (xhr.responseJSON?.message || xhr.statusText));
                    }
                });
            }
        });
    }

}); // Fim de $(document).ready()
