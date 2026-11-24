window.EventosAPI = (function () {
    const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    const CHAVE_STORAGE_EVENTOS = "arena_rock_eventos_v1";
    const CHAVE_STORAGE_CATEGORIAS = "arena_rock_categorias_v1";
    const CHAVE_STORAGE_BANDAS = "arena_rock_bandas_v1";
    const CHAVE_STORAGE_LOCAIS = "arena_rock_locais_v1";
    const CHAVE_STORAGE_INSCRICOES = "arena_rock_inscricoes_v1";

    const categoriasIniciais = [
        { id: 1, nome: "Show", slug: "show", cor: "#e11d48" },
        { id: 2, nome: "Festival", slug: "festival", cor: "#f97316" },
        { id: 3, nome: "Tributo", slug: "tributo", cor: "#eab308" },
        { id: 4, nome: "Batalha de Bandas", slug: "batalha-de-bandas", cor: "#ef4444" },
        { id: 5, nome: "Workshop", slug: "workshop", cor: "#8b5cf6" },
        { id: 6, nome: "Encontro Rock", slug: "encontro-rock", cor: "#10b981" }
    ];

    const bandasIniciais = [
        {
            id: "valquiria-de-aco",
            nome: "Valquíria de Aço",
            slug: "valquiria-de-aco",
            vertente: "Heavy Metal",
            cidade: "São Paulo - SP",
            integrantes: "Camila Rocha (Vocal), Diego Vaz (Guitarra), Rômulo Reis (Baixo), Igor Lemos (Bateria)",
            biografia: "Referência do metal tradicional paulistano com riffs velozes, letras épicas e presença de palco explosiva.",
            destaque: true
        },
        {
            id: "furia-subterranea",
            nome: "Fúria Subterrânea",
            slug: "furia-subterranea",
            vertente: "Punk Rock / Hardcore",
            cidade: "Santo André - SP",
            integrantes: "Beto Punk (Vocal/Guitarra), Nanda Cruz (Baixo), Teco (Bateria)",
            biografia: "Power trio do ABC Paulista com som cru, direto e energético inspirado no punk dos anos 80 e 90.",
            destaque: true
        },
        {
            id: "eco-de-seattle",
            nome: "Eco de Seattle",
            slug: "eco-de-seattle",
            vertente: "Grunge / Alternativo",
            cidade: "Campinas - SP",
            integrantes: "Lucas Moura (Vocal/Guitarra), Tiago Prado (Guitarra), Marina Luz (Baixo), Cauê (Bateria)",
            biografia: "Homenagem visceral à era de ouro do Grunge, mesclando composições próprias e clássicos de Alice in Chains, Nirvana e Soundgarden.",
            destaque: false
        },
        {
            id: "voltagem-77",
            nome: "Voltagem 77",
            slug: "voltagem-77",
            vertente: "Hard Rock / Classic Rock",
            cidade: "São Paulo - SP",
            integrantes: "Rick Santana (Vocal), Leo Gibson (Guitarra), Bruno Bass (Baixo), Duda (Bateria)",
            biografia: "Groove pesado, amplificadores valvulados no talo e solos incendiários na linha de AC/DC, Led Zeppelin e Deep Purple.",
            destaque: true
        },
        {
            id: "cripta-sombria",
            nome: "Cripta Sombria",
            slug: "cripta-sombria",
            vertente: "Doom / Gothic Metal",
            cidade: "Sorocaba - SP",
            integrantes: "Helena Noir (Vocal/Teclado), Vitor Doom (Guitarra), Caio (Baixo), André (Bateria)",
            biografia: "Atmosfera densa, riffs arrastados e vocais hipnóticos que transformam cada show em um ritual inesquecível.",
            destaque: false
        },
        {
            id: "distrito-fantasma",
            nome: "Distrito Fantasma",
            slug: "distrito-fantasma",
            vertente: "Post-Punk / Indie Rock",
            cidade: "Santos - SP",
            integrantes: "Artur Dias (Vocal), Sofia Martins (Guitarra), Gael (Baixo/Synth), Enzo (Bateria)",
            biografia: "Baixo pulsante, guitarras cheias de reverb e estética noturna que conquistou a cena alternativa.",
            destaque: false
        }
    ];

    const locaisIniciais = [
        {
            id: "arena-trovao",
            nome: "Arena Trovão",
            endereco: "Av. Marquês de São Vicente, 2100",
            bairroCidade: "Barra Funda - São Paulo/SP",
            capacidade: 2500,
            estrutura: "Arena coberta, camarotes, pista premium e praça de food trucks",
            descricao: "Espaço de grande porte preparado para grandes festivais de rock, pirotecnia e shows nacionais e internacionais."
        },
        {
            id: "galpao-manifesto",
            nome: "Galpão Manifesto Rock",
            endereco: "Rua Augusta, 1420",
            bairroCidade: "Consolação - São Paulo/SP",
            capacidade: 600,
            estrutura: "Palco duplo, bar artesanal, área externa e loja de merchan oficial",
            descricao: "O templo underground para shows de metal, punk, hardcore e festivais independentes no coração da cidade."
        },
        {
            id: "caverna-underground",
            nome: "Caverna Underground Pub",
            endereco: "Av. Dom Pedro II, 890",
            bairroCidade: "Bairro Jardim - Santo André/SP",
            capacidade: 250,
            estrutura: "Sistema de som PA valvulado, sinuca e cervejas artesanais",
            descricao: "Pub intimista com acústica impecável e paredes cobertas por pôsteres e guitarras históricas do rock mundial."
        },
        {
            id: "estudio-amplificador",
            nome: "Estúdio & Café Amplificador",
            endereco: "Rua Cardeal Arcoverde, 610",
            bairroCidade: "Pinheiros - São Paulo/SP",
            capacidade: 120,
            estrutura: "Estúdio de gravação, auditório para workshops e feira permanente de vinil",
            descricao: "Ponto de encontro de músicos e fãs para masterclasses de guitarra, bateria, luthieria e audições comentadas."
        }
    ];

    const eventosIniciais = [
        {
            id: "festival-trovao-2026",
            categoria: "Festival",
            titulo: "Festival Trovão de Aço 2026",
            bandaPrincipal: "Valquíria de Aço + Voltagem 77 + Cripta Sombria",
            vertenteRock: "Heavy Metal / Hard Rock",
            classificacao: "18 anos",
            destaque: true,
            dataISO: "2026-11-14",
            horario: "16h às 02h",
            local: "Arena Trovão",
            enderecoCompleto: "Av. Marquês de São Vicente, 2100 - Barra Funda, São Paulo/SP",
            organizador: "Produtora Riff Brutal",
            vagasTotais: 800,
            vagasRestantes: 145,
            descricaoCompleta: "Mais de 10 horas ininterruptas de puro rock e metal! Três bandas principais no palco central, feira de vinis raros, estandes de tatuagem, camisetas oficiais e food trucks artesanais."
        },
        {
            id: "noite-grunge-90",
            categoria: "Tributo",
            titulo: "Noite Grunge: Tributo Anos 90",
            bandaPrincipal: "Eco de Seattle",
            vertenteRock: "Grunge / Alternativo",
            classificacao: "16 anos",
            destaque: true,
            dataISO: "2026-11-21",
            horario: "21h às 01h",
            local: "Caverna Underground Pub",
            enderecoCompleto: "Av. Dom Pedro II, 890 - Bairro Jardim, Santo André/SP",
            organizador: "Coletivo SubPop Brasil",
            vagasTotais: 250,
            vagasRestantes: 38,
            descricaoCompleta: "Prepare sua camisa de flanela! Uma viagem sonora pelos clássicos de Nirvana, Pearl Jam, Alice in Chains e Soundgarden executados ao vivo com peso e fidelidade visceral."
        },
        {
            id: "batalha-garagens-final",
            categoria: "Batalha de Bandas",
            titulo: "Batalha das Garagens: Grande Final",
            bandaPrincipal: "8 Bandas Independentes Finalistas",
            vertenteRock: "Punk / Indie / Metalcore",
            classificacao: "Livre",
            destaque: true,
            dataISO: "2026-11-28",
            horario: "18h às 23h30",
            local: "Galpão Manifesto Rock",
            enderecoCompleto: "Rua Augusta, 1420 - Consolação, São Paulo/SP",
            organizador: "Rádio Rock Independente",
            vagasTotais: 500,
            vagasRestantes: 190,
            descricaoCompleta: "As 8 melhores bandas autorais da temporada sobem ao palco para disputar a gravação de um álbum completo em estúdio profissional e vaga no próximo festival. O público também vota!"
        },
        {
            id: "show-furia-subterranea",
            categoria: "Show",
            titulo: "Show 10 Anos: Fúria Subterrânea",
            bandaPrincipal: "Fúria Subterrânea + Convidados",
            vertenteRock: "Punk Rock / Hardcore",
            classificacao: "16 anos",
            destaque: false,
            dataISO: "2026-12-04",
            horario: "20h às 00h",
            local: "Galpão Manifesto Rock",
            enderecoCompleto: "Rua Augusta, 1420 - Consolação, São Paulo/SP",
            organizador: "Selo Garagem Viva",
            vagasTotais: 450,
            vagasRestantes: 62,
            descricaoCompleta: "Comemoração de uma década de estrada com repertório tocando o primeiro disco na íntegra, roda punk garantida e lançamento de vinil comemorativo."
        },
        {
            id: "masterclass-guitarra-rock",
            categoria: "Workshop",
            titulo: "Masterclass: Timbres, Pedais e Riffs Pesados",
            bandaPrincipal: "Diego Vaz (Valquíria de Aço) & Leo Gibson",
            vertenteRock: "Heavy Metal / Hard Rock",
            classificacao: "Livre",
            destaque: false,
            dataISO: "2026-12-09",
            horario: "19h às 22h",
            local: "Estúdio & Café Amplificador",
            enderecoCompleto: "Rua Cardeal Arcoverde, 610 - Pinheiros, São Paulo/SP",
            organizador: "Academia da Guitarra Rock",
            vagasTotais: 90,
            vagasRestantes: 14,
            descricaoCompleta: "Workshop prático sobre regulagem de amplificadores valvulados, cadeia de pedais de distorção e técnicas de palhetada alternada, sweep picking e improvisação no rock."
        },
        {
            id: "feira-vinil-motoclubes",
            categoria: "Encontro Rock",
            titulo: "Feira de Vinil, Couro & Encontro de Motoclubes",
            bandaPrincipal: "Voltagem 77 + Jam Session Aberta",
            vertenteRock: "Classic Rock / Blues Rock",
            classificacao: "Livre",
            destaque: true,
            dataISO: "2026-12-13",
            horario: "11h às 20h",
            local: "Arena Trovão (Pátio Externo)",
            enderecoCompleto: "Av. Marquês de São Vicente, 2100 - Barra Funda, São Paulo/SP",
            organizador: "Irmandade Duas Rodas & Rock",
            vagasTotais: 600,
            vagasRestantes: 275,
            descricaoCompleta: "Domingo inteiro dedicado à cultura rock: mais de 40 expositores de LPs raros, jaquetas customizadas, exposição de motos clássicas, churrasco defumado e show ao vivo da Voltagem 77."
        },
        {
            id: "ritual-doom-nocturno",
            categoria: "Show",
            titulo: "Sinfonia da Meia-Noite: Cripta Sombria",
            bandaPrincipal: "Cripta Sombria + Distrito Fantasma",
            vertenteRock: "Doom Metal / Post-Punk",
            classificacao: "18 anos",
            destaque: false,
            dataISO: "2026-12-18",
            horario: "22h às 03h",
            local: "Caverna Underground Pub",
            enderecoCompleto: "Av. Dom Pedro II, 890 - Bairro Jardim, Santo André/SP",
            organizador: "Noite Escura Produções",
            vagasTotais: 250,
            vagasRestantes: 0,
            descricaoCompleta: "Encontro inédito entre o peso denso da Cripta Sombria e a atmosfera hipnótica do Distrito Fantasma, com iluminação cênica especial e discotecagem Darkwave."
        },
        {
            id: "tributo-monstros-metal",
            categoria: "Tributo",
            titulo: "Monstros do Metal: Iron Maiden, Metallica & Black Sabbath",
            bandaPrincipal: "Valquíria de Aço & Convidados",
            vertenteRock: "Heavy Metal Clássico",
            classificacao: "16 anos",
            destaque: true,
            dataISO: "2026-12-26",
            horario: "20h às 02h",
            local: "Galpão Manifesto Rock",
            enderecoCompleto: "Rua Augusta, 1420 - Consolação, São Paulo/SP",
            organizador: "Produtora Riff Brutal",
            vagasTotais: 600,
            vagasRestantes: 84,
            descricaoCompleta: "Três horas celebrando os maiores hinos da história do Heavy Metal mundial em um especial de fim de ano com som no volume máximo."
        }
    ];

    const inscricoesIniciais = [
        {
            id: 1,
            eventoId: "festival-trovao-2026",
            eventoTitulo: "Festival Trovão de Aço 2026",
            nome: "Beatriz Souza",
            email: "beatriz.rock@email.com",
            setorIngresso: "Pista Premium (Frontstage)",
            dataHora: "01/11/2026 14:32",
            codigoConfirmacao: "ROCK-7F3K2A"
        },
        {
            id: 2,
            eventoId: "noite-grunge-90",
            eventoTitulo: "Noite Grunge: Tributo Anos 90",
            nome: "Lucas Almeida",
            email: "lucas.grunge@email.com",
            setorIngresso: "Pista Rock",
            dataHora: "02/11/2026 19:15",
            codigoConfirmacao: "ROCK-9D1Q7Z"
        },
        {
            id: 3,
            eventoId: "batalha-garagens-final",
            eventoTitulo: "Batalha das Garagens: Grande Final",
            nome: "Marina Costa",
            email: "marina.punk@email.com",
            setorIngresso: "Pista Rock",
            dataHora: "04/11/2026 21:05",
            codigoConfirmacao: "ROCK-2M8T4X"
        },
        {
            id: 4,
            eventoId: "festival-trovao-2026",
            eventoTitulo: "Festival Trovão de Aço 2026",
            nome: "Pedro Henrique",
            email: "pedro.metal@email.com",
            setorIngresso: "Camarote Backstage",
            dataHora: "05/11/2026 11:20",
            codigoConfirmacao: "ROCK-5R6L9B"
        }
    ];

    function lerStorage(chave, padrao) {
        try {
            const salvo = localStorage.getItem(chave);
            if (!salvo) {
                localStorage.setItem(chave, JSON.stringify(padrao));
                return padrao.slice();
            }
            return JSON.parse(salvo);
        } catch (erro) {
            return padrao.slice();
        }
    }

    function salvarStorage(chave, dados) {
        try {
            localStorage.setItem(chave, JSON.stringify(dados));
        } catch (erro) {
            console.warn("Não foi possível salvar no LocalStorage:", erro);
        }
    }

    let eventos = lerStorage(CHAVE_STORAGE_EVENTOS, eventosIniciais);
    let categorias = lerStorage(CHAVE_STORAGE_CATEGORIAS, categoriasIniciais);
    let bandas = lerStorage(CHAVE_STORAGE_BANDAS, bandasIniciais);
    let locais = lerStorage(CHAVE_STORAGE_LOCAIS, locaisIniciais);
    let inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);

    function contarInscricoesDoEvento(evento) {
        return inscricoes.filter(function (ins) {
            return String(ins.eventoId) === String(evento.id) ||
                (evento.idBanco && String(ins.eventoId) === String(evento.idBanco)) ||
                (ins.eventoTitulo && evento.titulo && ins.eventoTitulo === evento.titulo);
        }).length;
    }

    function recalcularVagasReais() {
        eventos = eventos.map(function (evento) {
            const totais = Number(evento.vagasTotais || 0);
            const ocupadas = contarInscricoesDoEvento(evento);
            evento.vagasRestantes = Math.max(0, totais - ocupadas);
            return evento;
        });
    }

    recalcularVagasReais();

    function normalizarEventoDoSupabase(registro) {
        return {
            id: String(registro.slug || registro.id),
            idBanco: registro.id,
            categoria: registro.categoria && registro.categoria.nome ? registro.categoria.nome : (registro.categoria || "Show"),
            titulo: registro.nome || registro.titulo,
            bandaPrincipal: registro.banda_principal || registro.bandaPrincipal || "Atrações Confirmadas",
            vertenteRock: registro.vertente_rock || registro.vertenteRock || "Rock / Metal",
            classificacao: registro.classificacao || "16 anos",
            destaque: Boolean(registro.destaque),
            dataISO: registro.data || registro.dataISO,
            horario: registro.horario || "20h",
            local: registro.local || "Palco Principal",
            enderecoCompleto: registro.endereco || registro.enderecoCompleto || registro.local,
            organizador: registro.responsavel || registro.organizador || "Produção Arena Rock",
            vagasTotais: Number(registro.vagas_totais ?? registro.vagasTotais ?? 100),
            vagasRestantes: Number(registro.vagas_restantes ?? registro.vagasRestantes ?? 100),
            descricaoCompleta: registro.descricao || registro.descricaoCompleta || ""
        };
    }

    async function sincronizarComSupabase() {
        if (!window.supabaseConfigurado || !window.supabaseClient) {
            return eventos;
        }
        try {
            const [resEventos, resBandas, resLocais, resInscricoes, resCategorias] = await Promise.all([
                window.supabaseClient.from("eventos").select("*, categoria:categorias(*)").order("data", { ascending: true }),
                window.supabaseClient.from("bandas").select("*").order("id", { ascending: true }),
                window.supabaseClient.from("locais").select("*").order("id", { ascending: true }),
                window.supabaseClient.from("inscricoes").select("*, evento:eventos(nome, slug)").order("id", { ascending: false }),
                window.supabaseClient.from("categorias").select("*").order("id", { ascending: true })
            ]);

            if (!resEventos.error && resEventos.data) {
                eventos = resEventos.data.map(normalizarEventoDoSupabase);
                salvarStorage(CHAVE_STORAGE_EVENTOS, eventos);
            }

            if (!resCategorias.error && resCategorias.data && resCategorias.data.length > 0) {
                categorias = resCategorias.data;
                salvarStorage(CHAVE_STORAGE_CATEGORIAS, categorias);
            }

            if (!resBandas.error && resBandas.data && resBandas.data.length > 0) {
                bandas = resBandas.data;
                salvarStorage(CHAVE_STORAGE_BANDAS, bandas);
            }

            if (!resLocais.error && resLocais.data && resLocais.data.length > 0) {
                locais = resLocais.data.map(function (loc) {
                    return {
                        id: loc.id,
                        nome: loc.nome,
                        endereco: loc.endereco,
                        bairroCidade: loc.bairro_cidade || loc.bairroCidade || "",
                        capacidade: loc.capacidade,
                        estrutura: loc.estrutura,
                        descricao: loc.descricao
                    };
                });
                salvarStorage(CHAVE_STORAGE_LOCAIS, locais);
            }

            if (!resInscricoes.error && resInscricoes.data) {
                inscricoes = resInscricoes.data.map(function (ins) {
                    const dataCriacao = ins.criado_em ? new Date(ins.criado_em) : new Date();
                    return {
                        id: ins.id,
                        eventoId: ins.evento && ins.evento.slug ? ins.evento.slug : ins.evento_id,
                        eventoTitulo: ins.evento && ins.evento.nome ? ins.evento.nome : "Show Arena Rock",
                        nome: ins.nome,
                        email: ins.email,
                        setorIngresso: ins.setor_ingresso || "Pista Rock",
                        dataHora: dataCriacao.toLocaleDateString("pt-BR") + " " + dataCriacao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                        codigoConfirmacao: ins.codigo_confirmacao
                    };
                });
                salvarStorage(CHAVE_STORAGE_INSCRICOES, inscricoes);
            }

            recalcularVagasReais();
            salvarStorage(CHAVE_STORAGE_EVENTOS, eventos);
        } catch (erro) {
            console.warn("Usando dados locais como fallback:", erro);
        }
        return eventos;
    }

    function listarEventos() {
        eventos = lerStorage(CHAVE_STORAGE_EVENTOS, eventosIniciais);
        inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);
        recalcularVagasReais();
        return eventos.slice();
    }

    function listarCategorias() {
        categorias = lerStorage(CHAVE_STORAGE_CATEGORIAS, categoriasIniciais);
        return categorias.slice();
    }

    function listarBandas() {
        bandas = lerStorage(CHAVE_STORAGE_BANDAS, bandasIniciais);
        return bandas.slice();
    }

    function listarLocais() {
        locais = lerStorage(CHAVE_STORAGE_LOCAIS, locaisIniciais);
        return locais.slice();
    }

    function listarInscricoes() {
        inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);
        return inscricoes.slice();
    }

    function buscarEventoPorId(id) {
        eventos = lerStorage(CHAVE_STORAGE_EVENTOS, eventosIniciais);
        inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);
        recalcularVagasReais();
        return eventos.find(function (evento) {
            return String(evento.id) === String(id) || String(evento.idBanco) === String(id);
        });
    }

    function filtrarEventos(filtros) {
        eventos = lerStorage(CHAVE_STORAGE_EVENTOS, eventosIniciais);
        inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);
        recalcularVagasReais();
        const termo = (filtros && filtros.termo ? filtros.termo : "").trim().toLowerCase();
        const categoria = filtros && filtros.categoria ? filtros.categoria : "";

        return eventos.filter(function (evento) {
            const bateTermo = !termo ||
                evento.titulo.toLowerCase().includes(termo) ||
                (evento.bandaPrincipal && evento.bandaPrincipal.toLowerCase().includes(termo)) ||
                (evento.vertenteRock && evento.vertenteRock.toLowerCase().includes(termo)) ||
                (evento.local && evento.local.toLowerCase().includes(termo));
            const bateCategoria = !categoria || categoria === "todos" || evento.categoria === categoria;
            return bateTermo && bateCategoria;
        });
    }

    function formatarData(dataISO) {
        if (!dataISO) return "";
        const partes = dataISO.split("-");
        if (partes.length < 3) return dataISO;
        const ano = partes[0];
        const mes = MESES[Number(partes[1]) - 1] || partes[1];
        const dia = Number(partes[2]);
        return dia + " de " + mes + ". " + ano;
    }

    function calcularPercentualOcupacao(evento) {
        if (!evento.vagasTotais || evento.vagasTotais <= 0) return 100;
        const ocupadas = evento.vagasTotais - evento.vagasRestantes;
        return Math.min(100, Math.max(0, Math.round((ocupadas / evento.vagasTotais) * 100)));
    }

    function gerarCodigoConfirmacao() {
        return "ROCK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    }

    async function inscreverEvento(eventoId, dados) {
        const evento = buscarEventoPorId(eventoId);
        if (!evento) {
            return { sucesso: false };
        }

        if (evento.vagasRestantes > 0) {
            evento.vagasRestantes -= 1;
            salvarStorage(CHAVE_STORAGE_EVENTOS, eventos);
        }

        const codigo = gerarCodigoConfirmacao();
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString("pt-BR") + " " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        const novaInscricao = {
            id: Date.now(),
            eventoId: evento.id,
            eventoTitulo: evento.titulo,
            nome: dados.nome,
            email: dados.email,
            setorIngresso: dados.setorIngresso || "Pista Rock",
            dataHora: dataFormatada,
            codigoConfirmacao: codigo
        };

        inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);
        inscricoes.unshift(novaInscricao);
        salvarStorage(CHAVE_STORAGE_INSCRICOES, inscricoes);

        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                await window.supabaseClient.from("inscricoes").insert({
                    evento_id: evento.idBanco || null,
                    nome: dados.nome,
                    email: dados.email,
                    setor_ingresso: dados.setorIngresso || "Pista Rock",
                    codigo_confirmacao: codigo
                });
                if (evento.idBanco) {
                    await window.supabaseClient
                        .from("eventos")
                        .update({ vagas_restantes: evento.vagasRestantes })
                        .eq("id", evento.idBanco);
                }
            } catch (erro) {
                console.warn("Inscrição salva localmente:", erro);
            }
        }

        return {
            sucesso: true,
            codigoConfirmacao: codigo,
            evento: evento,
            nome: dados.nome,
            email: dados.email,
            setorIngresso: novaInscricao.setorIngresso
        };
    }

    function buscarInscricaoPorCodigoOuEmail(termo) {
        inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);
        const busca = (termo || "").trim().toLowerCase();
        if (!busca) return [];
        return inscricoes.filter(function (item) {
            return item.codigoConfirmacao.toLowerCase() === busca ||
                item.email.toLowerCase() === busca;
        });
    }

    function adicionarEventoLocal(novoEvento) {
        eventos = lerStorage(CHAVE_STORAGE_EVENTOS, eventosIniciais);
        eventos.unshift(novoEvento);
        salvarStorage(CHAVE_STORAGE_EVENTOS, eventos);
        return novoEvento;
    }

    function removerEventoLocal(id) {
        eventos = lerStorage(CHAVE_STORAGE_EVENTOS, eventosIniciais);
        eventos = eventos.filter(function (ev) {
            return String(ev.id) !== String(id) && String(ev.idBanco) !== String(id);
        });
        salvarStorage(CHAVE_STORAGE_EVENTOS, eventos);
    }

    function adicionarCategoriaLocal(novaCat) {
        categorias = lerStorage(CHAVE_STORAGE_CATEGORIAS, categoriasIniciais);
        categorias.push(novaCat);
        salvarStorage(CHAVE_STORAGE_CATEGORIAS, categorias);
        return novaCat;
    }

    function removerCategoriaLocal(slugOuId) {
        categorias = lerStorage(CHAVE_STORAGE_CATEGORIAS, categoriasIniciais);
        categorias = categorias.filter(function (cat) {
            return String(cat.id) !== String(slugOuId) && cat.slug !== slugOuId;
        });
        salvarStorage(CHAVE_STORAGE_CATEGORIAS, categorias);
    }

    function removerInscricaoLocal(id) {
        inscricoes = lerStorage(CHAVE_STORAGE_INSCRICOES, inscricoesIniciais);
        const removida = inscricoes.find(function (item) {
            return String(item.id) === String(id);
        });
        inscricoes = inscricoes.filter(function (item) {
            return String(item.id) !== String(id);
        });
        salvarStorage(CHAVE_STORAGE_INSCRICOES, inscricoes);

        if (removida) {
            eventos = lerStorage(CHAVE_STORAGE_EVENTOS, eventosIniciais);
            const evento = eventos.find(function (ev) {
                return String(ev.id) === String(removida.eventoId) || String(ev.idBanco) === String(removida.eventoId);
            });
            if (evento && evento.vagasRestantes < evento.vagasTotais) {
                evento.vagasRestantes += 1;
                salvarStorage(CHAVE_STORAGE_EVENTOS, eventos);
                return evento;
            }
        }
        return null;
    }

    function inicializarMenuMobile() {
        const botaoMenu = document.getElementById("botao-menu-mobile");
        const menuNavegacao = document.getElementById("menu-navegacao") || document.querySelector(".navegacao");
        const fundoMenu = document.getElementById("fundo-menu-mobile");

        if (!botaoMenu || !menuNavegacao || botaoMenu.dataset.inicializado === "sim") {
            return;
        }
        botaoMenu.dataset.inicializado = "sim";

        function alternarMenu() {
            const aberto = menuNavegacao.classList.toggle("aberto");
            botaoMenu.classList.toggle("ativo", aberto);
            botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
            document.body.style.overflow = aberto ? "hidden" : "";
            if (fundoMenu) {
                fundoMenu.classList.toggle("visivel", aberto);
            }
        }

        function fecharMenu() {
            menuNavegacao.classList.remove("aberto");
            botaoMenu.classList.remove("ativo");
            botaoMenu.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
            if (fundoMenu) {
                fundoMenu.classList.remove("visivel");
            }
        }

        botaoMenu.addEventListener("click", alternarMenu);
        if (fundoMenu) {
            fundoMenu.addEventListener("click", fecharMenu);
        }

        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape" && menuNavegacao.classList.contains("aberto")) {
                fecharMenu();
            }
        });

        menuNavegacao.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", fecharMenu);
        });
    }

    function inicializarEfeitoHero() {
        const secoesHero = document.querySelectorAll(".secao-destaque");
        secoesHero.forEach(function (hero) {
            if (hero.dataset.efeitoHero === "sim") {
                return;
            }
            hero.dataset.efeitoHero = "sim";

            let quadroPendente = false;
            let ultimoX = 0;
            let ultimoY = 0;

            hero.addEventListener("pointermove", function (evento) {
                const retangulo = hero.getBoundingClientRect();
                ultimoX = evento.clientX - retangulo.left;
                ultimoY = evento.clientY - retangulo.top;
                const nx = retangulo.width ? (ultimoX / retangulo.width) * 2 - 1 : 0;
                const ny = retangulo.height ? (ultimoY / retangulo.height) * 2 - 1 : 0;

                if (!quadroPendente) {
                    quadroPendente = true;
                    requestAnimationFrame(function () {
                        hero.style.setProperty("--mouse-x", ultimoX + "px");
                        hero.style.setProperty("--mouse-y", ultimoY + "px");
                        hero.style.setProperty("--tilt-x", (-ny * 24).toFixed(2) + "deg");
                        hero.style.setProperty("--tilt-y", (nx * 24).toFixed(2) + "deg");
                        quadroPendente = false;
                    });
                }
            });

            hero.addEventListener("pointerleave", function () {
                hero.style.removeProperty("--mouse-x");
                hero.style.removeProperty("--mouse-y");
                hero.style.removeProperty("--tilt-x");
                hero.style.removeProperty("--tilt-y");
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            inicializarMenuMobile();
            inicializarEfeitoHero();
        });
    } else {
        inicializarMenuMobile();
        inicializarEfeitoHero();
    }

    const CAPAS_CARDS = [
        "./assets/images/cards/capa-festival.png",
        "./assets/images/cards/capa-show.png",
        "./assets/images/cards/capa-tributo.png",
        "./assets/images/cards/capa-batalha.png",
        "./assets/images/cards/capa-workshop.png",
        "./assets/images/cards/capa-palco.png"
    ];

    function obterCapaEvento(evento) {
        if (evento && evento.imagem) {
            return evento.imagem;
        }
        const slug = evento && evento.id ? String(evento.id).toLowerCase() : "";
        if (slug === "ritual-doom-nocturno") {
            return "./assets/images/cards/capa-palco.png";
        }
        if (slug === "tributo-monstros-metal") {
            return "./assets/images/cards/capa-show.png";
        }
        const categoria = evento && evento.categoria ? String(evento.categoria).toLowerCase() : "";
        if (categoria.includes("festival")) return "./assets/images/cards/capa-festival.png";
        if (categoria.includes("tributo")) return "./assets/images/cards/capa-tributo.png";
        if (categoria.includes("batalha")) return "./assets/images/cards/capa-batalha.png";
        if (categoria.includes("workshop")) return "./assets/images/cards/capa-workshop.png";
        if (categoria.includes("encontro")) return "./assets/images/cards/capa-palco.png";
        return "./assets/images/cards/capa-show.png";
    }

    function obterCapaBanda(banda, indice) {
        if (banda && banda.imagem) {
            return banda.imagem;
        }
        const mapaPorSlug = {
            "valquiria-de-aco": "./assets/images/cards/capa-show.png",
            "furia-subterranea": "./assets/images/cards/capa-batalha.png",
            "eco-de-seattle": "./assets/images/cards/capa-tributo.png",
            "voltagem-77": "./assets/images/cards/capa-festival.png",
            "cripta-sombria": "./assets/images/cards/capa-palco.png",
            "distrito-fantasma": "./assets/images/cards/capa-workshop.png"
        };
        const slug = banda && (banda.slug || banda.id) ? String(banda.slug || banda.id).toLowerCase() : "";
        if (mapaPorSlug[slug]) {
            return mapaPorSlug[slug];
        }
        const idx = Math.abs(Number(indice || 0)) % CAPAS_CARDS.length;
        return CAPAS_CARDS[idx];
    }

    function obterCapaLocal(local, indice) {
        if (local && local.imagem) {
            return local.imagem;
        }
        const chave = local ? (String(local.id || "") + " " + String(local.nome || "")).toLowerCase() : "";
        if (chave.includes("arena") || chave.includes("trovao")) return "./assets/images/cards/capa-festival.png";
        if (chave.includes("galpao") || chave.includes("manifesto")) return "./assets/images/cards/capa-batalha.png";
        if (chave.includes("caverna") || chave.includes("pub")) return "./assets/images/cards/capa-palco.png";
        if (chave.includes("estudio") || chave.includes("amplificador")) return "./assets/images/cards/capa-workshop.png";
        const idx = Math.abs(Number(indice || 0)) % CAPAS_CARDS.length;
        return CAPAS_CARDS[idx];
    }

    function obterIconeSVG(nome) {
        const icones = {
            pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
            calendario: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
            relogio: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
            musica: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
            guitarra: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
            usuarios: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            raio: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
        };
        return icones[nome] || icones.musica;
    }

    function criarMidiaVitrine(srcImagem, altImagem, etiquetaTexto, seloTexto, classeSeloExtra) {
        const midia = document.createElement("div");
        midia.className = "midia-cartao";

        const img = document.createElement("img");
        img.className = "imagem-cartao";
        img.src = srcImagem;
        img.alt = altImagem || "";
        img.loading = "lazy";
        midia.appendChild(img);

        if (seloTexto) {
            const selo = document.createElement("span");
            selo.className = "selo-topo-cartao" + (classeSeloExtra ? " " + classeSeloExtra : "");
            if (classeSeloExtra !== "esgotado") {
                selo.innerHTML = obterIconeSVG("raio");
            }
            selo.appendChild(document.createTextNode(seloTexto));
            midia.appendChild(selo);
        }

        if (etiquetaTexto) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "etiqueta-midia-cartao";
            etiqueta.textContent = etiquetaTexto;
            midia.appendChild(etiqueta);
        }

        return midia;
    }

    function criarMetaIcone(nomeIcone, texto, classeExtra) {
        const item = document.createElement("span");
        item.className = "item-meta-icone" + (classeExtra ? " " + classeExtra : "");
        item.innerHTML = obterIconeSVG(nomeIcone);
        const spanTexto = document.createElement("span");
        spanTexto.textContent = texto || "";
        item.appendChild(spanTexto);
        return item;
    }

    return {
        sincronizarComSupabase: sincronizarComSupabase,
        listarEventos: listarEventos,
        listarCategorias: listarCategorias,
        listarBandas: listarBandas,
        listarLocais: listarLocais,
        listarInscricoes: listarInscricoes,
        buscarEventoPorId: buscarEventoPorId,
        filtrarEventos: filtrarEventos,
        formatarData: formatarData,
        calcularPercentualOcupacao: calcularPercentualOcupacao,
        inscreverEvento: inscreverEvento,
        buscarInscricaoPorCodigoOuEmail: buscarInscricaoPorCodigoOuEmail,
        adicionarEventoLocal: adicionarEventoLocal,
        removerEventoLocal: removerEventoLocal,
        adicionarCategoriaLocal: adicionarCategoriaLocal,
        removerCategoriaLocal: removerCategoriaLocal,
        removerInscricaoLocal: removerInscricaoLocal,
        obterCapaEvento: obterCapaEvento,
        obterCapaBanda: obterCapaBanda,
        obterCapaLocal: obterCapaLocal,
        obterIconeSVG: obterIconeSVG,
        criarMidiaVitrine: criarMidiaVitrine,
        criarMetaIcone: criarMetaIcone
    };
})();
