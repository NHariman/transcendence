import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    private readonly userService: UserService,
  ) {}

  async findAll() {
    return await this.gameRepository.find({});
  }

  async findOne(gameId: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId,
      },
      relations: ["winnerId", "loserId"],
    });
    return game;
  }

  /* need to also add check to ensure they are not in playing status */
  async create(createGameDto: CreateGameDto) {
    const playerOne = await this.userService.findUserById(
      createGameDto.playerOne,
    );
    if (playerOne === null) {
      this.logger.debug("playerOne does not exist in database");
      throw new NotFoundException();
    }
    const playerTwo = await this.userService.findUserById(
      createGameDto.playerTwo,
    );
    if (playerTwo === null) {
      this.logger.debug("playerTwo does not exist in database");
      throw new NotFoundException();
    }
    return await this.gameRepository.save(createGameDto);
  }

  async update(updateGameDto: UpdateGameDto) {
    if (updateGameDto.id !== undefined) {
      if ((await this.findOne(updateGameDto.id)) == null) {
        this.logger.debug("game does not exist, unable to update");
        throw new NotFoundException(
          "Unable to update game because game does not exist",
        );
      }
      await this.gameRepository.update(updateGameDto.id, updateGameDto);

      await this.gameRepository
        .createQueryBuilder()
        .relation(Game, "loserId")
        .of(updateGameDto.id)
        .set(updateGameDto.loserId);

      const game = await this.gameRepository
        .createQueryBuilder()
        .relation(Game, "winnerId")
        .of(updateGameDto.id)
        .set(updateGameDto.winnerId);

      return this.findOne(updateGameDto.id);
    }
    throw new NotFoundException(
      "Unable to update game because no data received from dto",
    );
  }

  async remove(gameId: number) {
    if (this.findOne(gameId) == null) {
      this.logger.debug("game does not exist, unable to delete");
      throw new NotFoundException("game does not exist, unable to delete");
    }
    await this.gameRepository.delete(gameId);
  }
}
