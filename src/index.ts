import express, { Request } from 'express';
import cors from 'cors';
import { getAllGamesByListId, getClipsByGame, getGameByName, getClipsByBroadcaster } from './repositories/twitch-repository'
import { getTwitchToken } from './config/twitch'

const app = express();
const port = process.env.PORT || 3000;
app.use(cors())

app.get('/', (req, res) => {
  return res.send('hello world')
})

app.get('/ping', (req, res) => {
  return res.send('pong 🏓')
})

interface RequestParams {
  game: string
}

interface RequestQuery {
  size: number
}

app.get('/clips/game/:game', async (req: Request<RequestParams, RequestQuery>, res) => {
  const game = req.params.game
  const size = Number(req.query.size) || 20

  const gameArray = await getGameByName(game)
  const gameId = gameArray.data[0].id

  const today = new Date()
  const yesterday = new Date()
  yesterday.setMonth(today.getMonth() - 1)

  const clips = await getClipsByGame(gameId, size, yesterday.toISOString(), today.toISOString())
  // const clips = await getClipsByBroadcaster(71092938, size, '2023-05-02T00:00:00Z', new Date())
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
