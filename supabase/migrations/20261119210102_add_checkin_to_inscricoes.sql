-- Migration: Adiciona flag booleana de check-in na tabela inscricoes
ALTER TABLE public.inscricoes ADD COLUMN IF NOT EXISTS checkin BOOLEAN NOT NULL DEFAULT FALSE;
