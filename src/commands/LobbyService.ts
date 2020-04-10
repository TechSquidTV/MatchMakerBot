import { CommandMessage } from "@typeit/discord"
import LobbyModel from '../models/Lobby'
import Utils from '../utils'
import { MessageEmbed } from 'discord.js'

enum lobbyStatus {
  "CREATED",
  "ACTIVE",
  "CLOSED"
}

export default class LobbyService {

  static createGameLobbyMessage(command: CommandMessage, event: Ievent){
    let template =  new MessageEmbed()
      .setTitle(`Join to play: ${event.game.name}`)
      .setThumbnail("https:" + event.game.artwork)
      .setDescription("press the button to join")
      .addField("test", "value")
      .setFooter("matchmakerbot","https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/discord-512.png")
    console.log("TEMPLATE: ", template)
    return template
  }

  static async create(command: CommandMessage, game: string, when: string) {
    // 1. Create voice channel
    // 2. Move user to voice channel (if instant)
    // 3. Display new game lobby in text chat as embed with join command
    if (game.length == 0) {
      //Throw an error to the discord channel using some utility class
      console.log("Missing Game")
    } else {
      let gameObject = await Utils.fetchGame(game)
      let event = {game: gameObject, when, status: "CREATED"}
      // If 'when' is NOT set, then we execute the lobby now, rather than schedule it.
      if (when == undefined) {
        //execute game lobby
        event.status = "ACTIVE"
        console.log("Created instant lobby for game: ", game)
        command.reply(`Creating instant lobby for ${gameObject.name}`)
        
      }
      // Save the event
      try {
        await LobbyModel.create(event)
        let lobbyMessage = this.createGameLobbyMessage(command, event)
        command.channel.send({embed: lobbyMessage})
          .catch(e => {
            console.log("FAILED TO SEND TO LOBBY: ", e)
          })
        console.log("Event Created")
      } catch (e) {
        console.log("Failed to create the event: " + e)
      }
    }
  }

}
