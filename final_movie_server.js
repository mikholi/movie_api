import express from 'express';
import { pgPool } from './pg_connection.js';


const app = express();

app.listen(3001, () => {
    console.log('Server is running')
});

app.get('/moviesid', async (req, res) => {

    try {
        const result = await pgPool.query('SELECT * FROM moviesid');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})