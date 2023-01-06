import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { isAdmin } from "./chat-is-object.methods";
import {
  hasMultipleAdmins,
  validateChatroomDto,
} from "./chat-validators.methods";
import { Chatroom } from "./chat.entity";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { BanUserDto } from "./dto/punish-user.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {}

  async createChatroom(
    createChatroomDto: CreateChatroomDto,
  ): Promise<Chatroom> {
    if (validateChatroomDto(createChatroomDto) === true) {
      const newChatroom = this.chatroomRepository.create(createChatroomDto);
      return this.chatroomRepository.save(newChatroom);
    }
    throw new HttpException(
      "Unable to create chatroom",
      HttpStatus.BAD_REQUEST,
    );
  }

  async getChatroomById(id: number): Promise<Chatroom> {
    const chatroom = await this.chatroomRepository.findOneBy({
      id: id,
    });
    if (!chatroom) {
      throw new HttpException("Chatroom not found", HttpStatus.NOT_FOUND);
    }
    return chatroom;
  }

  async addMemberToChatroom(
    id: number,
    addMemberDto: AddMemberDto,
  ): Promise<void> {
    const chatroom = await this.getChatroomById(id);
    if (chatroom) {
      this.chatroomRepository.update(id, addMemberDto);
    }
  }

  async addAdminToChatroomById(
    chatroomId: number,
    adminId: number,
    addAdminDto: AddAdminDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (isAdmin(chatroom, adminId) == true)
      this.chatroomRepository.update(chatroomId, addAdminDto);
    else
      throw new HttpException(
        "User does not have the right permissions to perform this action",
        HttpStatus.BAD_REQUEST,
      );
    return await this.getChatroomById(chatroomId);
  }

  async banUserFromChatroom(
    chatroomId: number,
    adminId: number,
    banUserDto: BanUserDto,
  ) {
    const chatroom = await this.getChatroomById(chatroomId);
    // create a pentalty object
    // then save that into chat
    if (isAdmin(chatroom, adminId) == true) {
    }
  }
}
