interface IgameObject {
  name: string,
  artwork: string,
  gameMode: string
}

interface IGamesAPI {
  id: string,
  name: string
}

interface ICoversAPI {
  id: string,
  url: string
}
interface Ievent {
  game: IgameObject,
  when: string,
  status: lobbyStatus
}