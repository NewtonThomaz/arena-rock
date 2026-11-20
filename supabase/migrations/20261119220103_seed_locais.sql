-- Migration: Dados iniciais de locais
INSERT INTO public.locais (nome, endereco, bairro_cidade, capacidade, estrutura, descricao) VALUES
    ('Galpão Manifesto Rock', 'Rua Augusta, 1420', 'Consolação - São Paulo/SP', 600, 'Palco duplo, bar artesanal, área fumante e loja de merchan', 'O templo underground para shows de metal, punk e festivais independentes no coração da cidade.'),
    ('Caverna Underground Pub', 'Av. Dom Pedro II, 890', 'Bairro Jardim - Santo André/SP', 250, 'Sistema de som PA valvulado, sinuca e cervejas especiais', 'Pub intimista com acústica impecável e parede coberta por pôsteres históricos do rock mundial.'),
    ('Arena Trovão', 'Av. Marquês de São Vicente, 2100', 'Barra Funda - São Paulo/SP', 2500, 'Arena coberta, camarotes, pista premium e praça de food trucks', 'Espaço de grande porte preparado para grandes festivais de rock, pirotecnia e shows internacionais.'),
    ('Estúdio & Café Amplificador', 'Rua Cardeal Arcoverde, 610', 'Pinheiros - São Paulo/SP', 120, 'Estúdio de gravação, auditório para workshops e feira de vinil', 'Ponto de encontro de músicos e fãs para masterclasses de guitarra, bateria, luthieria e audições de álbuns.')
ON CONFLICT DO NOTHING;
