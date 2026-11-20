-- Migration: Dados iniciais de usuarios
INSERT INTO public.usuarios (nome, email, senha, papel, status) VALUES
    ('Admin Arena Rock', 'admin@arenarock.com.br', 'rock2026', 'administrador', 'ativo'),
    ('Rodrigo "Riff" Mendes', 'rodrigo@arenarock.com.br', 'rock2026', 'administrador', 'ativo'),
    ('Camila Rocha', 'camila@arenarock.com.br', 'rock2026', 'administrador', 'ativo'),
    ('Equipe Bilheteria Manifesto', 'bilheteria@arenarock.com.br', 'rock2026', 'usuario', 'ativo')
ON CONFLICT (email) DO NOTHING;
