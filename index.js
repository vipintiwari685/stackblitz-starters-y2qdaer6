const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('static'));

let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllMovies() {
  let query = 'SELECT * from movies';
  let response = await db.all(query, []);
  return { movies: response };
}
app.get('/movies', async (req, res) => {
  try {
    let results = await fetchAllMovies();

    if (results.movies.length === 0) {
      return res.status(404).json({ message: 'No movies found!!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchMoviesByGenre(genre) {
  let query = 'SELECT * from movies WHERE genre = ?';
  let response = await db.all(query, [genre]);

  return { movies: response };
}
app.get('/movies/genre', async (req, res) => {
  try {
    let genre = req.query.genre;
    let results = await fetchMoviesByGenre(genre);
    if (results.movies.length === 0) {
      return res.status(404).json({ message: 'No movies for this genre' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchMovieById(id) {
  let query = 'SELECT * FROM movies WHERE id = ?';
  let response = await db.get(query, [id]);

  return { movie: response };
}
app.get('/movies/details', async (req, res) => {
  try {
    let id = req.query.id;
    let results = await fetchMovieById(id);
    if (results.movie === undefined) {
      return res.status(404).json({ message: 'No movie for this id' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchMoviesByReleaseYear(year) {
  let query = 'SELECT * FROM movies WHERE release_year = ?';
  let response = await db.all(query, [year]);
  return { movies: response };
}
app.get('/movies/release-years', async (req, res) => {
  try {
    let releaseYear = req.query.release_year;
    console.log(releaseYear);
    let results = await fetchMoviesByReleaseYear(releaseYear);
    if (results.movies.length === 0) {
      return res.status(404).json({ message: 'No movies for this year' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchMoviesByActor(actor) {
  let query = 'SELECT * FROM movies WHERE actor = ?';
  let response = await db.all(query, [actor]);
  return { movies: response };
}
app.get('/movies/actor', async (req, res) => {
  try {
    let actor = req.query.actor;
    let results = await fetchMoviesByActor(actor);
    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No movies found for actor: ' + actor });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchMoviesByDirector(director) {
  let query = 'SELECT * FROM movies WHERE director = ?';
  let response = await db.all(query, [director]);
  return { movies: response };
}

app.get('/movies/director', async (req, res) => {
  try {
    let director = req.query.director;
    let results = await fetchMoviesByDirector(director);
    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No movies found for director: ' + director });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllMoviesITR() {
  let query = 'SELECT id, title, release_year from movies';
  let response = await db.all(query, []);
  return { movies: response };
}
app.get('/movies_itr', async (req, res) => {
  try {
    let results = await fetchAllMoviesITR();

    if (results.movies.length === 0) {
      return res.status(404).json({ message: 'No movies found!!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllMoviesITAR(actor) {
  let query =
    'SELECT id, title, actor, release_year from movies WHERE actor = ?';
  let response = await db.all(query, [actor]);
  return { movies: response };
}
app.get('/movies_itar', async (req, res) => {
  try {
    let actor = req.query.actor;
    let results = await fetchAllMoviesITAR(actor);

    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No movies found for actor: ' + actor });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllMoviesITDR(director) {
  let query =
    'SELECT id, title, director, release_year from movies WHERE director = ?';
  let response = await db.all(query, [director]);
  return { movies: response };
}
app.get('/movies_itdr', async (req, res) => {
  try {
    let director = req.query.director;
    let results = await fetchAllMoviesITDR(director);

    if (results.movies.length === 0) {
      return res.status(404).json({ message: 'No movies found!!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterByYearAndActor(releaseYear, actor) {
  let query = 'SELECT * FROM movies WHERE release_year = ? AND actor = ?';
  let response = await db.all(query, [releaseYear, actor]);
  return { movies: response };
}
app.get('/movies/year-actor', async (req, res) => {
  let releaseYear = req.query.releaseYear;
  let actor = req.query.actor;
  try {
    let results = await filterByYearAndActor(releaseYear, actor);
    if (results.movies.length === 0) {
      return res.status(404).json({
        message: 'No movies found for year ' + releaseYear + ' by ' + actor,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterAwardWinningMovies() {
  let query = 'SELECT * FROM movies WHERE rating >= 4.5 ORDER BY rating';
  let response = await db.all(query, []);
  return { movies: response };
}
app.get('/movies/award-winning', async (req, res) => {
  try {
    let results = await filterAwardWinningMovies();
    if (results.movies.length === 0) {
      return res.status(404).json({
        message: 'No award winning movies found ',
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterBlockbusterMovies() {
  let query =
    'SELECT * FROM movies WHERE box_office_collection >= 100 ORDER BY box_office_collection DESC';
  let response = await db.all(query, []);
  return { movies: response };
}
app.get('/movies/blockbuster', async (req, res) => {
  try {
    let results = await filterBlockbusterMovies();
    if (results.movies.length === 0) {
      return res.status(404).json({
        message: 'No blockbuster movies found',
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
