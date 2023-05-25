import express from 'express';
import cors from 'cors';
import { getAllGamesByListId, getClipsByBroadcaster } from './repositories/twitch-repository'

const app = express();
const port = 3000;
app.use(cors())

app.get('/clips', async (req, res) => {
  const clips = await getClipsByBroadcaster(121059319, 10, '2023-05-02T00:00:00Z', new Date())
  const gameListIds = clips.data.map(clip => clip.game_id)
  const games = await getAllGamesByListId(gameListIds)

  clips.data.map(clip => {
    clip.game = games.find(game => game.id === clip.game_id)
  })
  res.send(clips);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});