import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const { CLIENT_ID, CLIENT_SECRET } = process.env

export async function getTwitchToken(): Promise<any> {

  const res = await axios.post('https://id.twitch.tv/oauth2/token',
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    },
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  )

  if (res.status === 200) {
    return res.data.access_token
  }
}
