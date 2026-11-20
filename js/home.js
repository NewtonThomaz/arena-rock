(function () {
    const listaEventos = document.getElementById("lista-eventos");
    const contadorEventos = document.getElementById("contador-eventos");
    const buscaEventos = document.getElementById("busca-eventos");
    const filtroItens = document.querySelectorAll(".lista-filtros .item-filtro");

    function criarCardEvento(evento) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-evento";

        const cabecalho = document.createElement("div");
        cabecalho.className = "cabecalho-cartao";

        const categoria = document.createElement("span");
        categoria.className = "categoria-evento";
        categoria.textContent = evento.categoria;
        cabecalho.appendChild(categoria);

        const data = document.createElement("time");
        data.className = "data-evento";
        data.textContent = EventosAPI.formatarData(evento.dataISO) + " • " + evento.horario;
        cabecalho.appendChild(data);

        const titulo = document.createElement("h3");
        titulo.className = "titulo-evento";
        titulo.textContent = evento.titulo;

        const atracao = document.createElement("p");
        atracao.className = "atracao-principal";
        atracao.textContent = "Line-up: " + (evento.bandaPrincipal || "Bandas convidadas");

        const local = document.createElement("p");
        local.className = "local-evento";
        local.textContent = "Palco: " + evento.local;

        const ocupacao = document.createElement("div");
        ocupacao.className = "info-ocupacao";

        const quantidade = document.createElement("span");
        quantidade.className = "quantidade-vagas";
        quantidade.textContent = evento.vagasRestantes > 0
            ? evento.vagasRestantes + " ingressos restantes"
            : "Ingressos Esgotados (Sold Out)";

        const percentual = EventosAPI.calcularPercentualOcupacao(evento);
        const percentagem = document.createElement("span");
        percentagem.className = "percentual-vagas";
        percentagem.textContent = percentual + "% lotado";

        const barraProgresso = document.createElement("div");
        barraProgresso.className = "barra-progresso";
        const preenchimentoProgresso = document.createElement("div");
        preenchimentoProgresso.className = "preenchimento-progresso";
        preenchimentoProgresso.style.width = percentual + "%";
        barraProgresso.appendChild(preenchimentoProgresso);

        ocupacao.appendChild(quantidade);
        ocupacao.appendChild(percentagem);
        ocupacao.appendChild(barraProgresso);

        const link = document.createElement("a");
        link.className = "link-detalhes";
        link.href = "evento.html?id=" + encodeURIComponent(evento.id);
        link.textContent = "Ver Line-up & Garantir Ingresso";

        cartao.appendChild(cabecalho);
        cartao.appendChild(titulo);
        cartao.appendChild(atracao);
        cartao.appendChild(local);
        cartao.appendChild(ocupacao);
        cartao.appendChild(link);

        return cartao;
    }

    function renderizarEsqueleto(quantidade) {
        listaEventos.innerHTML = "";
        for (let i = 0; i < quantidade; i++) {
            const esqueleto = document.createElement("div");
            esqueleto.className = "cartao-evento esqueleto";
            listaEventos.appendChild(esqueleto);
        }
    }

    function renderizarLista(eventos) {
        listaEventos.innerHTML = "";

        if (eventos.length === 0) {
            const vazio = document.createElement("div");
            vazio.className = "estado-vazio";
            const mensagem = document.createElement("p");
            mensagem.textContent = "Nenhum show ou evento encontrado para este filtro.";
            vazio.appendChild(mensagem);
            listaEventos.appendChild(vazio);
            return;
        }

        eventos.forEach(function (evento) {
            listaEventos.appendChild(criarCardEvento(evento));
        });
    }

    function atualizarContador(quantidade) {
        contadorEventos.textContent = quantidade + (quantidade === 1 ? " evento de rock na programação" : " eventos de rock na programação");
    }

    function atualizarEstatisticasTopo() {
        const elShows = document.getElementById("estatistica-shows");
        const elBandas = document.getElementById("estatistica-bandas");
        const elPalcos = document.getElementById("estatistica-palcos");
        const elIngressos = document.getElementById("estatistica-ingressos");

        const eventos = EventosAPI.listarEventos();
        const bandas = EventosAPI.listarBandas();
        const locais = EventosAPI.listarLocais();
        const totalIngressos = eventos.reduce(function (soma, evento) {
            return soma + Math.max(0, Number(evento.vagasRestantes || 0));
        }, 0);

        if (elShows) elShows.textContent = eventos.length;
        if (elBandas) elBandas.textContent = bandas.length;
        if (elPalcos) elPalcos.textContent = locais.length;
        if (elIngressos) elIngressos.textContent = totalIngressos.toLocaleString("pt-BR");
    }

    function obterFiltrosAtuais() {
        const itemAtivo = document.querySelector(".lista-filtros .item-filtro.ativo");
        return {
            termo: buscaEventos.value,
            categoria: itemAtivo ? itemAtivo.dataset.categoria : "todos"
        };
    }

    function aplicarFiltros() {
        const eventos = EventosAPI.filtrarEventos(obterFiltrosAtuais());
        renderizarLista(eventos);
        atualizarContador(eventos.length);
    }

    async function inicializar() {
        renderizarEsqueleto(6);

        buscaEventos.addEventListener("input", aplicarFiltros);

        filtroItens.forEach(function (item) {
            item.addEventListener("click", function () {
                filtroItens.forEach(function (outro) {
                    outro.classList.remove("ativo");
                });
                item.classList.add("ativo");
                aplicarFiltros();
            });
        });

        atualizarEstatisticasTopo();
        await EventosAPI.sincronizarComSupabase();
        atualizarEstatisticasTopo();
        setTimeout(aplicarFiltros, 200);
    }

    inicializar();
})();
