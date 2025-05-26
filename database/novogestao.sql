-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 26/05/2025 às 13:10
-- Versão do servidor: 8.3.0
-- Versão do PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `novogestao`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_05_23_134513_add_deleted_at_to_users_table', 2),
(5, '2025_05_23_134950_add_deleted_at_to_users_table', 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('EadtWYW8tbNVOPkdTiHBut0u5ADantOUDCy78qT5', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoieEc1THA4TFpNSmRtQ0F2aE1hZHdvZ1QxN0plSlMzSXRiM2VEMlY5biI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozMToiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2NhZGFzdHJvcyI7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMxOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvY2FkYXN0cm9zIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1748026204),
('yBRGrxh3remb9PUUpfr5araUCwp1xI1Rb8wyFrcF', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiWTh2SmJXMTFqdWdDYU5JRzJ0UVJCM2lOTk5LbWZCc2dySnJIT01MeCI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMxOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvY2FkYXN0cm9zIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1748264891);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_aluno`
--

DROP TABLE IF EXISTS `tb_aluno`;
CREATE TABLE IF NOT EXISTS `tb_aluno` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_escolas` bigint NOT NULL,
  `fk_series` bigint NOT NULL,
  `fk_aluno_categoria` bigint NOT NULL DEFAULT '1',
  `nome` varchar(255) DEFAULT NULL,
  `dt_nascimento` date DEFAULT NULL,
  `colegio_atual` varchar(255) DEFAULT NULL,
  `inclusao` int NOT NULL DEFAULT '0',
  `dt_insert` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_tb_aluno_tb_escolas1` (`fk_escolas`),
  KEY `fk_tb_aluno_tb_series1` (`fk_series`),
  KEY `fk_tb_aluno_tb_aluno_categoria1` (`fk_aluno_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_aluno`
--

INSERT INTO `tb_aluno` (`id`, `fk_escolas`, `fk_series`, `fk_aluno_categoria`, `nome`, `dt_nascimento`, `colegio_atual`, `inclusao`, `dt_insert`, `status`) VALUES
(1, 2, 17, 1, 'TESTE 12', NULL, NULL, 0, '2025-05-20 18:06:05', '0'),
(4, 2, 7, 1, 'TESTE 3', '2020-12-04', NULL, 1, '2025-05-21 18:05:17', '1'),
(5, 2, 11, 1, 'TESTE 4', '2016-08-04', NULL, 1, '2025-05-21 18:06:05', '1'),
(6, 2, 10, 1, 'daspjdopajop', '2022-05-05', 'sdadasdas', 1, '2025-05-22 18:09:22', '1');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_aluno_categoria`
--

DROP TABLE IF EXISTS `tb_aluno_categoria`;
CREATE TABLE IF NOT EXISTS `tb_aluno_categoria` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `status` varchar(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_aluno_categoria`
--

INSERT INTO `tb_aluno_categoria` (`id`, `nome`, `status`) VALUES
(1, 'Não definido', '1'),
(2, 'Matriculado', '1'),
(3, 'Não matriculado', '1'),
(4, 'Já é aluno', '1'),
(5, 'Bolsa', '0');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_cadastro`
--

DROP TABLE IF EXISTS `tb_cadastro`;
CREATE TABLE IF NOT EXISTS `tb_cadastro` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_indique` bigint NOT NULL DEFAULT '1',
  `fk_responsavel` bigint DEFAULT NULL,
  `atendente` bigint NOT NULL DEFAULT '0',
  `fk_situacao` bigint NOT NULL,
  `fk_origens` bigint NOT NULL,
  `forma_contato` varchar(50) DEFAULT NULL,
  `codigo` varchar(15) DEFAULT NULL COMMENT 'Código da Matrícula',
  `dt_agenda` date DEFAULT NULL,
  `dt_retorno` date DEFAULT NULL,
  `horario_agenda` varchar(10) DEFAULT NULL,
  `campanha_atual` int DEFAULT NULL,
  `sms_cobranca` int NOT NULL DEFAULT '0',
  `sms_lembrete` varchar(1) DEFAULT '0',
  `sms_pesquisa` varchar(1) DEFAULT '0',
  `dt_insert` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dt_update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_tb_cadastro_tb_situacao1_idx` (`fk_situacao`),
  KEY `fk_tb_cadastro_tb_origens1_idx` (`fk_origens`),
  KEY `fk_tb_cadastro_tb_responsavel1` (`fk_responsavel`),
  KEY `fk_tb_cadastro_tb_indique1` (`fk_indique`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_cadastro`
--

INSERT INTO `tb_cadastro` (`id`, `fk_indique`, `fk_responsavel`, `atendente`, `fk_situacao`, `fk_origens`, `forma_contato`, `codigo`, `dt_agenda`, `dt_retorno`, `horario_agenda`, `campanha_atual`, `sms_cobranca`, `sms_lembrete`, `sms_pesquisa`, `dt_insert`, `dt_update`, `status`) VALUES
(2, 1, NULL, 0, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '0', '2025-05-20 18:06:57', '2025-05-23 11:48:32', '0'),
(5, 1, 4, 0, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '0', '2025-05-21 18:05:17', '2025-05-21 15:05:17', '1'),
(6, 1, 5, 0, 3, 7, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '0', '2025-05-21 18:06:05', '2025-05-21 15:06:05', '1'),
(7, 1, 6, 0, 3, 1, NULL, NULL, '2025-05-23', '2025-05-21', '10:00', NULL, 0, '0', '0', '2025-05-22 18:09:22', '2025-05-22 15:39:30', '1');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_escolas`
--

DROP TABLE IF EXISTS `tb_escolas`;
CREATE TABLE IF NOT EXISTS `tb_escolas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cod_escola` int DEFAULT NULL COMMENT 'Código enviado pela APS',
  `sigla` varchar(200) NOT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `page` varchar(45) DEFAULT NULL,
  `endereco` varchar(150) DEFAULT NULL,
  `telefone` varchar(45) DEFAULT NULL,
  `maps` varchar(200) NOT NULL,
  `whats_comtele` varchar(200) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_escolas`
--

INSERT INTO `tb_escolas` (`id`, `cod_escola`, `sigla`, `nome`, `page`, `endereco`, `telefone`, `maps`, `whats_comtele`, `status`) VALUES
(1, NULL, '', 'NÃO DEFINIDO', NULL, NULL, NULL, '', '', 1),
(2, 1, '', 'COLÉGIO VINÍCIUS DE MORAES', NULL, 'R. Brg. Vilela Júnior, 179 - Vila Nova Cachoeirinha, São Paulo - SP', '+55 (11) 3989-2921', '', '', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_forma_contato`
--

DROP TABLE IF EXISTS `tb_forma_contato`;
CREATE TABLE IF NOT EXISTS `tb_forma_contato` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_indique`
--

DROP TABLE IF EXISTS `tb_indique`;
CREATE TABLE IF NOT EXISTS `tb_indique` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cpf` varchar(11) NOT NULL,
  `nomealuno` varchar(255) NOT NULL,
  `nomepais` varchar(255) NOT NULL,
  `dt_insert` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

--
-- Despejando dados para a tabela `tb_indique`
--

INSERT INTO `tb_indique` (`id`, `cpf`, `nomealuno`, `nomepais`, `dt_insert`) VALUES
(1, '11111111111', 'Não informado', 'Não informado', '2025-05-20 18:06:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_log`
--

DROP TABLE IF EXISTS `tb_log`;
CREATE TABLE IF NOT EXISTS `tb_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_usuarios` bigint NOT NULL,
  `fk_cadastro` bigint NOT NULL,
  `fk_situacao` bigint NOT NULL,
  `excluido` int NOT NULL DEFAULT '0',
  `dt_insert` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_tb_log_tb_cadastro1` (`fk_cadastro`),
  KEY `fk_tb_log_tb_situacao1` (`fk_situacao`),
  KEY `fk_tb_log_tb_usuarios1` (`fk_usuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_observacao`
--

DROP TABLE IF EXISTS `tb_observacao`;
CREATE TABLE IF NOT EXISTS `tb_observacao` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_cadastro` bigint NOT NULL,
  `fk_usuarios` bigint UNSIGNED DEFAULT NULL,
  `texto` longtext,
  `dt_insert` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_tb_observacao_tb_cadastro1_idx` (`fk_cadastro`),
  KEY `fk_tb_observacao_users` (`fk_usuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_observacao`
--

INSERT INTO `tb_observacao` (`id`, `fk_cadastro`, `fk_usuarios`, `texto`, `dt_insert`) VALUES
(3, 5, 1, 'TESTE 3', '2025-05-21 18:05:17');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_origens`
--

DROP TABLE IF EXISTS `tb_origens`;
CREATE TABLE IF NOT EXISTS `tb_origens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `status` varchar(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_origens`
--

INSERT INTO `tb_origens` (`id`, `nome`, `status`) VALUES
(1, 'Site', '1'),
(2, 'Redes sociais', '1'),
(3, 'Indicação', '1'),
(4, 'Passou na frente', '1'),
(5, 'Google', '1'),
(6, 'Facebook', '1'),
(7, 'Instagram', '1'),
(8, 'Busdoor', '1'),
(9, 'Outdoor', '1'),
(10, 'Panfleto', '1'),
(11, 'Folder', '1'),
(12, 'Jornal', '1'),
(13, 'Ex-aluno', '1'),
(14, 'Amigos/família', '1'),
(15, 'Escolas parceiras', '1'),
(16, 'Rádio', '1'),
(17, 'TV', '1'),
(18, 'Caixa de pizza', '1'),
(19, 'Parcerias', '1'),
(20, 'Rematrícula', '1'),
(21, 'Site - Leadster', '1'),
(22, 'Anúncio condomínios', '1'),
(23, 'Meta - WhatsApp', '1'),
(24, 'Meta - WhatsApp - Remarketing', '1');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_pesquisa`
--

DROP TABLE IF EXISTS `tb_pesquisa`;
CREATE TABLE IF NOT EXISTS `tb_pesquisa` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_cadastro` bigint NOT NULL,
  `estrutura` int DEFAULT NULL,
  `metodologia` int DEFAULT NULL,
  `mensalidade` int DEFAULT NULL,
  `localizacao` int DEFAULT NULL,
  `horario` int DEFAULT NULL,
  `apresentacao` int DEFAULT NULL,
  `agradou` longtext,
  `sugestao` longtext,
  `celular_responsavel` varchar(15) NOT NULL,
  `indicaria` int DEFAULT NULL,
  `dt_insert` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tb_pesquisa_tb_cadastro1_idx` (`fk_cadastro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_responsavel`
--

DROP TABLE IF EXISTS `tb_responsavel`;
CREATE TABLE IF NOT EXISTS `tb_responsavel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `dt_insert` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_responsavel`
--

INSERT INTO `tb_responsavel` (`id`, `nome`, `email`, `telefone`, `celular`, `dt_insert`, `status`) VALUES
(1, 'TESTE 1 - RESP FOI', 'teste@teste.com', '1111111111', '1111111111', '2025-05-20 18:07:31', '0'),
(4, 'Priscila Queiroz', 'priscilagsqueiroz@gmail.com', '11111111111', '11111111111', '2025-05-21 18:05:17', '1'),
(5, 'Amanda Paes', 'amandaribpaes@gmail.com', '2222222222222', '2222222222222', '2025-05-21 18:06:05', '1'),
(6, 'ultima vez q testo isso hj', 'cxvxcvxcbcvn@teste.com', '4564847313', '4564847313', '2025-05-22 18:09:22', '1');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_responsavel_has_tb_aluno`
--

DROP TABLE IF EXISTS `tb_responsavel_has_tb_aluno`;
CREATE TABLE IF NOT EXISTS `tb_responsavel_has_tb_aluno` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_responsavel` bigint NOT NULL,
  `fk_aluno` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tb_responsavel_has_tb_aluno_tb_aluno1_idx` (`fk_aluno`),
  KEY `fk_tb_responsavel_has_tb_aluno_tb_responsavel_idx` (`fk_responsavel`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_responsavel_has_tb_aluno`
--

INSERT INTO `tb_responsavel_has_tb_aluno` (`id`, `fk_responsavel`, `fk_aluno`) VALUES
(1, 1, 1),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_responsavel_has_tb_cadastro`
--

DROP TABLE IF EXISTS `tb_responsavel_has_tb_cadastro`;
CREATE TABLE IF NOT EXISTS `tb_responsavel_has_tb_cadastro` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_responsavel` bigint NOT NULL,
  `fk_cadastro` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tb_responsavel_has_tb_cadastro_tb_cadastro1_idx` (`fk_cadastro`),
  KEY `fk_tb_responsavel_has_tb_cadastro_tb_responsavel1_idx` (`fk_responsavel`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_responsavel_has_tb_cadastro`
--

INSERT INTO `tb_responsavel_has_tb_cadastro` (`id`, `fk_responsavel`, `fk_cadastro`) VALUES
(1, 1, 2),
(4, 4, 5),
(5, 5, 6),
(6, 6, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_series`
--

DROP TABLE IF EXISTS `tb_series`;
CREATE TABLE IF NOT EXISTS `tb_series` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_escolas` bigint NOT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `status` varchar(1) DEFAULT '1',
  `ordem` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tb_series_tb_escolas1_idx` (`fk_escolas`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_series`
--

INSERT INTO `tb_series` (`id`, `fk_escolas`, `nome`, `status`, `ordem`) VALUES
(1, 1, 'Não informado', '1', 1),
(2, 2, 'Não informado', '1', 1),
(3, 2, 'Integral', '1', 2),
(4, 2, 'Mini-Maternal', '1', 3),
(5, 2, 'Maternal', '1', 4),
(6, 2, 'Creche', '0', 5),
(7, 2, 'Jardim', '1', 6),
(8, 2, 'Jardim II', '0', 7),
(9, 2, 'Pré', '1', 8),
(10, 2, 'Pré II', '0', 9),
(11, 2, '1º ano do Ensino Fundamental I', '1', 10),
(12, 2, '2º ano do Ensino Fundamental I', '1', 11),
(13, 2, '3º ano do Ensino Fundamental I', '1', 12),
(14, 2, '4º ano do Ensino Fundamental I', '1', 13),
(15, 2, '5º ano do Ensino Fundamental I', '1', 14),
(16, 2, '6º ano do Ensino Fundamental II', '1', 15),
(17, 2, '7º ano do Ensino Fundamental II', '1', 16),
(18, 2, '8º ano do Ensino Fundamental II', '1', 17),
(19, 2, '9º ano do Ensino Fundamental II', '1', 18),
(20, 2, '1º ano do Ensino Médio', '1', 19),
(21, 2, '2º ano do Ensino Médio', '1', 20),
(22, 2, '3º ano do Ensino Médio', '1', 21);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_situacao`
--

DROP TABLE IF EXISTS `tb_situacao`;
CREATE TABLE IF NOT EXISTS `tb_situacao` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `legenda` varchar(100) NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_situacao`
--

INSERT INTO `tb_situacao` (`id`, `nome`, `legenda`, `status`) VALUES
(1, 'Potencial', 'Contatos Novos', '1'),
(2, 'Tentativa de Contato', 'Realizado um contato preliminar, no entanto, não foi possível concluir a interação.', '1'),
(3, 'Em contato', 'O contato foi realizado, mas precisa de retorno', '1'),
(4, 'Visita agendada', 'Contatos que marcaram data e horário', '1'),
(5, 'Compareceu', 'Contatos que visitaram a unidade no dia marcado', '1'),
(6, 'Não compareceu', 'Contatos que não visitaram a unidade no dia marcado', '1'),
(7, 'Em aberto', '', '0'),
(8, 'Concluído', 'Agendamento finalizado', '1'),
(9, 'A Tratar', 'Leads antigos que aguardam contato', '0'),
(10, 'Não tem interesse', 'O responsável não tem mais interesse em matricular o filho no colégio', '1'),
(11, 'Sem resposta', 'Quando o responsável não responde', '1'),
(12, 'Telefone não existe', 'Ligação não pode ser concluída por que o telefone não existe', '1'),
(13, 'Recontato', 'O responsável foi contactado novamente após uma interação anterior', '1'),
(14, 'Fora do Orçamento', 'A proposta excede o limite financeiro do responsável', '1'),
(15, 'Localização Distante', 'Fora da área de cobertura do colégio', '1'),
(16, 'Ausência de transporte escolar', '', '1'),
(17, 'Procura por bolsa de estudos', '', '1'),
(18, 'Entrega de currículo', '', '1'),
(19, 'Procura por período integral', '', '1');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_sms`
--

DROP TABLE IF EXISTS `tb_sms`;
CREATE TABLE IF NOT EXISTS `tb_sms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cadastro_id` int NOT NULL,
  `situacao_sms` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `ausencia` int NOT NULL DEFAULT '0',
  `dia` int NOT NULL,
  `dt_insert` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_usuarios`
--

DROP TABLE IF EXISTS `tb_usuarios`;
CREATE TABLE IF NOT EXISTS `tb_usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_usuario_nivel` bigint NOT NULL DEFAULT '1',
  `fk_escolas` bigint NOT NULL,
  `nome` varchar(150) DEFAULT NULL,
  `usuario` varchar(25) DEFAULT NULL,
  `senha` varchar(40) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dt_insert` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_tb_usuarios_tb_usuario_nivel1_idx` (`fk_usuario_nivel`),
  KEY `fk_tb_usuarios_tb_escolas1` (`fk_escolas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_usuario_nivel`
--

DROP TABLE IF EXISTS `tb_usuario_nivel`;
CREATE TABLE IF NOT EXISTS `tb_usuario_nivel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(40) DEFAULT NULL,
  `nivel` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_usuario_nivel`
--

INSERT INTO `tb_usuario_nivel` (`id`, `nome`, `nivel`) VALUES
(1, 'Administrador', 1),
(2, 'Atendente', 2),
(3, 'Outro', 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `fk_tipo_usuario` bigint NOT NULL,
  `fk_escolas` bigint NOT NULL DEFAULT '1',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `fk_tipo_usuario` (`fk_tipo_usuario`),
  KEY `fk_users_escolas` (`fk_escolas`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `fk_tipo_usuario`, `fk_escolas`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'Priscila', 'priscila@rtpublicity.com.br', NULL, '$2y$12$.D9iquNqbFLj1gGXMf7MA.thvnqqQ6zOf56slS/9hSpuR1KJAoIdW', NULL, '2025-05-21 16:34:15', '2025-05-21 16:34:15', NULL),
(2, 2, 2, 'Outro Teste', 'priscilagsqueiroz@gmail.com', NULL, '$2y$12$/LFMzfDf9tZK6YIzqpD.TOdIfMlJFe5EUV1TmiGb0WxI7cjfbjsJe', NULL, '2025-05-22 23:30:26', '2025-05-23 16:51:25', NULL);

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tb_aluno`
--
ALTER TABLE `tb_aluno`
  ADD CONSTRAINT `fk_tb_aluno_tb_aluno_categoria1` FOREIGN KEY (`fk_aluno_categoria`) REFERENCES `tb_aluno_categoria` (`id`),
  ADD CONSTRAINT `fk_tb_aluno_tb_escolas1` FOREIGN KEY (`fk_escolas`) REFERENCES `tb_escolas` (`id`),
  ADD CONSTRAINT `fk_tb_aluno_tb_series1` FOREIGN KEY (`fk_series`) REFERENCES `tb_series` (`id`);

--
-- Restrições para tabelas `tb_cadastro`
--
ALTER TABLE `tb_cadastro`
  ADD CONSTRAINT `fk_tb_cadastro_tb_indique1` FOREIGN KEY (`fk_indique`) REFERENCES `tb_indique` (`id`),
  ADD CONSTRAINT `fk_tb_cadastro_tb_origens1` FOREIGN KEY (`fk_origens`) REFERENCES `tb_origens` (`id`),
  ADD CONSTRAINT `fk_tb_cadastro_tb_responsavel1` FOREIGN KEY (`fk_responsavel`) REFERENCES `tb_responsavel` (`id`),
  ADD CONSTRAINT `fk_tb_cadastro_tb_situacao1` FOREIGN KEY (`fk_situacao`) REFERENCES `tb_situacao` (`id`);

--
-- Restrições para tabelas `tb_log`
--
ALTER TABLE `tb_log`
  ADD CONSTRAINT `fk_tb_log_tb_cadastro1` FOREIGN KEY (`fk_cadastro`) REFERENCES `tb_cadastro` (`id`),
  ADD CONSTRAINT `fk_tb_log_tb_situacao1` FOREIGN KEY (`fk_situacao`) REFERENCES `tb_situacao` (`id`),
  ADD CONSTRAINT `fk_tb_log_tb_usuarios1` FOREIGN KEY (`fk_usuarios`) REFERENCES `tb_usuarios` (`id`);

--
-- Restrições para tabelas `tb_observacao`
--
ALTER TABLE `tb_observacao`
  ADD CONSTRAINT `fk_tb_observacao_tb_cadastro1` FOREIGN KEY (`fk_cadastro`) REFERENCES `tb_cadastro` (`id`),
  ADD CONSTRAINT `fk_tb_observacao_users` FOREIGN KEY (`fk_usuarios`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_pesquisa`
--
ALTER TABLE `tb_pesquisa`
  ADD CONSTRAINT `fk_tb_pesquisa_tb_cadastro1` FOREIGN KEY (`fk_cadastro`) REFERENCES `tb_cadastro` (`id`);

--
-- Restrições para tabelas `tb_responsavel_has_tb_aluno`
--
ALTER TABLE `tb_responsavel_has_tb_aluno`
  ADD CONSTRAINT `fk_tb_responsavel_has_tb_aluno_tb_aluno1` FOREIGN KEY (`fk_aluno`) REFERENCES `tb_aluno` (`id`),
  ADD CONSTRAINT `fk_tb_responsavel_has_tb_aluno_tb_responsavel` FOREIGN KEY (`fk_responsavel`) REFERENCES `tb_responsavel` (`id`);

--
-- Restrições para tabelas `tb_responsavel_has_tb_cadastro`
--
ALTER TABLE `tb_responsavel_has_tb_cadastro`
  ADD CONSTRAINT `fk_tb_responsavel_has_tb_cadastro_tb_cadastro1` FOREIGN KEY (`fk_cadastro`) REFERENCES `tb_cadastro` (`id`),
  ADD CONSTRAINT `fk_tb_responsavel_has_tb_cadastro_tb_responsavel1` FOREIGN KEY (`fk_responsavel`) REFERENCES `tb_responsavel` (`id`);

--
-- Restrições para tabelas `tb_series`
--
ALTER TABLE `tb_series`
  ADD CONSTRAINT `fk_tb_series_tb_escolas1` FOREIGN KEY (`fk_escolas`) REFERENCES `tb_escolas` (`id`);

--
-- Restrições para tabelas `tb_usuarios`
--
ALTER TABLE `tb_usuarios`
  ADD CONSTRAINT `fk_tb_usuarios_tb_escolas1` FOREIGN KEY (`fk_escolas`) REFERENCES `tb_escolas` (`id`),
  ADD CONSTRAINT `fk_tb_usuarios_tb_usuario_nivel1` FOREIGN KEY (`fk_usuario_nivel`) REFERENCES `tb_usuario_nivel` (`id`);

--
-- Restrições para tabelas `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_tipo_usuario` FOREIGN KEY (`fk_tipo_usuario`) REFERENCES `tb_usuario_nivel` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_users_escolas` FOREIGN KEY (`fk_escolas`) REFERENCES `tb_escolas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
