(function () {
    const listaBandas = document.getElementById("lista-bandas");
    const contadorBandas = document.getElementById("contador-bandas");
    const buscaBandas = document.getElementById("busca-bandas");

    function criarCartaoBanda(banda, indice) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-vitrine";

        cartao.appendChild(
            EventosAPI.criarMidiaVitrine(
                EventosAPI.obterCapaBanda(banda, indice),
                banda.nome,
                banda.vertente,
                banda.destaque ? "Headliner" : "",
                ""
            )
        );

        const corpo = document.createElement("div");
        corpo.className = "corpo-cartao";

        const nome = document.createElement("h3");
        nome.className = "titulo-cartao";
        nome.textContent = banda.nome;
        corpo.appendChild(nome);

        const biografia = document.createElement("p");
        biografia.className = "resumo-cartao";
        biografia.textContent = banda.biografia;
        corpo.appendChild(biografia);

        const listaMeta = document.createElement("div");
        listaMeta.className = "lista-meta-cartao";

        const linhaCidade = document.createElement("div");
        linhaCidade.className = "linha-meta-cartao";
        linhaCidade.appendChild(EventosAPI.criarMetaIcone("pin", banda.cidade));
        listaMeta.appendChild(linhaCidade);

        if (banda.integrantes) {
            const linhaIntegrantes = document.createElement("div");
            linhaIntegrantes.className = "linha-meta-cartao";
            linhaIntegrantes.appendChild(EventosAPI.criarMetaIcone("usuarios", banda.integrantes));
            listaMeta.appendChild(linhaIntegrantes);
        }

        corpo.appendChild(listaMeta);

        const rodape = document.createElement("div");
        rodape.className = "rodape-cartao";

        const destaqueRodape = document.createElement("div");
        destaqueRodape.className = "destaque-rodape-cartao";
        const rotulo = document.createElement("span");
        rotulo.className = "rotulo-rodape-cartao";
        rotulo.textContent = "temporada";
        const valor = document.createElement("strong");
        valor.className = "valor-rodape-cartao";
        valor.textContent = "2026";
        destaqueRodape.appendChild(rotulo);
        destaqueRodape.appendChild(valor);

        const botaoShows = document.createElement("a");
        botaoShows.className = "botao-cartao";
        botaoShows.href = "index.html#agenda";
        botaoShows.textContent = "Ver Shows →";

        rodape.appendChild(destaqueRodape);
        rodape.appendChild(botaoShows);
        corpo.appendChild(rodape);
        cartao.appendChild(corpo);

        return cartao;
    }

    function renderizarBandas() {
        const termo = (buscaBandas.value || "").trim().toLowerCase();
        const todas = EventosAPI.listarBandas();
        const filtradas = todas.filter(function (banda) {
            return !termo ||
                banda.nome.toLowerCase().includes(termo) ||
                banda.vertente.toLowerCase().includes(termo) ||
                banda.cidade.toLowerCase().includes(termo);
        });

        listaBandas.innerHTML = "";
        contadorBandas.textContent = filtradas.length + (filtradas.length === 1 ? " banda confirmada no circuito" : " bandas confirmadas no circuito");

        if (filtradas.length === 0) {
            const vazio = document.createElement("div");
            vazio.className = "estado-vazio";
            const msg = document.createElement("p");
            msg.textContent = "Nenhuma banda encontrada com esse termo.";
            vazio.appendChild(msg);
            listaBandas.appendChild(vazio);
            return;
        }

        filtradas.forEach(function (banda, indice) {
            listaBandas.appendChild(criarCartaoBanda(banda, indice));
        });
    }

    buscaBandas.addEventListener("input", renderizarBandas);
    renderizarBandas();
    EventosAPI.sincronizarComSupabase().then(renderizarBandas);
})();

