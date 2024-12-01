import express from 'express';
import { Pool } from 'pg';

const app = express();

app.use(express.json());


const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',       
    database: 'public',       
    password: '',             
    port: 5432,               
});


pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error:', err));


app.listen(3001, () => {
    console.log('Server running on port 3001');
});


app.post('/genre', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Genre '${name}' added successfully (dummy response).` });
});

app.post('/movie', (req, res) => {
    const { name, year, genre } = req.body;
    res.json({ message: `Movie '${name}' (${year}) of genre '${genre}' added (dummy response).` });
});

app.post('/register', (req, res) => {
    const { name, username, password, birthyear } = req.body;
    res.json({ message: `User '${username}' registered successfully (dummy response).` });
});

app.get('/movie/:id', (req, res) => {
    const { id } = req.params;
    res.json({ id, name: 'Dummy Movie', year: 2000, genre: 'Dummy Genre' });
});

app.delete('/movie/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Movie with id ${id} deleted successfully (dummy response).` });
});

app.get('/movies', (req, res) => {
    const { page } = req.query;
    const dummyMovies = [
        { id: 1, name: 'Predator', year: 1999, genre: 'Sci-Fi' },
        { id: 2, name: 'Aliens', year: 2010, genre: 'Action' },
    ];
    res.json({ page: page || 1, movies: dummyMovies });
});

app.get('/movies/search', (req, res) => {
    const { keyword } = req.query;
    const dummyResults = [
        { id: 1, name: 'Barbie' },
        { id: 2, name: 'Gladiator' },
    ];
    res.json({ keyword, results: dummyResults });
});

app.post('/review', (req, res) => {
    const { username, stars, reviewText, movieId } = req.body;
    res.json({
        message: `Review by '${username}' for movie id ${movieId} added successfully (dummy response).`,
        review: { username, stars, reviewText, movieId },
    });
});

app.post('/favorites', (req, res) => {
    const { username, movieId } = req.body;
    res.json({ message: `Movie with id ${movieId} added to '${username}' favorites (dummy response).` });
});

app.get('/favorites/:username', (req, res) => {
    const { username } = req.params;
    const dummyFavorites = [
        { id: 1, name: 'Fingerpori' },
        { id: 2, name: 'Uuno Turhapuro' },
    ];
    res.json({ username, favorites: dummyFavorites });
});
