-- Active: 1732280179847@@127.0.0.1@5432@postgres@public
CREATE TABLE usersID (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    birthyear INT
);

INSERT INTO usersID (name, username, password, birthyear) VALUES
('Mikko Keränen', 'keranemi', 'salasana123', 1986),
('Marko Junttila', 'markoju', 'salasana321', 1978),
('Jussi Männistö', 'jussiman', 'password123', 1956),
('Marge Simpson', 'margesim', 'password3212', 1979);


CREATE TABLE genresID (
    id SERIAL PRIMARY KEY,
    genreName VARCHAR(255)
);

INSERT INTO genresID (genreName) VALUES
('Action'),
('Comedy'),
('Horror'),
('Thriller'),
('Scifi'),
('Fantasy');

CREATE TABLE moviesID (
    id SERIAL PRIMARY KEY,
    moviesName VARCHAR(255),
    moviesYear INT,
    genresID INT,
    FOREIGN KEY (genresID) REFERENCES genresID(id)
);

INSERT INTO moviesID (moviesName, moviesYear, genresID) VALUES
('Lord of the Rings: The Fellowship of the Ring', 2001, 6),
('Lord of the Rings: The Two Towers', 2002, 6),
('Lord of the Rings: The Return of the King', 2003, 6),
('Alien Romulus', 2024, 3),
('Terminator 2', 1991, 1),
('Predator', 1987, 1);


CREATE TABLE reviewID (
    id SERIAL PRIMARY KEY,
    reviewText TEXT,
    movieStars INT CHECK (movieStars BETWEEN 1 AND 5),
    movieID INT,
    userID INT,
    FOREIGN KEY (movieID) REFERENCES moviesID(id),
    FOREIGN KEY (userID) REFERENCES usersID(id)
);

CREATE TABLE favoriteID (
    id SERIAL PRIMARY KEY,
    userID INT,
    movieID INT,
    FOREIGN KEY (userID) REFERENCES usersID(id),
    FOREIGN KEY (movieID) REFERENCES moviesID(id)
);