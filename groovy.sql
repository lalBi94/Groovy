-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 31 mai 2023 à 17:43
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groovy`
--

-- --------------------------------------------------------

--
-- Structure de la table `alaffiche`
--

DROP TABLE IF EXISTS `alaffiche`;
CREATE TABLE IF NOT EXISTS `alaffiche` (
  `items` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `alaffiche`
--

INSERT INTO `alaffiche` (`items`) VALUES
('{\"items\":[63,65,83,84]}');

-- --------------------------------------------------------

--
-- Structure de la table `categorys`
--

DROP TABLE IF EXISTS `categorys`;
CREATE TABLE IF NOT EXISTS `categorys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `categorys`
--

INSERT INTO `categorys` (`id`, `title`) VALUES
(1, 'unknown'),
(2, 'Soul'),
(3, 'Funk'),
(4, 'Rap'),
(5, 'Francais'),
(6, 'Reggea'),
(7, 'RnB'),
(8, 'Classique'),
(9, 'Asia'),
(10, 'Africa');

-- --------------------------------------------------------

--
-- Structure de la table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artist` text NOT NULL,
  `price` double NOT NULL,
  `name` text NOT NULL,
  `album` text,
  `desc` text NOT NULL,
  `category` int NOT NULL,
  `promotion` int DEFAULT NULL,
  `qte` int NOT NULL,
  `img` longblob NOT NULL,
  `audio` longblob,
  PRIMARY KEY (`id`),
  KEY `category` (`category`)
) ENGINE=MyISAM AUTO_INCREMENT=112 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `items`
--

INSERT INTO `items` (`id`, `artist`, `price`, `name`, `album`, `desc`, `category`, `promotion`, `qte`, `img`, `audio`) VALUES
(95, 'Jack Kirby', 90, 'Superman', 'DC', 'Superman est un super-héros de bande dessinée américaine appartenant au monde imaginaire de l’Univers DC. Ce personnage est considéré comme une icône culturelle américaine.', 0, NULL, 2, NULL, NULL);

--
-- Structure de la table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` int NOT NULL,
  `day` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=778 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`) VALUES
(1, 'user'),
(777, 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permission` int NOT NULL,
  `user` text NOT NULL,
  `email` text NOT NULL,
  `phone` text NOT NULL,
  `passwd` text NOT NULL,
  `token` text,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `permission` (`permission`)
) ENGINE=MyISAM AUTO_INCREMENT=117 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `permission`, `user`, `email`, `phone`, `passwd`, `token`, `created`) VALUES
(116, 0, 'onde-folie', 'onde@folie.fr', '555', '23f2f997f50293ec6d5f75b7cdd7c8c1823028c6660b4976d3a4db1255cfc427', '9ERq-goyS-O1F1-sFRH-BHgB-WHEX-NhvG-jPHC-EZFb-f6IK', '2023-05-31 03:01:53'),
(114, 777, 'Bilal', 'bilal@boudjemline.fr', '666', '2f8c627f6a6b6d2dd47f04aaa1ce0a900ef3ea6099aa6e73beb226cdb1e72b2a', 'VJcW-EhVQ-8fYT-vjax-cb8z-2Qos-xqMU-Yx4Z-DC3Y-MvSN', '2023-05-26 17:27:00');

-- --------------------------------------------------------

--
-- Structure de la table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE IF NOT EXISTS `wishlists` (
  `userid` int NOT NULL,
  `itemid` int NOT NULL,
  KEY `userid` (`userid`),
  KEY `itemid` (`itemid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `wishlists`
--

INSERT INTO `wishlists` (`userid`, `itemid`) VALUES
(114, 84),
(114, 65),
(114, 83),
(114, 110),
(116, 63),
(116, 83),
(116, 95),
(116, 101),
(116, 102);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;