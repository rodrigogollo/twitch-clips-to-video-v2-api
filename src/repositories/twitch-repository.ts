import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'
import { getTwitchToken } from '../config/twitch'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })


async function setHeaders() {
  const token = await getTwitchToken()
  return {
    Authorization: `Bearer ${token} `,
    "Client-Id": process.env.CLIENT_ID,
  }
}

export async function getGameByName(name) {
  const headers = await setHeaders()
  let res = await axios.get("https://api.twitch.tv/helix/games", {
    headers,
    params: {
      name,
    },
  });
  return res.data
}

export async function getGameById(id) {
  const headers = await setHeaders()
  let res = await axios.get("https://api.twitch.tv/helix/games", {
    headers,
    params: {
      id,
    },
  });
  return res.data;
}

export async function getUserByLogin(login) {
  const headers = await setHeaders()
  let res = await axios.get("https://api.twitch.tv/helix/users", {
    headers,
    params: {
      login,
    },
  });
  return res.data;
}

export async function getClipsByBroadcaster(broadcaster_id, first, started_at, ended_at) {
  const headers = await setHeaders()

  let res = await axios.get("https://api.twitch.tv/helix/clips", {
    headers,
    params: {
      broadcaster_id,
      first,
      started_at,
      ended_at,
    },
  });
  return res.data;
}

export async function getClipsByGame(game_id, first, started_at, ended_at, cursor = null, results = []) {
  const headers = await setHeaders()
  let params = {
    game_id,
    first,
    started_at,
    ended_at,
    after: cursor === null ? undefined : cursor
  };

  // if (cursor != null) {
  //   Object.assign(params, { after: cursor });
  // }

  let res = await axios.get("https://api.twitch.tv/helix/clips", { headers, params });
  results.push(res.data.data);

  if (cursor !== null && res.data.pagination.cursor !== cursor) {
    return getClipsByGame(game_id, first, started_at, ended_at, res.data.pagination.cursor, results);
  }
  return { data: results.flat() };
}