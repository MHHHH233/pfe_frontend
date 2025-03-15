-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 29 déc. 2024 à 14:34
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pfe`
--

-- --------------------------------------------------------

--
-- Structure de la table `compte`
--

CREATE TABLE `compte` (
  `id_compte` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `type` enum('admin','client') DEFAULT NULL,
  `pfp` varchar(255) DEFAULT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `date_inscription` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `compte`
--

INSERT INTO `compte` (`id_compte`, `nom`, `prenom`, `age`, `email`, `password`, `type`, `pfp`, `telephone`, `date_inscription`) VALUES
(1, 'Ali', 'Ben', 25, 'admin@admin.com', 'Password123', 'client', 'path/to/profile1.jpg', '1234567890', '2024-12-01'),
(2, 'Sara', 'Mehdi', 30, 'sara.mehdi@example.com', 'hashed_password2Password123', 'admin', 'path/to/profile2.jpg', '0987654321', '2024-12-02'),
(3, 'Youssef', 'Hassan', 20, 'youssef.hassan@example.com', 'hashed_password3', 'client', 'path/to/profile3.jpg', '1122334455', '2024-12-03'),
(4, 'Amira', 'Kamal', 28, 'amira.kamal@example.com', 'hashed_password4', 'admin', 'path/to/profile4.jpg', '5566778899', '2024-12-04'),
(5, 'Omar', 'Reda', 35, 'omar.reda@example.com', 'hashed_password5', 'client', 'path/to/profile5.jpg', '6677889900', '2024-12-05'),
(6, 'ljamai', 'Jon', 99, 'celonev356@rabitex.com', 'Vr4eUE7CDYGXijV', NULL, NULL, '0706939025', NULL),
(7, 'ljamai', 'amine', 88, 'mhaydoo734@gmail.com', 'kyiCpKR4BMysm', NULL, NULL, '7689776876', NULL),
(8, 'test', 'test', 16, 'linda.martinez@example.com', 'Password123', 'client', NULL, '7689776870', '2024-12-26');

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id_reservation` int(11) NOT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_terrain` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `heure` time DEFAULT NULL,
  `etat` enum('reserver','en attente') DEFAULT 'en attente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id_reservation`, `id_client`, `id_terrain`, `date`, `heure`, `etat`) VALUES
(3, 1, 3, '2024-12-26', '15:00:00', 'en attente'),
(4, 2, 1, '2024-12-27', '10:30:00', 'en attente'),
(5, 3, 2, '2024-12-28', '14:00:00', 'reserver'),
(6, 4, 1, '2024-12-29', '18:00:00', 'en attente'),
(7, 5, 3, '2024-12-30', '09:00:00', 'en attente'),
(15, 8, 5, '2024-12-28', '18:00:00', 'reserver'),
(32, 8, 3, '2024-12-29', '14:00:00', 'reserver'),
(33, 8, 3, '2024-12-29', '13:00:00', 'en attente');

-- --------------------------------------------------------

--
-- Structure de la table `terrain`
--

CREATE TABLE `terrain` (
  `id_terrain` int(11) NOT NULL,
  `nom_terrain` varchar(100) DEFAULT NULL,
  `capacite` enum('5v5','6v6','7v7') DEFAULT NULL,
  `type` enum('indoor','outdoor') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `terrain`
--

INSERT INTO `terrain` (`id_terrain`, `nom_terrain`, `capacite`, `type`) VALUES
(1, 'Stadium Alpha', '5v5', 'indoor'),
(2, 'Field Bravo', '6v6', 'outdoor'),
(3, 'Arena Charlie', '7v7', 'indoor'),
(4, 'Pitch Delta', '5v5', 'outdoor'),
(5, 'Ground Echo', '6v6', 'indoor');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `compte`
--
ALTER TABLE `compte`
  ADD PRIMARY KEY (`id_compte`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id_reservation`),
  ADD KEY `id_client` (`id_client`),
  ADD KEY `id_terrain` (`id_terrain`);

--
-- Index pour la table `terrain`
--
ALTER TABLE `terrain`
  ADD PRIMARY KEY (`id_terrain`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `compte`
--
ALTER TABLE `compte`
  MODIFY `id_compte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id_reservation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `terrain`
--
ALTER TABLE `terrain`
  MODIFY `id_terrain` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `compte` (`id_compte`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`id_terrain`) REFERENCES `terrain` (`id_terrain`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
