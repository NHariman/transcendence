import { forwardRef, Inject } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { InviteToGameDto } from "./dto/invite-to-game.dto";
import { KickedAUserDto } from "./dto/kicked-a-user.dto";
import { PenaltyService } from "./penalty.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "penalty",
})
export class PenaltyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(forwardRef(() => PenaltyService))
    private readonly penaltyService: PenaltyService,
  ) {}

  @SubscribeMessage("newUserState")
  async joinedChat(client: Socket) {
    this.server.emit("userUpdate");
  }

  @SubscribeMessage("checkBan")
  async checkBan(client: Socket, payload: CreatePenaltyDto): Promise<void> {
    try {
      console.log(payload);
      this.server.emit("gotBanned", payload);
    } catch (err) {
      console.error(err);
    }
  }

  @SubscribeMessage("kickUser")
  async handleKick(client: Socket, payload: KickedAUserDto) {
    this.server.emit("kickedAUser", payload);
  }

  @SubscribeMessage("inviteToGame")
  async inviteToGame(client: Socket, payload: InviteToGameDto) {
    if (payload.status == "waiting") {
      this.server.emit("sendGameRequestToPlayerTwo", payload);
    } else if (payload.status == "accept") {
      // create the game here.
      this.server.emit("acceptedGameInvite", payload);
    } else if (payload.status == "reject") {
      // do whatever you need to safely reject the game invite here
      this.server.emit("declinedGameInvite", payload);
    } else if (payload.status == "cancel") {
      this.server.emit("canceledInvite", payload);
    } else {
      this.server.emit("inviteGameError", payload);
      console.error("Game invite failed");
    }
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}