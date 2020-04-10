import {
  Discord,
  On,
  Client, // Use the Client that is provided by @typeit/discord NOT discord.js
  Guard,
  Prefix,
  Command,
  CommandNotFound,
  MetadataStorage,
  CommandMessage
} from "@typeit/discord"
import { config as envConfig } from "dotenv"
envConfig()

import Utils from "./utils"

import LobbyService from './commands/LobbyService'

import * as mongoose from "mongoose"
import { Util } from 'discord.js'

// Decorate the class with the @Discord() decorator
// You can specify the prefix for the @Command() decorator
@Discord({ prefix: "!" })
abstract class AppDiscord {
  private static _client: Client

  static start() {
    this._client = new Client()
    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    this._client.login(
      `${process.env.BOT_TOKEN}`,
      `${__dirname}/*Discord.ts` // glob string to load the classes
    )
  }

  // The onMessage method but with @Command() decorator

  @Command("makeLobby", {
    description: "Start a lobby and invite others to join. ",
    infos: { infoA: "my info" }
  })
  async makeLobby(command: CommandMessage) {
    let messageParams = Utils.parsedParams(command)
    await LobbyService.create(command, messageParams[0], messageParams[1])
  }

  
}

async function start() {
  // Init mongodb
  await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  
  // Start the discord bot
  AppDiscord.start()
}


start()