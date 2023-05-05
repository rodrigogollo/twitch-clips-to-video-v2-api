import express from 'express';
import cors from 'cors';
import { getClipsByGame, getClipsByBroadcaster } from './repositories/twitch-repository'

const app = express();
const port = 3000;
app.use(cors())

app.get('/clips', async (req, res) => {
  // const clips = await getClipsByGame(32399, 10, '2022-07-26T00:00:00Z', new Date());
  const clips = await getClipsByBroadcaster(23936415, 10, '2023-05-02T00:00:00Z', new Date())
  res.send(clips);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});