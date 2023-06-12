import express from 'express';
import cors from 'cors';
import { getAllGamesByListId, getClipsByBroadcaster } from './repositories/twitch-repository'
import { getTwitchToken } from './config/twitch'

const app = express();
const port = process.env.PORT || 3000;
app.use(cors())

app.get('/', (req, res) => {
  return res.send('hello world')
})

app.get('/clips', async (req, res) => {
  const clips = await getClipsByBroadcaster(71092938, 30, '2023-05-02T00:00:00Z', new Date())
  const gameListIds = clips.data.map(clip => clip.game_id)
  const games = await getAllGamesByListId(gameListIds)

  clips.data.map(clip => {
    clip.game = games.find(game => game.id === clip.game_id)
    const viewK = formatter.format(clip.view_count)
    const durationTime = new Date(clip.duration * 1000).toISOString().substring(15, 19)
    clip.view_count = viewK
    clip.duration = durationTime
    return clip
  })
  res.send(clips);
});

app.get('/token', async (req, res) => {
  const token = await getTwitchToken()
  console.log('token', token)
  res.send(JSON.stringify(token));
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

var formatter = Intl.NumberFormat('en', { notation: 'compact' });
