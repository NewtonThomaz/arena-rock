-- Migration: Simulação de compras de ingressos - Lote 2 (Batalha das Garagens, Masterclass e Feira de Vinil)

INSERT INTO public.inscricoes (
    evento_id,
    nome,
    email,
    setor_ingresso,
    codigo_confirmacao,
    checkin,
    checkin_em,
    criado_em
)
SELECT
    e.id,
    v.nome,
    v.email,
    v.setor_ingresso,
    v.codigo_confirmacao,
    v.checkin,
    v.checkin_em::TIMESTAMPTZ,
    v.criado_em::TIMESTAMPTZ
FROM (
    VALUES
        -- Batalha das Garagens: Grande Final (16 compradores)
        ('batalha-das-garagens-grande-final', 'Lucas Nascimento', 'lucas.nascimento@arenarock.com', 'Pista Rock', 'ROCK-BG01D5', true, '2026-11-28T18:10:00-03:00', '2026-10-28T13:15:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Beatriz Santana', 'beatriz.santana@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-BG02E9', true, '2026-11-28T18:22:00-03:00', '2026-10-29T16:40:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Paulo Ricardo', 'paulo.ricardo@arenarock.com', 'Pista Rock', 'ROCK-BG03F3', false, NULL, '2026-10-30T19:50:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Giovanna Araujo', 'giovanna.araujo@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-BG04G8', true, '2026-11-28T18:40:00-03:00', '2026-11-01T11:25:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Renan Albuquerque', 'renan.albuquerque@arenarock.com', 'Pista Rock', 'ROCK-BG05H2', false, NULL, '2026-11-03T14:12:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Camila Bastos', 'camila.bastos@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-BG06J6', true, '2026-11-28T18:55:00-03:00', '2026-11-05T18:05:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Danilo Macedo', 'danilo.macedo@arenarock.com', 'Pista Rock', 'ROCK-BG07K4', false, NULL, '2026-11-07T20:30:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Helena Soares', 'helena.soares@arenarock.com', 'Pista Rock', 'ROCK-BG08L1', true, '2026-11-28T19:12:00-03:00', '2026-11-09T10:45:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Otavio Ribeiro', 'otavio.ribeiro@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-BG09M7', false, NULL, '2026-11-11T15:18:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Luiza Freitas', 'luiza.freitas@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-BG10N3', true, '2026-11-28T19:28:00-03:00', '2026-11-13T22:10:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Matheus Rezende', 'matheus.rezende@arenarock.com', 'Pista Rock', 'ROCK-BG11P9', false, NULL, '2026-11-15T12:00:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Thais Cavalcante', 'thais.cavalcante@arenarock.com', 'Pista Rock', 'ROCK-BG12Q5', false, NULL, '2026-11-17T17:33:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Guilherme Assis', 'guilherme.assis@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-BG13R2', false, NULL, '2026-11-19T21:48:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Elisa Camargo', 'elisa.camargo@arenarock.com', 'Pista Rock', 'ROCK-BG14S8', false, NULL, '2026-11-21T14:22:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Fabio Medeiros', 'fabio.medeiros@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-BG15T4', false, NULL, '2026-11-22T19:07:00-03:00'),
        ('batalha-das-garagens-grande-final', 'Nicole Viana', 'nicole.viana@arenarock.com', 'Pista Rock', 'ROCK-BG16U1', false, NULL, '2026-11-24T11:39:00-03:00'),

        -- Masterclass de Guitarra: Timbres, Pedais e Riffs Pesados (18 compradores)
        ('masterclass-guitarra-timbres-riffs', 'Arthur Machado', 'arthur.machado@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-MG01E8', true, '2026-12-09T19:04:00-03:00', '2026-11-02T09:15:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Clarice Magalhaes', 'clarice.magalhaes@arenarock.com', 'Pista Rock', 'ROCK-MG02F4', true, '2026-12-09T19:10:00-03:00', '2026-11-03T13:40:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Douglas Martins', 'douglas.martins@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-MG03G9', true, '2026-12-09T19:16:00-03:00', '2026-11-05T17:20:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Evelyn Carvalho', 'evelyn.carvalho@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-MG04H5', false, NULL, '2026-11-06T20:10:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Heitor Santana', 'heitor.santana@arenarock.com', 'Pista Rock', 'ROCK-MG05J1', true, '2026-12-09T19:22:00-03:00', '2026-11-08T11:55:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Jonas Ferreira', 'jonas.ferreira@arenarock.com', 'Pista Rock', 'ROCK-MG06K7', false, NULL, '2026-11-09T15:30:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Katia Rodrigues', 'katia.rodrigues@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-MG07L3', true, '2026-12-09T19:29:00-03:00', '2026-11-11T18:45:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Luan Teixeira', 'luan.teixeira@arenarock.com', 'Pista Rock', 'ROCK-MG08M6', false, NULL, '2026-11-12T22:05:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Milena Duarte', 'milena.duarte@arenarock.com', 'Pista Rock', 'ROCK-MG09N2', true, '2026-12-09T19:35:00-03:00', '2026-11-14T10:12:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Nelson Almeida', 'nelson.almeida@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-MG10P8', false, NULL, '2026-11-15T16:40:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Olivia Bezerra', 'olivia.bezerra@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-MG11Q4', true, '2026-12-09T19:42:00-03:00', '2026-11-17T19:15:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Pedro Henrique Dias', 'pedro.dias@arenarock.com', 'Pista Rock', 'ROCK-MG12R9', false, NULL, '2026-11-18T12:30:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Rafaela Correia', 'rafaela.correia@arenarock.com', 'Pista Rock', 'ROCK-MG13S5', false, NULL, '2026-11-19T21:18:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Sandro Nunes', 'sandro.nunes@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-MG14T1', true, '2026-12-09T19:50:00-03:00', '2026-11-20T14:52:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Tereza Fonseca', 'tereza.fonseca@arenarock.com', 'Pista Rock', 'ROCK-MG15U7', false, NULL, '2026-11-21T17:09:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Ulisses Gomes', 'ulisses.gomes@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-MG16V3', false, NULL, '2026-11-22T20:24:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Viviane Borges', 'viviane.borges@arenarock.com', 'Pista Rock', 'ROCK-MG17W6', false, NULL, '2026-11-23T11:37:00-03:00'),
        ('masterclass-guitarra-timbres-riffs', 'Wesley Araujo', 'wesley.araujo@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-MG18X2', false, NULL, '2026-11-24T18:11:00-03:00'),

        -- Feira de Vinil, Couro & Encontro de Motoclubes (15 compradores)
        ('feira-vinil-encontro-motoclubes', 'Adriano Coutinho', 'adriano.coutinho@arenarock.com', 'Pista Rock', 'ROCK-FV01G7', true, '2026-12-13T11:15:00-03:00', '2026-11-04T10:30:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Barbara Rezende', 'barbara.rezende@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FV02H3', true, '2026-12-13T11:30:00-03:00', '2026-11-06T14:50:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Cesar Augusto', 'cesar.augusto@arenarock.com', 'Pista Rock', 'ROCK-FV03J9', false, NULL, '2026-11-07T19:15:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Daniela Moura', 'daniela.moura@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FV04K5', true, '2026-12-13T11:48:00-03:00', '2026-11-09T12:40:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Emerson Lopes', 'emerson.lopes@arenarock.com', 'Pista Rock', 'ROCK-FV05L1', false, NULL, '2026-11-11T17:25:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Flavia Barros', 'flavia.barros@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FV06M8', true, '2026-12-13T12:05:00-03:00', '2026-11-13T21:10:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Gilberto Souza', 'gilberto.souza@arenarock.com', 'Pista Rock', 'ROCK-FV07N4', false, NULL, '2026-11-14T15:02:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Heloisa Marques', 'heloisa.marques@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FV08P2', true, '2026-12-13T12:22:00-03:00', '2026-11-16T09:45:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Ivanildo Pereira', 'ivanildo.pereira@arenarock.com', 'Pista Rock', 'ROCK-FV09Q6', false, NULL, '2026-11-18T18:30:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Jessica Teixeira', 'jessica.teixeira@arenarock.com', 'Pista Rock', 'ROCK-FV10R3', true, '2026-12-13T12:40:00-03:00', '2026-11-19T22:15:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Kleber Monteiro', 'kleber.monteiro@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FV11S9', false, NULL, '2026-11-20T13:18:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Livia Cardoso', 'livia.cardoso@arenarock.com', 'Pista Rock', 'ROCK-FV12T5', false, NULL, '2026-11-21T16:42:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Mauricio Pires', 'mauricio.pires@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FV13U1', false, NULL, '2026-11-22T20:09:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Nadia Farias', 'nadia.farias@arenarock.com', 'Pista Rock', 'ROCK-FV14V7', false, NULL, '2026-11-23T14:55:00-03:00'),
        ('feira-vinil-encontro-motoclubes', 'Orlando Batista', 'orlando.batista@arenarock.com', 'Pista Rock', 'ROCK-FV15W4', false, NULL, '2026-11-24T19:33:00-03:00')
) AS v(slug_evento, nome, email, setor_ingresso, codigo_confirmacao, checkin, checkin_em, criado_em)
JOIN public.eventos e ON e.slug = v.slug_evento
ON CONFLICT (codigo_confirmacao) DO NOTHING;
