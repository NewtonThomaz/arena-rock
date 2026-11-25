(function () {
    async function carregarDashboard() {
        if (window.EventosAPI && typeof window.EventosAPI.sincronizarComSupabase === "function") {
            await window.EventosAPI.sincronizarComSupabase();
        }

        const eventos = window.EventosAPI ? window.EventosAPI.listarEventos() : [];
        const bandas = window.EventosAPI ? window.EventosAPI.listarBandas() : [];
        const locais = window.EventosAPI ? window.EventosAPI.listarLocais() : [];
        const categorias = window.EventosAPI ? window.EventosAPI.listarCategorias() : [];
        const inscritos = window.EventosAPI ? window.EventosAPI.listarInscricoes() : [];
        let equipe = window.ControladorAutenticacao ? window.ControladorAutenticacao.listarUsuariosLocais() : [];

        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                const resUsuarios = await window.supabaseClient.from("usuarios").select("id");
                if (!resUsuarios.error && resUsuarios.data) {
                    equipe = resUsuarios.data;
                }
            } catch (e) {}
        }

        const totalDestaques = eventos.filter(function (ev) { return Boolean(ev.destaque); }).length;
        const totalVagasRestantes = eventos.reduce(function (soma, ev) {
            return soma + Math.max(0, Number(ev.vagasRestantes || 0));
        }, 0);
        const totalVagasCapacidade = eventos.reduce(function (soma, ev) {
            return soma + Math.max(0, Number(ev.vagasTotais || 0));
        }, 0);
        const totalCheckins = inscritos.filter(function (ins) { return Boolean(ins.checkin); }).length;

        const taxaMediaOcupacao = eventos.length > 0
            ? Math.round(eventos.reduce(function (soma, ev) {
                return soma + window.EventosAPI.calcularPercentualOcupacao(ev);
            }, 0) / eventos.length)
            : 0;

        const showsCriticos = eventos.filter(function (ev) {
            const totais = Number(ev.vagasTotais || 0);
            const restantes = Number(ev.vagasRestantes || 0);
            return totais > 0 && (restantes === 0 || (restantes / totais) < 0.15);
        }).length;

        const kpiShows = document.getElementById("kpi-shows");
        const subKpiShows = document.getElementById("sub-kpi-shows");
        const kpiIngressos = document.getElementById("kpi-ingressos");
        const subKpiIngressos = document.getElementById("sub-kpi-ingressos");
        const kpiOcupacao = document.getElementById("kpi-ocupacao");
        const subKpiOcupacao = document.getElementById("sub-kpi-ocupacao");
        const kpiVagas = document.getElementById("kpi-vagas");
        const subKpiVagas = document.getElementById("sub-kpi-vagas");

        if (kpiShows) kpiShows.textContent = eventos.length;
        if (subKpiShows) subKpiShows.textContent = totalDestaques + " em destaque na vitrine";

        if (kpiIngressos) kpiIngressos.textContent = inscritos.length.toLocaleString("pt-BR");
        if (subKpiIngressos) subKpiIngressos.textContent = totalCheckins + " check-ins validados";

        if (kpiOcupacao) kpiOcupacao.textContent = taxaMediaOcupacao + "%";
        if (subKpiOcupacao) subKpiOcupacao.textContent = (totalVagasCapacidade - totalVagasRestantes).toLocaleString("pt-BR") + " lugares ocupados";

        if (kpiVagas) kpiVagas.textContent = totalVagasRestantes.toLocaleString("pt-BR");
        if (subKpiVagas) {
            if (showsCriticos > 0) {
                subKpiVagas.className = "sub-kpi-admin alerta-kpi-admin";
                subKpiVagas.textContent = showsCriticos + (showsCriticos === 1 ? " show esgotado ou < 15%" : " shows esgotados ou < 15%");
            } else {
                subKpiVagas.textContent = "Todos os lotes disponíveis";
            }
        }

        const listaLotacao = document.getElementById("lista-lotacao-dashboard");
        if (listaLotacao) {
            if (eventos.length === 0) {
                listaLotacao.innerHTML = '<p class="sub-kpi-admin">Nenhum show cadastrado ainda.</p>';
            } else {
                listaLotacao.innerHTML = "";
                eventos.forEach(function (ev) {
                    const percentual = window.EventosAPI.calcularPercentualOcupacao(ev);
                    const totais = Number(ev.vagasTotais || 0);
                    const restantes = Number(ev.vagasRestantes || 0);
                    const ocupados = Math.max(0, totais - restantes);

                    const item = document.createElement("article");
                    item.className = "item-lotacao-admin";

                    const topo = document.createElement("header");
                    topo.className = "topo-item-lotacao";

                    const titulo = document.createElement("strong");
                    titulo.textContent = ev.titulo;

                    const link = document.createElement("a");
                    link.className = "link-bloco-admin";
                    link.href = "inscritos.html?evento=" + encodeURIComponent(ev.id);
                    link.textContent = "Portaria →";

                    topo.appendChild(titulo);
                    topo.appendChild(link);

                    const meta = document.createElement("p");
                    meta.className = "meta-item-lotacao";
                    meta.textContent = ocupados + " / " + totais + " vendidos (" + percentual + "%) • " + restantes + " restantes";

                    const trilha = document.createElement("figure");
                    trilha.className = "trilha-lotacao";
                    const barra = document.createElement("span");
                    barra.className = "barra-lotacao" + (restantes === 0 ? " esgotada" : (percentual >= 75 ? " alta" : ""));
                    barra.style.width = percentual + "%";
                    trilha.appendChild(barra);

                    item.appendChild(topo);
                    item.appendChild(meta);
                    item.appendChild(trilha);
                    listaLotacao.appendChild(item);
                });
            }
        }

        const feedIngressos = document.getElementById("feed-ingressos-dashboard");
        if (feedIngressos) {
            const recentes = inscritos.slice(0, 5);
            if (recentes.length === 0) {
                feedIngressos.innerHTML = '<p class="sub-kpi-admin">Nenhuma emissão registrada até o momento.</p>';
            } else {
                feedIngressos.innerHTML = "";
                recentes.forEach(function (ins) {
                    const item = document.createElement("article");
                    item.className = "item-feed-ingresso";

                    const info = document.createElement("section");
                    info.className = "info-feed-ingresso";

                    const nome = document.createElement("strong");
                    nome.textContent = ins.nome;
                    const detalhe = document.createElement("span");
                    detalhe.textContent = ins.eventoTitulo + " • " + (ins.setorIngresso || "Pista Rock");

                    info.appendChild(nome);
                    info.appendChild(detalhe);

                    const lado = document.createElement("aside");
                    lado.className = "lado-feed-ingresso";

                    const codigo = document.createElement("span");
                    codigo.className = "codigo-mini-feed";
                    codigo.textContent = ins.codigoConfirmacao;

                    const status = document.createElement("span");
                    status.className = "selo " + (ins.checkin ? "selo-ativo" : "selo-inativo");
                    status.textContent = ins.checkin ? "✓ Validado" : "Pendente";

                    lado.appendChild(codigo);
                    lado.appendChild(status);

                    item.appendChild(info);
                    item.appendChild(lado);
                    feedIngressos.appendChild(item);
                });
            }
        }

        const elEventos = document.getElementById("resumo-admin-eventos");
        const elBandas = document.getElementById("resumo-admin-bandas");
        const elLocais = document.getElementById("resumo-admin-locais");
        const elCategorias = document.getElementById("resumo-admin-categorias");
        const elInscritos = document.getElementById("resumo-admin-inscritos");
        const elEquipe = document.getElementById("resumo-admin-equipe");

        if (elEventos) elEventos.textContent = eventos.length + " shows cadastrados • editar line-up, capas e lotes.";
        if (elBandas) elBandas.textContent = bandas.length + " bandas no circuito • gerenciar headliners e bios.";
        if (elLocais) elLocais.textContent = locais.length + " casas de show parceiras • capacidade e estrutura.";
        if (elCategorias) elCategorias.textContent = categorias.length + " categorias ativas nos filtros da agenda.";
        if (elInscritos) elInscritos.textContent = inscritos.length + " ingressos emitidos (" + totalCheckins + " validados).";
        if (elEquipe) elEquipe.textContent = equipe.length + " membros com acesso ao Backstage.";
    }

    document.addEventListener("DOMContentLoaded", carregarDashboard);
})();
