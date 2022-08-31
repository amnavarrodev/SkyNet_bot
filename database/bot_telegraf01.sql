-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-08-2022 a las 19:28:01
-- Versión del servidor: 10.4.6-MariaDB
-- Versión de PHP: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bot_telegraf01`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `private`
--

CREATE TABLE `private` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `user_name` text NOT NULL,
  `first_name` text NOT NULL,
  `chat_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supergroup`
--

CREATE TABLE `supergroup` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `user_name` text NOT NULL,
  `first_name` text NOT NULL,
  `chat_id` bigint(20) NOT NULL,
  `chat_title` text NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `private`
--
ALTER TABLE `private`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `supergroup`
--
ALTER TABLE `supergroup`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `private`
--
ALTER TABLE `private`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `supergroup`
--
ALTER TABLE `supergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
