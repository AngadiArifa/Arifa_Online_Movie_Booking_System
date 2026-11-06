CREATE DATABASE IF NOT EXISTS arifa_movie_booking;
USE arifa_movie_booking;

-- Table 1: users (supporting table for bookings.user_id)
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: movies
CREATE TABLE IF NOT EXISTS movies (
  movie_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  language VARCHAR(30) NOT NULL,
  duration INT NOT NULL,
  release_date DATE
);

-- Table 3: shows
CREATE TABLE IF NOT EXISTS shows (
  show_id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  theatre_name VARCHAR(100) NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

-- Table 4: bookings
CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  show_id INT NOT NULL,
  seats INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status VARCHAR(30) NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

INSERT INTO movies (title, genre, language, duration, release_date) VALUES
('Starlight Mission', 'Sci-Fi', 'English', 132, '2025-02-14'),
('The Last Promise', 'Drama', 'Hindi', 118, '2025-01-24'),
('Rhythm of Hearts', 'Romance', 'Telugu', 126, '2025-03-07');

INSERT INTO shows (movie_id, theatre_name, show_date, show_time, ticket_price) VALUES
(1, 'Aurora Grand Cinemas', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:30:00', 220.00),
(1, 'Aurora Grand Cinemas', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:30:00', 280.00),
(2, 'Silver Screen Multiplex', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:00:00', 200.00),
(3, 'Aurora Grand Cinemas', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '20:00:00', 250.00);
