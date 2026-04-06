const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.API_PORT || 3000;

// MAMP MySQL: port 3306, default user root, password often root or empty
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'music',
};

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'] }));
app.use(express.json());

// Map DB row to API shape (IMAGE_NAME -> image)
function toAlbum(row) {
  return {
    id: row.ID,
    title: row.TITLE,
    artist: row.ARTIST,
    year: row.YEAR,
    image: row.IMAGE_NAME,
    description: row.DESCRIPTION,
  };
}

function toTrack(row) {
  return {
    id: row.ID,
    albumId: row.ALBUM_ID,
    number: row.NUMBER,
    title: row.TITLE,
    lyrics: row.LYRICS,
    video: row.VIDEO,
  };
}

async function fetchTracksByAlbumIds(connection, albumIds) {
  if (!albumIds?.length) return new Map();

  const placeholders = albumIds.map(() => '?').join(',');
  const [trackRows] = await connection.execute(
    `SELECT * FROM TRACK WHERE ALBUM_ID IN (${placeholders}) ORDER BY ALBUM_ID, NUMBER, ID`,
    albumIds
  );

  const tracksByAlbumId = new Map();
  for (const row of trackRows) {
    const track = toTrack(row);
    if (!tracksByAlbumId.has(track.albumId)) tracksByAlbumId.set(track.albumId, []);
    tracksByAlbumId.get(track.albumId).push(track);
  }

  return tracksByAlbumId;
}

// GET all albums
app.get('/albums', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM ALBUM ORDER BY ID');

    const albums = rows.map(toAlbum);
    const albumIds = albums.map((a) => a.id);
    const tracksByAlbumId = await fetchTracksByAlbumIds(connection, albumIds);

    res.json(
      albums.map((album) => ({
        ...album,
        tracks: tracksByAlbumId.get(album.id) ?? [],
      }))
    );
  } catch (err) {
    console.error('GET /albums error:', err.message);
    res.status(500).json({ error: 'Failed to load albums' });
  } finally {
    if (connection) await connection.end();
  }
});

// GET albums by description search (substring, case-insensitive)
app.get('/albums/search/description/:term', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const term = req.params.term.replace(/%/g, '\\%');
    const [rows] = await connection.execute(
      'SELECT * FROM ALBUM WHERE LOWER(DESCRIPTION) LIKE LOWER(?) ORDER BY ID',
      [`%${term}%`]
    );

    const albums = rows.map(toAlbum);
    const albumIds = albums.map((a) => a.id);
    const tracksByAlbumId = await fetchTracksByAlbumIds(connection, albumIds);

    res.json(
      albums.map((album) => ({
        ...album,
        tracks: tracksByAlbumId.get(album.id) ?? [],
      }))
    );
  } catch (err) {
    console.error('GET /albums/search/description error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  } finally {
    if (connection) await connection.end();
  }
});

// GET one album (with tracks)
app.get('/albums/:albumId', async (req, res) => {
  let connection;
  try {
    const albumId = parseInt(req.params.albumId, 10);
    if (Number.isNaN(albumId)) return res.status(400).json({ error: 'Invalid albumId' });

    connection = await mysql.createConnection(dbConfig);
    const [albumRows] = await connection.execute('SELECT * FROM ALBUM WHERE ID = ? LIMIT 1', [albumId]);
    const albumRow = albumRows?.[0];
    if (!albumRow) return res.status(404).json({ error: 'Album not found' });

    const [trackRows] = await connection.execute(
      'SELECT * FROM TRACK WHERE ALBUM_ID = ? ORDER BY NUMBER, ID',
      [albumId]
    );

    res.json({
      ...toAlbum(albumRow),
      tracks: trackRows.map(toTrack),
    });
  } catch (err) {
    console.error('GET /albums/:albumId error:', err.message);
    res.status(500).json({ error: 'Failed to load album' });
  } finally {
    if (connection) await connection.end();
  }
});

