(function () {
    const listaEventos = document.getElementById("lista-eventos");
    const contadorEventos = document.getElementById("contador-eventos");
    const buscaEventos = document.getElementById("busca-eventos");
    const filtroItens = document.querySelectorAll(".lista-filtros .item-filtro");

    function criarCardEvento(evento) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-vitrine";

        const esgotado = Number(evento.vagasRestantes || 0) <= 0;
        const seloTexto = esgotado ? "Esgotado" : (evento.destaque ? "Destaque" : "");
        const seloClasse = esgotado ? "esgotado" : "";
        cartao.appendChild(
            EventosAPI.criarMidiaVitrine(
                EventosAPI.obterCapaEvento(evento),
                evento.titulo,
                evento.categoria,
                seloTexto,
                seloClasse
            )
        );

        const corpo = document.createElement("section");
        corpo.className = "corpo-cartao";

        const titulo = document.createElement("h3");
        titulo.className = "titulo-cartao";
        titulo.textContent = evento.titulo;
        corpo.appendChild(titulo);

        const listaMeta = document.createElement("section");
        listaMeta.className = "lista-meta-cartao";

        const linhaBanda = document.createElement("p");
        linhaBanda.className = "linha-meta-cartao";
        linhaBanda.appendChild(EventosAPI.criarMetaIcone("musica", evento.bandaPrincipal || "Atrações Confirmadas", "destaque-meta"));
        listaMeta.appendChild(linhaBanda);

        const linhaLocal = document.createElement("p");
        linhaLocal.className = "linha-meta-cartao";
        linhaLocal.appendChild(EventosAPI.criarMetaIcone("pin", evento.local));
        listaMeta.appendChild(linhaLocal);

        const linhaData = document.createElement("p");
        linhaData.className = "linha-meta-cartao";
        linhaData.appendChild(EventosAPI.criarMetaIcone("calendario", EventosAPI.formatarData(evento.dataISO)));
        linhaData.appendChild(EventosAPI.criarMetaIcone("relogio", evento.horario));
        listaMeta.appendChild(linhaData);

        corpo.appendChild(listaMeta);

        const rodape = document.createElement("footer");
        rodape.className = "rodape-cartao";

        const destaqueRodape = document.createElement("p");
        destaqueRodape.className = "destaque-rodape-cartao";

        if (!esgotado) {
            const rotulo = document.createElement("span");
            rotulo.className = "rotulo-rodape-cartao";
            rotulo.textContent = "restam";

            const valor = document.createElement("strong");
            valor.className = "valor-rodape-cartao";
            valor.textContent = Number(evento.vagasRestantes).toLocaleString("pt-BR");

            destaqueRodape.appendChild(rotulo);
            destaqueRodape.appendChild(valor);
        } else {
            const valorEsgotado = document.createElement("strong");
            valorEsgotado.className = "valor-rodape-cartao esgotado";
            valorEsgotado.textContent = "Sold Out";
            destaqueRodape.appendChild(valorEsgotado);
        }

        const link = document.createElement("a");
        link.className = "botao-cartao";
        link.href = "evento.html?id=" + encodeURIComponent(evento.id);
        link.textContent = "Ingressos →";

        rodape.appendChild(destaqueRodape);
        rodape.appendChild(link);
        corpo.appendChild(rodape);
        cartao.appendChild(corpo);

        return cartao;
    }

    function renderizarEsqueleto(quantidade) {
        listaEventos.innerHTML = "";
        for (let i = 0; i < quantidade; i++) {
            const esqueleto = document.createElement("article");
            esqueleto.className = "cartao-vitrine esqueleto";
            listaEventos.appendChild(esqueleto);
        }
    }

    function renderizarLista(eventos) {
        listaEventos.innerHTML = "";

        if (eventos.length === 0) {
            const vazio = document.createElement("section");
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
