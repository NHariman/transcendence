import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./user/user.entity";
import { Message } from "./message/message.entity";
import { Avatar } from "./avatar/avatar.entity";
import { Game } from "./game/entities/game.entity";
import { Match } from "./match/entities/match.entity";
import { Friend } from "./friend/friend.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        entities: [User, Message, Avatar, Game, Match, Friend],
        synchronize: true /* automatically updates database schema */,
      }),
    }),
  ],
})
export class DatabaseModule {}
