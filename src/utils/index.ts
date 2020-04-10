import axios, { AxiosResponse } from 'axios'
import * as AxiosLogger from 'axios-logger'
import { CommandMessage } from '@typeit/discord'

const GameAPI = axios.create({
  baseURL: 'https://api-v3.igdb.com/',
  headers: {
    'Accept': 'application/json',
    'user-key': `${process.env.IGDB_TOKEN}`
  },
})
GameAPI.interceptors.request.use(AxiosLogger.requestLogger)

export default class Utils {

  static async searchGame(game: string): Promise<IGamesAPI>{
    console.log("Now searching for game: ", game)
    const { data } = await GameAPI({
      method: 'post',
      url: '/games',
      data: `search "${game}"; fields name;`
    })
    return data[0]
  }

  static async fetchGameCover(gameID: string): Promise<any>{
    let cover = await GameAPI({
      method: 'post',
      url: '/covers',
      data: `fields url; where game = ${gameID};`
    })
    return cover.data[0]
  }

  static async fetchGame(gameString: string): Promise<IgameObject>{
    let gameData = await this.searchGame(gameString)
    let gameCover = await this.fetchGameCover(gameData.id)
    return {
      name: gameData.name,
      artwork: gameCover.url,
      gameMode: "matchmaking"
    }
  }

  static parsedParams(command: CommandMessage): string[] {
    // Returns each string inside quotations 
    let args = command.params.join(' ')
    let regexp = /"(.*?)"/g
    let paramsRaw = [...args.matchAll(regexp)]
    let params = []
    paramsRaw.forEach((param, index) => {
      params.push(param[1])
    })
    return params
  }
}