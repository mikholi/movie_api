import express from 'express';
import { pgPool } from './pg_connection.js';
import res from 'express/lib/response.js';



const app = express();

app.use(express.json());


app.listen(3001, () => {
    console.log('Server is running')
});

app.post('/moviesid', async (req, res) => {
    const {moviesName, moviesYear, genreName} = req.body;

    if (!moviesName || !moviesYear || !genreName) {
        return res.status(400).json({ error: 'Name of the movie, year and the genre required' });

    }

    try {
        const genreResult = await pgPool.query(
            'SELECT id FROM genresID WHERE genreName = $1',
            [genreName]
        );

        if (genreResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid genre name'});
        }

        const genreID = genreResult.rows[0].id;

        const result = await pgPool.query(
            'INSERT INTO moviesID (moviesName, moviesYear, genresID) VALUES ($1, $2, $3) RETURNING *',
             [moviesName, moviesYear, genreID]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});

app.get('/moviesid', async (req, res) => {

    try {
        const result = await pgPool.query('SELECT * FROM moviesid');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

app.get('/moviesid/search', async (req, res) => {
    const { keyword = '' } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword required' });
    }

    try {
        const result = await pgPool.query(
            'SELECT * FROM moviesID WHERE moviesName ILIKE $1',
            [`%${keyword}%`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No movies found' });
        }

        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/moviesid/:id', async (req, res) => {
    const movieID = req.params.id;

    try {

        const result = await pgPool.query(
            'SELECT * FROM moviesID WHERE id = $1',
            [movieID]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found'});
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});



app.post('/genresid', async (req, res) => {
    const { genreName } = req.body;


    if (!genreName) {
        return res.status(400).json({ error: 'Valid genre name is required'});
    }

    try {

        const result = await pgPool.query(
            'INSERT INTO genresID (genreName) VALUES ($1) RETURNING *',
            [genreName]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
    
});
app.get('/genresid', async (req, res) => {
    try {
        const result = await pgPool.query('SELECT * FROM genresid');
        res.json(result.rows); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/usersid', async (req, res) => {

    try {
        const result = await pgPool.query('SELECT * FROM usersid');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

app.post('/usersid', async (req, res) => {
    const { name, username, password, birthyear} = req.body;

    if (!name || !username || !password || !birthyear) {
        return res.status(400).json({ error: 'Name, username, password and birthyear are required '});

    }

    try {
        const checkUser = await pgPool.query(
            'SELECT * FROM usersID WHERE username = $1',
            [username]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists'});
        }

        const result = await pgPool.query(
            'INSERT INTO usersID (name, username, password, birthyear) VALUES ($1, $2, $3, $4) RETURNING * ',
            [name, username, password, birthyear]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});



app.delete('/moviesid/:id', async (req, res) => {
    const movieID = req.params.id;

    try {
        const result = await pgPool.query(
            'DELETE FROM moviesID WHERE id = $1 RETURNING *',
            [movieID]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found'})
        }

        res.status(200).json({ message: 'Movie deleted'})
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
});

app.post('/reviewsid', async (req, res) => {
    const { username, movieID, movieStars, reviewText} = req.body;

    if (!username || !movieID || !movieStars || !reviewText) {
        return res.status(400).json({ error: 'Username, movie, rating and review are required'});
    }

    if (movieStars <1 || movieStars > 5) {
        return res.status(400).json({ error: 'Rating must 1-5 stars'})
    }

    try {
        const userResult = await pgPool.query(
            'SELECT id FROM usersID WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found'});
        }

        const userID = userResult.rows[0].id;

        const movieResult = await pgPool.query(
            'SELECT id FROM moviesID WHERE id = $1',
            [movieID]
        );

        if (movieResult.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found'})
        }

        const result = await pgPool.query(
            'INSERT INTO reviewID (reviewText, movieStars, movieID, userID) VALUES ($1, $2, $3, $4) RETURNING *',
            [reviewText, movieStars, movieID, userID]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});

app.post('/favoritesid', async (req, res) => {
    const { username, movieID} = req.body;

    if (!username || !movieID) {
        return res.status(400).json({ error: 'Username and movie id are required'})
    }

    try {
        const userResult = await pgPool.query(
            'SELECT id FROM usersID WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found'})

        }

        const userID = userResult.rows[0].id;

        const movieResult = await pgPool.query(
            'SELECT id FROM moviesID WHERE id = $1',
            [movieID]
        );

        if (movieResult.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found'})
        }

        const favoriteResult = await pgPool.query(
            'SELECT * FROM favoriteID WHERE userID = $1 AND movieID = $2',
            [userID, movieID]
        );

        if (favoriteResult.rows.length > 0) {
            return res.status(400).json({ error: 'Movie is already in the list'})
        }

        const result = await pgPool.query(
            'INSERT INTO favoriteID (userID, movieID) VALUES ($1, $2) RETURNING *',
            [userID, movieID]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
});

app.get('/favoritesid/:username', async (req, res) => {
    const { username} = req.params;

    try {
        const userResult = await pgPool.query(
            'SELECT id FROM usersID WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found'})
        }

        const userID = userResult.rows[0].id;

        const favoriteMovies = await pgPool.query(
            `SELECT m.id, m.moviesName, m.moviesYear, g.genreName
            FROM favoriteID f
            JOIN moviesID m ON f.movieID = m.id
            JOIN genresID g ON m.genresID = g.id
            WHERE f.userID = $1`,
            [userID]
        );

        if ( favoriteMovies.rows.length === 0) {
            return res.status(404).json({ error: 'No favorite movie found for this user'})
        }

        res.json(favoriteMovies.rows);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});
