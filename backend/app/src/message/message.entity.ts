import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/user/user.entity";
import { Chatroom } from "src/chat/chat.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    name: "messageId",
  })
  public id!: number;

  @Column({
    nullable: false,
  })
  public body!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (userId: User) => userId.messages)
  @JoinColumn()
  public userId!: User;

  @ManyToOne(() => Chatroom, (chatroomId: Chatroom) => chatroomId.messages)
  @JoinColumn()
  public chatroomId!: Chatroom;
}
