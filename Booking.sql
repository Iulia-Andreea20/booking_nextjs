-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 23, 2024 at 12:55 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `Camere`
--

CREATE TABLE `Camere` (
  `IDCamera` int(11) NOT NULL,
  `NumarPaturi` int(11) NOT NULL,
  `Pret` decimal(10,2) NOT NULL,
  `TipImobil` enum('garsoniera','apartament','studio') NOT NULL,
  `IDUnitatiCazare` int(11) NOT NULL,
  `Caracteristici` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Camere`
--

INSERT INTO `Camere` (`IDCamera`, `NumarPaturi`, `Pret`, `TipImobil`, `IDUnitatiCazare`, `Caracteristici`) VALUES
(2, 2, 100.00, 'garsoniera', 1, NULL),
(3, 2, 150.00, 'apartament', 1, NULL),
(4, 2, 100.00, 'studio', 2, NULL),
(5, 2, 150.00, 'apartament', 2, NULL),
(6, 1, 100.00, 'garsoniera', 3, NULL),
(7, 3, 150.00, 'studio', 3, NULL),
(8, 1, 100.00, 'garsoniera', 4, NULL),
(9, 3, 120.00, 'apartament', 4, NULL),
(10, 4, 70.00, 'studio', 5, NULL),
(11, 3, 110.00, 'apartament', 5, NULL),
(12, 2, 100.00, 'garsoniera', 6, NULL),
(13, 5, 150.00, 'studio', 6, NULL),
(14, 1, 100.00, 'garsoniera', 7, NULL),
(15, 3, 150.00, 'apartament', 7, NULL),
(20, 1, 100.00, 'garsoniera', 9, NULL),
(21, 2, 150.00, 'apartament', 9, NULL),
(22, 3, 200.00, 'studio', 9, NULL),
(23, 1, 110.00, 'garsoniera', 10, NULL),
(24, 2, 160.00, 'apartament', 10, NULL),
(25, 3, 210.00, 'studio', 10, NULL),
(26, 1, 120.00, 'garsoniera', 11, NULL),
(27, 2, 170.00, 'apartament', 11, NULL),
(28, 3, 220.00, 'studio', 11, NULL),
(29, 1, 130.00, 'garsoniera', 12, NULL),
(30, 2, 180.00, 'apartament', 12, NULL),
(31, 3, 230.00, 'studio', 12, NULL),
(32, 1, 140.00, 'garsoniera', 13, NULL),
(33, 2, 190.00, 'apartament', 13, NULL),
(34, 3, 240.00, 'studio', 13, NULL),
(35, 1, 150.00, 'garsoniera', 14, NULL),
(36, 2, 200.00, 'apartament', 14, NULL),
(37, 3, 250.00, 'studio', 14, NULL),
(38, 1, 160.00, 'garsoniera', 15, NULL),
(39, 2, 210.00, 'apartament', 15, NULL),
(40, 3, 260.00, 'studio', 15, NULL),
(41, 1, 170.00, 'garsoniera', 16, NULL),
(42, 2, 220.00, 'apartament', 16, NULL),
(43, 3, 270.00, 'studio', 16, NULL),
(44, 1, 180.00, 'garsoniera', 17, NULL),
(45, 2, 230.00, 'apartament', 17, NULL),
(46, 3, 280.00, 'studio', 17, NULL),
(50, 1, 200.00, 'garsoniera', 19, NULL),
(51, 2, 250.00, 'apartament', 19, NULL),
(52, 3, 300.00, 'studio', 19, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Clienti`
--

CREATE TABLE `Clienti` (
  `IdClient` int(11) NOT NULL,
  `Nume` varchar(100) NOT NULL,
  `Prenume` varchar(100) NOT NULL,
  `NumarTelefon` varchar(12) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Parola` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Clienti`
--

INSERT INTO `Clienti` (`IdClient`, `Nume`, `Prenume`, `NumarTelefon`, `Email`, `Parola`) VALUES
(9, 'Grigore', 'Iulia', '0731546098', 'griandreea4@gmail.com', 'test'),
(11, 'g', 'g', 'g', 'g', 'g'),
(12, 'g', 'g', 'g', 'g', 'g'),
(13, 'ANA', '5', 'rfre', 'griandreea4@gmail.com', '90'),
(14, '', '', '', '', ''),
(19, 'd', 'd', 'd', 'griandreea4@gmail.com', 'd'),
(20, 'a', 'a', 'a', 'griandreea4@gmail.com', 'a'),
(21, 'd', 'd', 'd', 'griandreea4@gmail.com', 'd'),
(22, 'r', 'r', 'r', 'griandreea4@gmail.com', 'r'),
(34, 'ana', 'banana', 'haha', 'ana@banana', 'ana'),
(35, 'ana', 'banana', 'haha', 'ana@banana', 'ana'),
(36, 'j', 'j', 'j', 'c@c', 'j'),
(37, 'j', 'j', 'j', 'c@c', 'j'),
(38, 'j', 'j', 'j', 'c@c', 'j'),
(39, 'j', 'j', 'j', 'c@c', 'j'),
(40, 'j', 'j', 'j', 'c@c', 'j'),
(41, 'f', 'f', 'f', 'f@f', 'f'),
(43, 'x', 'x', 'x', 'x@x', 'x'),
(44, 'v', 'v', 'v', 'v@v', 'v'),
(45, 'Grigore', 'Andreea', '0731546076', 'andreea.grigore@gmail.com', 'andreea'),
(48, 'andreea', 'iosub', '73128783', 'andreeaiosub@gmail.com', 'andreea');

-- --------------------------------------------------------

--
-- Table structure for table `Facilitati`
--

CREATE TABLE `Facilitati` (
  `IdFacilitate` int(11) NOT NULL,
  `Descriere` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Facilitati`
--

INSERT INTO `Facilitati` (`IdFacilitate`, `Descriere`) VALUES
(1, 'wifi'),
(2, 'accepta animale de companie'),
(4, 'parcare'),
(5, 'restaurant');

-- --------------------------------------------------------

--
-- Table structure for table `Facilitaticamere`
--

CREATE TABLE `Facilitaticamere` (
  `IDFacilitati` int(11) NOT NULL,
  `IDCamera` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Facilitaticamere`
--

INSERT INTO `Facilitaticamere` (`IDFacilitati`, `IDCamera`) VALUES
(1, 2),
(1, 3),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(2, 2),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24),
(2, 25),
(2, 26),
(2, 27),
(2, 28),
(2, 29),
(2, 30),
(4, 6),
(4, 8),
(4, 10),
(4, 12),
(4, 14),
(4, 20),
(4, 22),
(4, 24),
(4, 26),
(4, 28),
(4, 30),
(5, 12),
(5, 29),
(5, 38),
(5, 40),
(5, 42),
(5, 46),
(5, 52);

-- --------------------------------------------------------

--
-- Table structure for table `FeedbackClienti`
--

CREATE TABLE `FeedbackClienti` (
  `IdFeedback` int(11) NOT NULL,
  `IdRezervari` int(11) DEFAULT NULL,
  `ExperientaCazare` text DEFAULT NULL,
  `IdClient` int(11) DEFAULT NULL,
  `Rating` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `FeedbackClienti`
--

INSERT INTO `FeedbackClienti` (`IdFeedback`, `IdRezervari`, `ExperientaCazare`, `IdClient`, `Rating`) VALUES
(5, 30, 'great job', 43, 5),
(6, 45, 'excellent', 43, 5),
(7, 47, 'this is feedback', 43, 4),
(8, 43, 'Mi-a placut', 43, 4),
(9, 51, 'mancare ok', 43, 3),
(10, 52, 'Excelent', 43, 5),
(11, 53, 'personal neprimitor', 43, 2),
(12, 54, 'mancare excelenta', 43, 5),
(13, 56, 'confortabil si primitor', 43, 4),
(14, 64, 'foarte frumos', 43, 5),
(15, 55, 'mi-a placut', 43, 4),
(16, 65, 'excelent', 43, 5),
(17, 66, 'fabulos', 45, 5),
(18, 67, 'minunat', 45, 5),
(19, 68, 'nu am fost impresionata', 45, 2),
(20, 69, 'ceva deosebit', 45, 5),
(21, 70, 'neplacut', 45, 1),
(22, 73, 'extraordinar', 45, 5),
(23, 71, 'interesant', 45, 2),
(24, 74, 'frumos', 45, 4),
(25, 75, 'placut', 45, 5),
(26, 76, 'ceva deosebit', 45, 5),
(27, 78, 'cool', 45, 4),
(28, 82, 'a fost frumos', 48, 5);

-- --------------------------------------------------------

--
-- Table structure for table `Rezervari`
--

CREATE TABLE `Rezervari` (
  `IdRezervari` int(11) NOT NULL,
  `IdClient` int(11) NOT NULL,
  `IdUnitatiCazare` int(11) DEFAULT NULL,
  `DataInceputCazare` date NOT NULL,
  `DataSfarsitCazare` date NOT NULL,
  `StatusPlata` enum('Active','Cancelled','Completed') NOT NULL,
  `IdCamera` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Rezervari`
--

INSERT INTO `Rezervari` (`IdRezervari`, `IdClient`, `IdUnitatiCazare`, `DataInceputCazare`, `DataSfarsitCazare`, `StatusPlata`, `IdCamera`) VALUES
(26, 41, 3, '2024-01-08', '2024-01-10', 'Active', 6),
(27, 41, 3, '2024-01-16', '2024-01-18', 'Active', 7),
(28, 41, 4, '2024-01-09', '2024-01-11', 'Active', 9),
(30, 43, 7, '2024-01-01', '2024-01-03', 'Active', 14),
(33, 41, 7, '2024-01-01', '2024-01-03', 'Active', 14),
(34, 41, 7, '2024-01-05', '2024-01-06', 'Active', 15),
(35, 41, 7, '2024-01-01', '2024-01-04', 'Active', 14),
(36, 41, 7, '2024-01-05', '2024-01-06', 'Active', 14),
(39, 41, 7, '2024-01-16', '2024-01-18', 'Active', 14),
(40, 41, 7, '2024-01-09', '2024-01-11', 'Active', 14),
(41, 41, 2, '2023-12-05', '2023-12-06', 'Active', 4),
(42, 41, 7, '2023-12-29', '2023-12-31', 'Active', 14),
(43, 43, 3, '2024-01-05', '2024-01-06', 'Active', 7),
(45, 43, 7, '2023-12-05', '2023-12-07', 'Active', 15),
(47, 43, 4, '2023-12-05', '2023-12-07', 'Active', 9),
(49, 43, 4, '2024-01-18', '2024-01-19', 'Active', 8),
(51, 43, 1, '2023-12-04', '2023-12-06', 'Active', 2),
(52, 43, 5, '2023-12-11', '2023-12-13', 'Active', 11),
(53, 43, 1, '2023-12-11', '2023-12-14', 'Active', 3),
(54, 43, 1, '2023-12-07', '2023-12-08', 'Active', 3),
(55, 43, 6, '2024-01-08', '2024-01-10', 'Active', 13),
(56, 43, 6, '2023-12-05', '2023-12-06', 'Active', 12),
(64, 43, 17, '2024-01-01', '2024-01-03', 'Active', 46),
(65, 43, 9, '2024-01-01', '2024-01-04', 'Active', 20),
(66, 45, 2, '2024-01-03', '2024-01-05', 'Active', 4),
(67, 45, 5, '2024-01-07', '2024-01-09', 'Active', 10),
(68, 45, 11, '2023-11-07', '2023-11-10', 'Active', 28),
(69, 45, 10, '2023-10-31', '2023-11-03', 'Active', 24),
(70, 45, 12, '2023-12-11', '2023-12-13', 'Active', 30),
(71, 45, 13, '2023-12-26', '2023-12-27', 'Active', 34),
(73, 45, 14, '2023-12-27', '2023-12-30', 'Active', 37),
(74, 45, 15, '2024-01-01', '2024-01-05', 'Active', 39),
(75, 45, 16, '2024-01-01', '2024-01-03', 'Active', 43),
(76, 45, 2, '2024-01-08', '2024-01-11', 'Active', 5),
(77, 45, 2, '2024-01-23', '2024-01-25', 'Active', 5),
(78, 45, 19, '2024-01-01', '2024-01-03', 'Active', 50),
(81, 43, 4, '2024-01-08', '2024-01-10', 'Active', 8),
(82, 48, 5, '2024-02-12', '2024-02-14', 'Active', 11);

-- --------------------------------------------------------

--
-- Table structure for table `UnitatiCazare`
--

CREATE TABLE `UnitatiCazare` (
  `IDUnitatiCazare` int(11) NOT NULL,
  `NumeUnitatiCazare` varchar(255) NOT NULL,
  `Locatie` varchar(255) NOT NULL,
  `Check_in` time NOT NULL,
  `Check_out` time NOT NULL,
  `DescriereUnitatiCazare` text DEFAULT NULL,
  `TipUnitati` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `UnitatiCazare`
--

INSERT INTO `UnitatiCazare` (`IDUnitatiCazare`, `NumeUnitatiCazare`, `Locatie`, `Check_in`, `Check_out`, `DescriereUnitatiCazare`, `TipUnitati`) VALUES
(1, 'Hotel Transilvania', 'Sibiu', '14:00:00', '11:00:00', 'Confortabil și central', 'Hotel'),
(2, 'Pensiunea Clujana', 'Cluj-Napoca', '15:00:00', '10:00:00', 'O atmosferă rustică și primitoare', 'Pensiune'),
(3, 'Apartament Donau', 'Budapesta', '13:00:00', '12:00:00', 'Vedere superbă spre Dunăre', 'Apartament'),
(4, 'Hotel Sibiu Central', 'Sibiu', '14:00:00', '11:00:00', 'Hotel confortabil în centrul orașului Sibiu', 'Hotel'),
(5, 'Pensiunea Sibiu Cozy', 'Sibiu', '15:00:00', '12:00:00', 'Pensiune rustică și confortabilă în Sibiu', 'Pensiune'),
(6, 'Hotel Cluj Modern', 'Cluj-Napoca', '14:00:00', '11:00:00', 'Hotel modern cu toate facilitățile în Cluj-Napoca', 'Hotel'),
(7, 'Pensiunea Cluj Traditional', 'Cluj-Napoca', '15:00:00', '10:00:00', 'Pensiune tradițională în inima Clujului', 'Pensiune'),
(9, 'Budapesta City Retreat', 'Budapesta', '15:00:00', '11:00:00', 'Cazare confortabilă în centrul Budapestei', 'Apartament'),
(10, 'Hotel Transilvania Lux', 'Cluj-Napoca', '14:00:00', '12:00:00', 'Confort de lux în centrul orașului', 'Hotel'),
(11, 'Pensiunea Banffy', 'Cluj-Napoca', '15:00:00', '11:00:00', 'O clădire istorică cu servicii moderne', 'Pensiune'),
(12, 'Apartament Central', 'Cluj-Napoca', '13:00:00', '11:00:00', 'Apartament spatios cu vedere la oraș', 'Apartament'),
(13, 'Casa de oaspeți Somes', 'Cluj-Napoca', '15:00:00', '10:00:00', 'Cazare confortabilă pe malul râului', 'Pensiune'),
(14, 'Hotel Regal Cluj', 'Cluj-Napoca', '14:00:00', '11:00:00', 'Servicii regale pentru toți oaspeții', 'Hotel'),
(15, 'Apartament Luxor', 'Cluj-Napoca', '16:00:00', '11:00:00', 'Lux și confort maxim', 'Apartament'),
(16, 'Pensiunea Retro', 'Cluj-Napoca', '14:00:00', '12:00:00', 'Ambianță vintage cu confort modern', 'Pensiune'),
(17, 'Hotel Avram Iancu', 'Cluj-Napoca', '13:00:00', '11:00:00', 'Oaspeți în centrul istoriei', 'Hotel'),
(19, 'Pensiunea Central Park', 'Cluj-Napoca', '15:00:00', '12:00:00', 'Verdeață și liniște în centrul urban', 'Pensiune');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Camere`
--
ALTER TABLE `Camere`
  ADD PRIMARY KEY (`IDCamera`),
  ADD KEY `fk_unitati_cazare` (`IDUnitatiCazare`);

--
-- Indexes for table `Clienti`
--
ALTER TABLE `Clienti`
  ADD PRIMARY KEY (`IdClient`);

--
-- Indexes for table `Facilitati`
--
ALTER TABLE `Facilitati`
  ADD PRIMARY KEY (`IdFacilitate`);

--
-- Indexes for table `Facilitaticamere`
--
ALTER TABLE `Facilitaticamere`
  ADD PRIMARY KEY (`IDFacilitati`,`IDCamera`),
  ADD KEY `fk_camera_cascade` (`IDCamera`);

--
-- Indexes for table `FeedbackClienti`
--
ALTER TABLE `FeedbackClienti`
  ADD PRIMARY KEY (`IdFeedback`),
  ADD KEY `IdRezervari` (`IdRezervari`),
  ADD KEY `IdClient` (`IdClient`);

--
-- Indexes for table `Rezervari`
--
ALTER TABLE `Rezervari`
  ADD PRIMARY KEY (`IdRezervari`),
  ADD KEY `fk_client_cascade` (`IdClient`),
  ADD KEY `fk_UnitatiCazare` (`IdUnitatiCazare`),
  ADD KEY `fk_camera` (`IdCamera`);

--
-- Indexes for table `UnitatiCazare`
--
ALTER TABLE `UnitatiCazare`
  ADD PRIMARY KEY (`IDUnitatiCazare`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Camere`
--
ALTER TABLE `Camere`
  MODIFY `IDCamera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `Clienti`
--
ALTER TABLE `Clienti`
  MODIFY `IdClient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `Facilitati`
--
ALTER TABLE `Facilitati`
  MODIFY `IdFacilitate` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `FeedbackClienti`
--
ALTER TABLE `FeedbackClienti`
  MODIFY `IdFeedback` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `Rezervari`
--
ALTER TABLE `Rezervari`
  MODIFY `IdRezervari` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `UnitatiCazare`
--
ALTER TABLE `UnitatiCazare`
  MODIFY `IDUnitatiCazare` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Camere`
--
ALTER TABLE `Camere`
  ADD CONSTRAINT `fk_unitati_cazare` FOREIGN KEY (`IDUnitatiCazare`) REFERENCES `UnitatiCazare` (`IDUnitatiCazare`) ON DELETE CASCADE;

--
-- Constraints for table `Facilitaticamere`
--
ALTER TABLE `Facilitaticamere`
  ADD CONSTRAINT `fk_camera_cascade` FOREIGN KEY (`IDCamera`) REFERENCES `Camere` (`IDCamera`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_facilitate_cascade` FOREIGN KEY (`IDFacilitati`) REFERENCES `Facilitati` (`IdFacilitate`) ON DELETE CASCADE;

--
-- Constraints for table `FeedbackClienti`
--
ALTER TABLE `FeedbackClienti`
  ADD CONSTRAINT `feedbackclienti_ibfk_1` FOREIGN KEY (`IdRezervari`) REFERENCES `Rezervari` (`IdRezervari`),
  ADD CONSTRAINT `feedbackclienti_ibfk_2` FOREIGN KEY (`IdClient`) REFERENCES `Clienti` (`IdClient`);

--
-- Constraints for table `Rezervari`
--
ALTER TABLE `Rezervari`
  ADD CONSTRAINT `fk_UnitatiCazare` FOREIGN KEY (`IdUnitatiCazare`) REFERENCES `UnitatiCazare` (`IDUnitatiCazare`),
  ADD CONSTRAINT `fk_camera` FOREIGN KEY (`IdCamera`) REFERENCES `Camere` (`IDCamera`),
  ADD CONSTRAINT `fk_client_cascade` FOREIGN KEY (`IdClient`) REFERENCES `Clienti` (`IdClient`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
