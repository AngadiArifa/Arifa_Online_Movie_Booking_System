# Arifa's Online Movie Ticket Booking System

**Category:** Mini Project  
**Project title:** Arifa's Online Movie Ticket Booking System  
**Description:** Manage movies, theaters and ticket bookings. Customers can view available movies, check show timings, select the number of tickets and book tickets.

## Technologies
HTML5, CSS3, JavaScript, Node.js, Express.js and MySQL.

## Database tables and fields

### Table 1: users (supporting table for the required user_id foreign key)
- user_id INT PRIMARY KEY AUTO_INCREMENT
- full_name VARCHAR(100)
- email VARCHAR(150) UNIQUE
- phone VARCHAR(20)
- created_at TIMESTAMP

### Table 2: movies
- movie_id INT PRIMARY KEY AUTO_INCREMENT
- title VARCHAR(150)
- genre VARCHAR(50)
- language VARCHAR(30)
- duration INT (minutes)
- release_date DATE

### Table 3: shows
- show_id INT PRIMARY KEY AUTO_INCREMENT
- movie_id INT FOREIGN KEY → movies.movie_id
- theatre_name VARCHAR(100)
- show_date DATE
- show_time TIME
- ticket_price DECIMAL(10,2)

### Table 4: bookings
- booking_id INT PRIMARY KEY AUTO_INCREMENT
- user_id INT FOREIGN KEY → users.user_id
- show_id INT FOREIGN KEY → shows.show_id
- seats INT
- total_amount DECIMAL(10,2)
- booking_status VARCHAR(30)

## Folder structure
- database/movie_booking.sql — database and sample records
- public/index.html — website structure
- public/style.css — cinema-inspired responsive design
- public/app.js — frontend interactions
- server.js — Express server and API
- package.json — Node dependencies
- .env.example — database configuration template

## Run the project on Windows / VS Code
1. Install Node.js and MySQL (or XAMPP with MySQL).
2. Extract the ZIP and open this project folder in VS Code.
3. Open Terminal → New Terminal.
4. Install dependencies: `npm.cmd install`
5. Open phpMyAdmin, choose Import, select `database/movie_booking.sql`, and click Go. Or run the SQL file in MySQL Workbench.
6. Copy `.env.example` to a new file named `.env`. Set your local MySQL password in `DB_PASSWORD`. If root has no password, keep it blank.
7. Run: `node server.js`
8. Open Chrome: `http://localhost:3000`
Keep the terminal open while testing the website.

## Upload to GitHub
Create an empty GitHub repository, then run these commands from this project folder. Replace the URL with your own repository URL:
```bash
git init
git add .
git commit -m "Add Arifa Online Movie Ticket Booking System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Never upload `.env` or `node_modules`.

## Important hosting note
GitHub Pages can host static frontend files only. It cannot run Express (`server.js`) or connect to a local MySQL database. For a fully working online booking website, host the Express backend and MySQL database on a server/hosting provider and configure the frontend to use that hosted API. This project runs locally as a full-stack app at `http://localhost:3000`.
