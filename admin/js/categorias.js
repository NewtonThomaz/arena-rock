const controladorCategorias = {
    gerarSlug: function (texto) {
        return texto
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    },

    listar: async function () {
        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                const resposta = await window.supabaseClient.from("categorias").select("*").order("id", { ascending: true });
                if (resposta.data && resposta.data.length > 0) {
                    return resposta.data;
                }
            } catch (erro) {
                console.warn("Usando categorias locais:", erro);
            }
        }
        return window.EventosAPI ? window.EventosAPI.listarCategorias() : [];
    },

    renderizarTabela: async function () {
        const corpoTabela = document.getElementById("tabela-categorias");
        if (!corpoTabela) return;

        const categorias = await controladorCategorias.listar();
        corpoTabela.innerHTML = categorias.map(function (cat) {
            const cor = cat.cor || "#e11d48";
            return `
                <tr>
                    <td data-label="Categoria"><span class="ponto-cor" style="background-color:${cor}"></span>${cat.nome}</td>
                    <td data-label="Slug">${cat.slug}</td>
                    <td data-label="Ações" class="acoes-tabela">
                        <button type="button" class="botao-pequeno botao-excluir" data-id="${cat.id || cat.slug}">Excluir</button>
                    </td>
                </tr>
            `;
        }).join("");

        corpoTabela.querySelectorAll(".botao-excluir").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const idOuSlug = this.getAttribute("data-id");
                const confirmado = await window.ArenaUI.confirmar({
                    titulo: "Excluir Categoria",
                    mensagem: "Deseja remover esta categoria da programação?",
                    textoConfirmar: "Sim, Excluir",
                    perigoso: true
                });
                if (!confirmado) return;

                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("categorias").delete().eq("id", idOuSlug);
                }
                if (window.EventosAPI) {
                    window.EventosAPI.removerCategoriaLocal(idOuSlug);
                }
                controladorCategorias.renderizarTabela();
            });
        });
    },

    configurarFormulario: function () {
        const formulario = document.getElementById("form-cadastro-categoria");
        const campoNome = document.getElementById("campo-nome-categoria");
        const campoSlug = document.getElementById("campo-slug-categoria");
        const campoCor = document.getElementById("campo-cor-categoria");

        if (!formulario) return;

        if (window.ControladorModalAdmin) {
            window.ControladorModalAdmin.registrarReset("formulario-categoria", function () {
                formulario.reset();
            });
        }

        if (campoNome && campoSlug) {
            campoNome.addEventListener("input", function () {
                campoSlug.value = controladorCategorias.gerarSlug(campoNome.value);
            });
        }

        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();
            const nome = (campoNome.value || "").trim();
            if (nome.length < 2) {
                await window.ArenaUI.alerta({
                    titulo: "Campo Obrigatório",
                    mensagem: "Informe o nome da categoria de rock.",
                    tipo: "erro"
                });
                return;
            }
            const slug = (campoSlug.value || "").trim() || controladorCategorias.gerarSlug(nome);
            const cor = campoCor ? campoCor.value : "#e11d48";

            if (window.supabaseConfigurado && window.supabaseClient) {
                await window.supabaseClient.from("categorias").insert({ nome: nome, slug: slug, cor: cor });
            }
            if (window.EventosAPI) {
                window.EventosAPI.adicionarCategoriaLocal({
                    id: Date.now(),
                    nome: nome,
                    slug: slug,
                    cor: cor
                });
            }

            if (window.ControladorModalAdmin) {
                window.ControladorModalAdmin.fechar("formulario-categoria");
            } else {
                formulario.reset();
            }
            await controladorCategorias.renderizarTabela();
            await window.ArenaUI.alerta({
                titulo: "Categoria Cadastrada",
                mensagem: "Nova categoria adicionada com sucesso!",
                tipo: "sucesso"
            });
        });
    },

    inicializar: function () {
        controladorCategorias.renderizarTabela();
        controladorCategorias.configurarFormulario();
    }
};

window.categoriesController = {
    list: controladorCategorias.listar
};

document.addEventListener("DOMContentLoaded", controladorCategorias.inicializar);