// POST create album
app.post('/albums', async (req, res) => {
  let connection;
  try {
    const title = req.body?.title?.trim();
    const artist = req.body?.artist?.trim();
    const description = req.body?.description ?? null;
    const image = req.body?.image ?? null;
    const yearRaw = req.body?.year ?? null;
    const tracks = Array.isArray(req.body?.tracks) ? req.body.tracks : [];

    if (!title || !artist) {
      return res.status(400).json({ error: 'title and artist are required' });
    }

    const year = yearRaw === '' || yearRaw == null ? null : Number(yearRaw);
    if (year != null && Number.isNaN(year)) {
      return res.status(400).json({ error: 'year must be a number' });
    }

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    const [result] = await connection.execute(
      'INSERT INTO ALBUM (TITLE, ARTIST, YEAR, IMAGE_NAME, DESCRIPTION) VALUES (?, ?, ?, ?, ?)',
      [title, artist, year, image, description]
    );

    const insertId = result?.insertId;

    for (const t of tracks) {
      const trackTitle = t?.title?.trim();
      if (!trackTitle) continue;

      const numberRaw = t?.number ?? null;
      const number = numberRaw === '' || numberRaw == null ? null : Number(numberRaw);
      if (number != null && Number.isNaN(number)) {
        await connection.rollback();
        return res.status(400).json({ error: 'track.number must be a number' });
      }

      const lyrics = t?.lyrics ?? null;
      const video = t?.video ?? null;

      await connection.execute(
        'INSERT INTO TRACK (ALBUM_ID, NUMBER, TITLE, LYRICS, VIDEO) VALUES (?, ?, ?, ?, ?)',
        [insertId, number, trackTitle, lyrics, video]
      );
    }

    await connection.commit();

    const [albumRows] = await connection.execute('SELECT * FROM ALBUM WHERE ID = ? LIMIT 1', [insertId]);
    const albumRow = albumRows?.[0];
    const [trackRows] = await connection.execute(
      'SELECT * FROM TRACK WHERE ALBUM_ID = ? ORDER BY NUMBER, ID',
      [insertId]
    );

    res.status(201).json({
      ...(albumRow ? toAlbum(albumRow) : { id: insertId, title, artist, year, image, description }),
      tracks: trackRows.map(toTrack),
    });
  } catch (err) {
    console.error('POST /albums error:', err.message);
    try {
      if (connection) await connection.rollback();
    } catch {}
    res.status(500).json({ error: 'Failed to create album' });
  } finally {
    if (connection) await connection.end();
  }
});

// PUT update album
app.put('/albums', async (req, res) => {
  let connection;
  try {
    const albumIdRaw = req.body?.albumId ?? req.body?.id ?? null;
    const albumId = albumIdRaw === '' || albumIdRaw == null ? NaN : Number(albumIdRaw);

    if (Number.isNaN(albumId)) {
      return res.status(400).json({ error: 'albumId is required' });
    }

    const title = req.body?.title?.trim();
    const artist = req.body?.artist?.trim();
    const description = req.body?.description ?? null;
    const image = req.body?.image ?? null;
    const yearRaw = req.body?.year ?? null;
    const tracks = Array.isArray(req.body?.tracks) ? req.body.tracks : [];

    if (!title || !artist) {
      return res.status(400).json({ error: 'title and artist are required' });
    }

    const year = yearRaw === '' || yearRaw == null ? null : Number(yearRaw);
    if (year != null && Number.isNaN(year)) {
      return res.status(400).json({ error: 'year must be a number' });
    }

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    const [updateResult] = await connection.execute(
      'UPDATE ALBUM SET TITLE = ?, ARTIST = ?, YEAR = ?, IMAGE_NAME = ?, DESCRIPTION = ? WHERE ID = ?',
      [title, artist, year, image, description, albumId]
    );

    if (!updateResult?.affectedRows) {
      await connection.rollback();
      return res.status(404).json({ error: 'Album not found' });
    }

    await connection.execute('DELETE FROM TRACK WHERE ALBUM_ID = ?', [albumId]);

    for (const t of tracks) {
      const trackTitle = t?.title?.trim();
      if (!trackTitle) continue;

      const numberRaw = t?.number ?? null;
      const number = numberRaw === '' || numberRaw == null ? null : Number(numberRaw);
      if (number != null && Number.isNaN(number)) {
        await connection.rollback();
        return res.status(400).json({ error: 'track.number must be a number' });
      }

      const lyrics = t?.lyrics ?? null;
      const video = t?.video ?? null;

      await connection.execute(
        'INSERT INTO TRACK (ALBUM_ID, NUMBER, TITLE, LYRICS, VIDEO) VALUES (?, ?, ?, ?, ?)',
        [albumId, number, trackTitle, lyrics, video]
      );
    }

    await connection.commit();

    const [albumRows] = await connection.execute('SELECT * FROM ALBUM WHERE ID = ? LIMIT 1', [albumId]);
    const albumRow = albumRows?.[0];
    const [trackRows] = await connection.execute(
      'SELECT * FROM TRACK WHERE ALBUM_ID = ? ORDER BY NUMBER, ID',
      [albumId]
    );

    res.json({
      ...(albumRow ? toAlbum(albumRow) : { id: albumId, title, artist, year, image, description }),
      tracks: trackRows.map(toTrack),
    });
  } catch (err) {
    console.error('PUT /albums error:', err.message);
    try {
      if (connection) await connection.rollback();
    } catch {}
    res.status(500).json({ error: 'Failed to update album' });
  } finally {
    if (connection) await connection.end();
  }
});

app.listen(PORT, () => {
  console.log(`Music API running at http://localhost:${PORT}`);
});
