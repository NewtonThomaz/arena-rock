(function () {
    const seletorEvento = document.getElementById("filtro-evento");
    const campoBusca = document.getElementById("busca-inscritos");
    const seletorStatus = document.getElementById("filtro-status-checkin");
    const seletorLinhas = document.getElementById("linhas-por-pagina");
    const contadorPortaria = document.getElementById("contador-portaria");
    const botaoExportar = document.getElementById("botao-exportar-csv");
    const corpoTabela = document.getElementById("tabela-inscritos");
    const containerPaginacao = document.getElementById("paginacao-inscritos");

    let ultimasFiltradas = [];
    let paginaAtual = 1;

    function obterLimitePorPagina() {
        const valor = Number(seletorLinhas ? seletorLinhas.value : 100);
        return valor > 0 ? valor : 100;
    }

    function obterFiltroDaUrl() {
        return new URLSearchParams(window.location.search).get("evento") || "";
    }

    function carregarOpcoesFiltro() {
        const eventos = EventosAPI.listarEventos();
        const filtroInicial = obterFiltroDaUrl();

        seletorEvento.innerHTML = '<option value="">Todos os shows</option>' +
            eventos.map(function (ev) {
                const selecionado = (String(ev.id) === String(filtroInicial) || String(ev.idBanco) === String(filtroInicial)) ? "selected" : "";
                return `<option value="${ev.id}" ${selecionado}>${ev.titulo}</option>`;
            }).join("");
    }

    function filtrarRegistros() {
        const eventoSelecionado = seletorEvento ? seletorEvento.value : "";
        const termo = (campoBusca && campoBusca.value ? campoBusca.value : "").trim().toLowerCase();
        const statusFiltro = seletorStatus ? seletorStatus.value : "todos";
        const todas = EventosAPI.listarInscricoes();

        const porEvento = todas.filter(function (item) {
            return !eventoSelecionado || String(item.eventoId) === String(eventoSelecionado);
        });

        const totalValidados = porEvento.filter(function (item) { return Boolean(item.checkin); }).length;
        if (contadorPortaria) {
            contadorPortaria.textContent = totalValidados + " de " + porEvento.length + " validados";
        }

        return porEvento.filter(function (item) {
            const bateTermo = !termo ||
                (item.codigoConfirmacao && item.codigoConfirmacao.toLowerCase().includes(termo)) ||
                (item.nome && item.nome.toLowerCase().includes(termo)) ||
                (item.email && item.email.toLowerCase().includes(termo)) ||
                (item.eventoTitulo && item.eventoTitulo.toLowerCase().includes(termo));

            const validado = Boolean(item.checkin);
            const bateStatus = statusFiltro === "todos" ||
                (statusFiltro === "validados" && validado) ||
                (statusFiltro === "pendentes" && !validado);

            return bateTermo && bateStatus;
        });
    }

    function montarPaginasVisiveis(atual, total) {
        if (total <= 7) {
            const todas = [];
            for (let p = 1; p <= total; p++) todas.push(p);
            return todas;
        }
        const itens = [1];
        const inicioJanela = Math.max(2, atual - 1);
        const fimJanela = Math.min(total - 1, atual + 1);
        if (inicioJanela > 2) itens.push("...");
        for (let p = inicioJanela; p <= fimJanela; p++) itens.push(p);
        if (fimJanela < total - 1) itens.push("...");
        itens.push(total);
        return itens;
    }

    function renderizarPaginacao(totalItens, inicioExibido, fimExibido, totalPaginas) {
        if (!containerPaginacao) return;

        if (totalItens === 0) {
            containerPaginacao.innerHTML = "";
            containerPaginacao.hidden = true;
            return;
        }

        containerPaginacao.hidden = false;
        const paginas = montarPaginasVisiveis(paginaAtual, totalPaginas);

        const botoesNumericos = paginas.map(function (p) {
            if (p === "...") {
                return '<span class="reticencias-paginacao" aria-hidden="true">…</span>';
            }
            const classeAtiva = p === paginaAtual ? " ativo" : "";
            return `<button type="button" class="botao-pagina-admin${classeAtiva}" data-pagina="${p}" aria-label="Página ${p}" ${p === paginaAtual ? 'aria-current="page"' : ""}>${p}</button>`;
        }).join("");

        containerPaginacao.innerHTML = `
            <span class="resumo-paginacao-admin">
                Exibindo <strong>${inicioExibido}–${fimExibido}</strong> de <strong>${totalItens}</strong> inscritos • Página <strong>${paginaAtual}</strong> de <strong>${totalPaginas}</strong>
            </span>
            <div class="botoes-paginacao-admin">
                <button type="button" class="botao-pagina-admin" data-pagina="${paginaAtual - 1}" ${paginaAtual <= 1 ? "disabled" : ""}>← Anterior</button>
                ${botoesNumericos}
                <button type="button" class="botao-pagina-admin" data-pagina="${paginaAtual + 1}" ${paginaAtual >= totalPaginas ? "disabled" : ""}>Próxima →</button>
            </div>
        `;

        containerPaginacao.querySelectorAll("button[data-pagina]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                if (this.disabled) return;
                const destino = Number(this.getAttribute("data-pagina"));
                if (!destino || destino === paginaAtual) return;
                paginaAtual = destino;
                renderizarInscritos();
                const bloco = document.querySelector(".bloco-admin");
                if (bloco && bloco.getBoundingClientRect().top < 0) {
                    bloco.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
    }

    function renderizarInscritos() {
        const filtradas = filtrarRegistros();
        ultimasFiltradas = filtradas;

        if (filtradas.length === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="6">Nenhuma inscrição encontrada para este filtro.</td>
                </tr>
            `;
            renderizarPaginacao(0, 0, 0, 1);
            return;
        }

        const porPagina = obterLimitePorPagina();
        const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
        if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
        if (paginaAtual < 1) paginaAtual = 1;

        const inicio = (paginaAtual - 1) * porPagina;
        const fim = Math.min(inicio + porPagina, filtradas.length);
        const itensPagina = filtradas.slice(inicio, fim);

        corpoTabela.innerHTML = itensPagina.map(function (item) {
            const validado = Boolean(item.checkin);
            const classeLinha = validado ? "linha-checkin-feito" : "";
            const classeSelo = validado ? "selo-ativo" : "selo-inativo";
            const textoStatus = validado ? ("✓ Check-in" + (item.checkinEm ? " • " + item.checkinEm : "")) : "Pendente";
            const textoBotao = validado ? "Desfazer" : "Validar";
            const classeBotao = validado ? "botao-pequeno botao-checkin validado" : "botao-pequeno botao-checkin";

            return `
                <tr class="${classeLinha}" data-evento="${item.eventoId}">
                    <td data-label="Participante">
                        <div class="celula-participante-portaria">
                            <strong>${item.nome}</strong>
                            <span class="email-participante-portaria">${item.email}</span>
                        </div>
                    </td>
                    <td data-label="Show / Evento">${item.eventoTitulo}</td>
                    <td data-label="Setor"><span class="categoria-evento selo-setor-portaria">${item.setorIngresso || "Pista Rock"}</span></td>
                    <td data-label="Código" class="celula-nowrap"><strong>${item.codigoConfirmacao}</strong></td>
                    <td data-label="Status" class="celula-nowrap"><span class="selo ${classeSelo}">${textoStatus}</span></td>
                    <td data-label="Ações" class="acoes-tabela">
                        <button type="button" class="${classeBotao}" data-id="${item.id}">${textoBotao}</button>
                        <button type="button" class="botao-pequeno botao-excluir" data-id="${item.id}">Remover</button>
                    </td>
                </tr>
            `;
        }).join("");

        renderizarPaginacao(filtradas.length, inicio + 1, fim, totalPaginas);

        corpoTabela.querySelectorAll(".botao-checkin").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                const atualizado = EventosAPI.alternarCheckinInscricaoLocal(id);

                if (atualizado && window.supabaseConfigurado && window.supabaseClient) {
                    try {
                        await window.supabaseClient
                            .from("inscricoes")
                            .update({
                                checkin: Boolean(atualizado.checkin),
                                checkin_em: atualizado.checkin ? new Date().toISOString() : null
                            })
                            .eq("id", id);
                    } catch (erro) {}
                }

                renderizarInscritos();
            });
        });

        corpoTabela.querySelectorAll(".botao-excluir").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                const eventoAtualizado = EventosAPI.removerInscricaoLocal(id);
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("inscricoes").delete().eq("id", id);
                    if (eventoAtualizado && eventoAtualizado.idBanco) {
                        await window.supabaseClient
                            .from("eventos")
                            .update({ vagas_restantes: eventoAtualizado.vagasRestantes })
                            .eq("id", eventoAtualizado.idBanco);
                    }
                }
                renderizarInscritos();
            });
        });
    }

    function escaparCSV(valor) {
        const texto = String(valor ?? "").replace(/"/g, '""');
        return '"' + texto + '"';
    }

    function exportarCSV() {
        const registros = ultimasFiltradas.length > 0 ? ultimasFiltradas : filtrarRegistros();
        if (registros.length === 0) {
            alert("Não há registros visíveis para exportar.");
            return;
        }

        const cabecalho = ["Participante", "E-mail", "Show", "Setor", "Emitido em", "Código", "Status Check-in"];
        const linhas = registros.map(function (item) {
            return [
                escaparCSV(item.nome),
                escaparCSV(item.email),
                escaparCSV(item.eventoTitulo),
                escaparCSV(item.setorIngresso || "Pista Rock"),
                escaparCSV(item.dataHora),
                escaparCSV(item.codigoConfirmacao),
                escaparCSV(item.checkin ? "Validado" : "Pendente")
            ].join(";");
        });

        const conteudo = "\uFEFF" + cabecalho.join(";") + "\n" + linhas.join("\n");
        const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "portaria-arena-rock.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    async function inicializar() {
        await EventosAPI.sincronizarComSupabase();
        carregarOpcoesFiltro();
        renderizarInscritos();
        if (seletorEvento) seletorEvento.addEventListener("change", function () {
            paginaAtual = 1;
            renderizarInscritos();
        });
        if (campoBusca) campoBusca.addEventListener("input", function () {
            paginaAtual = 1;
            renderizarInscritos();
        });
        if (seletorStatus) seletorStatus.addEventListener("change", function () {
            paginaAtual = 1;
            renderizarInscritos();
        });
        if (seletorLinhas) seletorLinhas.addEventListener("change", function () {
            paginaAtual = 1;
            renderizarInscritos();
        });
        if (botaoExportar) botaoExportar.addEventListener("click", exportarCSV);
    }

    document.addEventListener("DOMContentLoaded", inicializar);
})();
