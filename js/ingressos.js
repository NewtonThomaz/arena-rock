(function () {
    const listaIngressos = document.getElementById("lista-ingressos");
    const contadorIngressos = document.getElementById("contador-ingressos");
    const buscaIngresso = document.getElementById("busca-ingresso");

    function criarCartaoIngresso(inscricao) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-vitrine";

        const eventoRelacionado = EventosAPI.buscarEventoPorId(inscricao.eventoId);
        cartao.appendChild(
            EventosAPI.criarMidiaVitrine(
                EventosAPI.obterCapaEvento(eventoRelacionado || {}),
                inscricao.eventoTitulo,
                inscricao.setorIngresso || "Pista Rock",
                "Confirmado",
                ""
            )
        );

        const corpo = document.createElement("section");
        corpo.className = "corpo-cartao";

        const titulo = document.createElement("h3");
        titulo.className = "titulo-cartao";
        titulo.textContent = inscricao.eventoTitulo;
        corpo.appendChild(titulo);

        const listaMeta = document.createElement("section");
        listaMeta.className = "lista-meta-cartao";

        const linhaTitular = document.createElement("p");
        linhaTitular.className = "linha-meta-cartao";
        linhaTitular.appendChild(EventosAPI.criarMetaIcone("usuarios", inscricao.nome + " • " + inscricao.email, "destaque-meta"));
        listaMeta.appendChild(linhaTitular);

        const linhaEmissao = document.createElement("p");
        linhaEmissao.className = "linha-meta-cartao";
        linhaEmissao.appendChild(EventosAPI.criarMetaIcone("calendario", "Emitido em " + inscricao.dataHora));
        listaMeta.appendChild(linhaEmissao);

        corpo.appendChild(listaMeta);

        const rodape = document.createElement("footer");
        rodape.className = "rodape-cartao";

        const destaqueRodape = document.createElement("p");
        destaqueRodape.className = "destaque-rodape-cartao";
        const rotulo = document.createElement("span");
        rotulo.className = "rotulo-rodape-cartao";
        rotulo.textContent = "voucher";
        const codigo = document.createElement("strong");
        codigo.className = "valor-rodape-cartao codigo";
        codigo.textContent = inscricao.codigoConfirmacao;
        destaqueRodape.appendChild(rotulo);
        destaqueRodape.appendChild(codigo);

        const linkShow = document.createElement("a");
        linkShow.className = "botao-cartao";
        linkShow.href = "evento.html?id=" + encodeURIComponent(inscricao.eventoId);
        linkShow.textContent = "Ver Show →";

        rodape.appendChild(destaqueRodape);
        rodape.appendChild(linkShow);
        corpo.appendChild(rodape);
        cartao.appendChild(corpo);

        return cartao;
    }

    function renderizarIngressos() {
        const termo = (buscaIngresso.value || "").trim().toLowerCase();
        const todos = EventosAPI.listarInscricoes();
        const filtrados = todos.filter(function (item) {
            return !termo ||
                item.codigoConfirmacao.toLowerCase().includes(termo) ||
                item.email.toLowerCase().includes(termo) ||
                item.nome.toLowerCase().includes(termo) ||
                item.eventoTitulo.toLowerCase().includes(termo);
        });

        listaIngressos.innerHTML = "";
        contadorIngressos.textContent = filtrados.length + (filtrados.length === 1 ? " ingresso emitido encontrado" : " ingressos emitidos encontrados");

        if (filtrados.length === 0) {
            const vazio = document.createElement("section");
            vazio.className = "estado-vazio";
            const msg = document.createElement("p");
            msg.textContent = "Nenhum ingresso encontrado para esta busca.";
            vazio.appendChild(msg);
            listaIngressos.appendChild(vazio);
            return;
        }

        filtrados.forEach(function (item) {
            listaIngressos.appendChild(criarCartaoIngresso(item));
        });
    }

    buscaIngresso.addEventListener("input", renderizarIngressos);
    renderizarIngressos();
    EventosAPI.sincronizarComSupabase().then(renderizarIngressos);
})();

