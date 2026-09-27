CREATE DATABASE IF NOT EXISTS financeiro_db;
USE financeiro_db;

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    nome VARCHAR(50) NOT NULL,
    icone VARCHAR(50) NULL,
    tipo ENUM('RECEITA', 'DESPESA', 'AMBOS') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. Tabela de Transações
CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    descricao VARCHAR(250) NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo ENUM('RECEITA', 'DESPESA') NOT NULL,
    forma_pagamento VARCHAR(50) NULL,
    data_transacao DATE NOT NULL,
    recorrente BOOLEAN DEFAULT FALSE,
    frequencia ENUM('DIARIO', 'SEMANAL', 'MENSAL', 'ANUAL') NULL,
    intervalo INT DEFAULT 1,
    data_fim DATE NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- 4. Tabela de Exceções de Recorrência
CREATE TABLE IF NOT EXISTS transacao_excecoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transacao_pai_id BIGINT NOT NULL,
    data_original DATE NOT NULL,
    nova_data DATE NULL,
    novo_valor DECIMAL(10,2) NULL,
    cancelado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (transacao_pai_id) REFERENCES transacoes(id) ON DELETE CASCADE
);

-- Categorias Padrão do Sistema
INSERT INTO categorias (usuario_id, nome, icone, tipo) VALUES
(NULL, 'Ajuste de Saldo', 'sliders', 'RECEITA'),
(NULL, 'Alimentação', 'utensils', 'DESPESA'),
(NULL, 'Transporte', 'car', 'DESPESA'),
(NULL, 'Moradia', 'home', 'DESPESA'),
(NULL, 'Salário', 'briefcase', 'RECEITA'),
(NULL, 'Investimentos', 'trending-up', 'AMBOS');