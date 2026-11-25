-- Migration: Adiciona capa personalizada em eventos e controle de check-in em inscricoes
ALTER TABLE public.eventos ADD COLUMN IF NOT EXISTS imagem TEXT;
ALTER TABLE public.inscricoes ADD COLUMN IF NOT EXISTS checkin BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.inscricoes ADD COLUMN IF NOT EXISTS checkin_em TIMESTAMPTZ;
