(function () {
    const corpoTabela = document.getElementById("tabela-bandas");
    const campoBusca = document.getElementById("busca-admin-bandas");
    const formulario = document.getElementById("form-cadastro-banda");
    const tituloForm = document.getElementById("titulo-form-banda");
    const campoNome = document.getElementById("campo-nome-banda");
    const campoVertente = document.getElementById("campo-vertente-banda");
    const campoCidade = document.getElementById("campo-cidade-banda");
    const campoIntegrantes = document.getElementById("campo-integrantes-banda");
    const campoBiografia = document.getElementById("campo-biografia-banda");
    const campoDestaque = document.getElementById("campo-destaque-banda");
    const botaoSalvar = document.getElementById("salvar-banda");

    let idEmEdicao = null;
    let listaAtual = [];

    function gerarSlug(texto) {
        return texto
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    async function listarBandas() {
        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                const resposta = await window.supabaseClient.from("bandas").select("*").order("id", { ascending: true });
                if (!resposta.error && resposta.data) {
                    listaAtual = resposta.data;
                    return listaAtual;
                }
            } catch (erro) {
                console.warn("Usando bandas locais:", erro);
            }
        }
        listaAtual = window.EventosAPI ? window.EventosAPI.listarBandas() : [];
        return listaAtual;
    }

    function iniciarEdicao(banda) {
        idEmEdicao = banda.id || banda.slug;
        if (tituloForm) tituloForm.textContent = "Editar Banda: " + banda.nome;
        if (botaoSalvar) botaoSalvar.textContent = "Salvar Alterações";

        campoNome.value = banda.nome || "";
        campoVertente.value = banda.vertente || "";
        campoCidade.value = banda.cidade || "";
        campoIntegrantes.value = banda.integrantes || "";
        campoBiografia.value = banda.biografia || "";
        campoDestaque.checked = Boolean(banda.destaque);

        if (window.ControladorModalAdmin) {
            window.ControladorModalAdmin.abrir("formulario-banda", true);
        }
    }

    function cancelarEdicao() {
        idEmEdicao = null;
        if (formulario) formulario.reset();
        if (tituloForm) tituloForm.textContent = "Cadastrar Nova Banda";
        if (botaoSalvar) botaoSalvar.textContent = "Salvar Banda";
    }

    async function renderizarTabela(recarregar) {
        if (!corpoTabela) return;
        const bandas = recarregar === false ? listaAtual : await listarBandas();
        const termo = (campoBusca && campoBusca.value ? campoBusca.value : "").trim().toLowerCase();

        const filtradas = bandas.filter(function (b) {
            return !termo ||
                (b.nome && b.nome.toLowerCase().includes(termo)) ||
                (b.vertente && b.vertente.toLowerCase().includes(termo)) ||
                (b.cidade && b.cidade.toLowerCase().includes(termo));
        });

        if (filtradas.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="5">Nenhuma banda encontrada.</td></tr>';
            return;
        }

        corpoTabela.innerHTML = filtradas.map(function (b) {
            const idRef = b.id || b.slug;
            const classeDestaque = b.destaque ? "selo-admin" : "selo-inativo";
            const textoDestaque = b.destaque ? "Headliner" : "Line-up";
            return `
                <tr>
                    <td data-label="Nome"><strong>${b.nome}</strong></td>
                    <td data-label="Vertente"><span class="categoria-evento">${b.vertente}</span></td>
                    <td data-label="Cidade">${b.cidade}</td>
                    <td data-label="Destaque"><span class="selo ${classeDestaque}">${textoDestaque}</span></td>
                    <td data-label="Ações" class="acoes-tabela">
                        <button type="button" class="botao-pequeno botao-editar" data-id="${idRef}">Editar</button>
                        <button type="button" class="botao-pequeno botao-excluir" data-id="${idRef}">Excluir</button>
                    </td>
                </tr>
            `;
        }).join("");

        corpoTabela.querySelectorAll(".botao-editar").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const encontrada = listaAtual.find(function (b) {
                    return String(b.id) === String(id) || String(b.slug) === String(id);
                });
                if (encontrada) iniciarEdicao(encontrada);
            });
        });

        corpoTabela.querySelectorAll(".botao-excluir").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("bandas").delete().eq("id", id);
                }
                if (window.EventosAPI) {
                    window.EventosAPI.removerBandaLocal(id);
                }
                if (String(idEmEdicao) === String(id)) {
                    cancelarEdicao();
                }
                renderizarTabela(true);
            });
        });
    }

    if (campoBusca) {
        campoBusca.addEventListener("input", function () {
            renderizarTabela(false);
        });
    }

    if (window.ControladorModalAdmin) {
        window.ControladorModalAdmin.registrarReset("formulario-banda", cancelarEdicao);
    }

    if (formulario) {
        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();
            const nome = (campoNome.value || "").trim();
            const vertente = (campoVertente.value || "").trim();
            const cidade = (campoCidade.value || "").trim();
            const integrantes = (campoIntegrantes.value || "").trim() || "Formação a confirmar";
            const biografia = (campoBiografia.value || "").trim() || "Banda confirmada na temporada Arena Rock.";
            const destaque = Boolean(campoDestaque.checked);

            if (nome.length < 2 || vertente.length < 2 || cidade.length < 2) {
                alert("Preencha o nome da banda, a vertente musical e a cidade.");
                return;
            }

            const slug = gerarSlug(nome);
            const payload = {
                nome: nome,
                slug: slug,
                vertente: vertente,
                cidade: cidade,
                integrantes: integrantes,
                biografia: biografia,
                destaque: destaque
            };

            if (idEmEdicao) {
                if (window.EventosAPI) {
                    window.EventosAPI.atualizarBandaLocal(idEmEdicao, payload);
                }
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("bandas").update(payload).eq("id", idEmEdicao);
                }
                if (window.ControladorModalAdmin) {
                    window.ControladorModalAdmin.fechar("formulario-banda");
                } else {
                    cancelarEdicao();
                }
                await renderizarTabela(true);
                alert("Banda atualizada com sucesso!");
            } else {
                if (window.EventosAPI) {
                    window.EventosAPI.adicionarBandaLocal(Object.assign({ id: slug }, payload));
                }
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("bandas").insert(payload);
                }
                if (window.ControladorModalAdmin) {
                    window.ControladorModalAdmin.fechar("formulario-banda");
                } else {
                    cancelarEdicao();
                }
                await renderizarTabela(true);
                alert("Banda cadastrada no circuito!");
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderizarTabela(true);
    });
})();
