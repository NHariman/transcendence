import { Chatroom } from "src/chat/chat.entity";
import { Message } from "src/message/message.entity";
import { Avatar } from "src/avatar/avatar.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: "userId", // alias for the column
  })
  public id?: number;

  @Column({
    nullable: false,
  })
  public username!: string;

  @Column({
    unique: true,
    nullable: false, // column cannot be empty
  })
  public email!: string; // email must be unique

  @Column({
    nullable: false,
  })
  public password!: string;

  // add owner entity
  @OneToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.owner)
  @JoinColumn()
  public chatroomOwner!: Chatroom[];

  //link message table to user
  @OneToMany(() => Message, (messages: Message) => messages.userId)
  @JoinColumn()
  public messages!: Message[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.member, {
    cascade: true,
  })
  @JoinTable()
  public chatroomMember!: Chatroom[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.admin, {
    cascade: true,
  })
  @JoinTable()
  public chatroomAdmin!: Chatroom[];

  @Column({
    type: "boolean",
    default: false,
  })
  public twoFA!: boolean;

  @JoinColumn({ name: "avatarId" })
  @OneToOne(() => Avatar, {
    nullable: true,
  })
  @Column({ nullable: true })
  public avatarId?: number;

  // @OneToOne(() => Avatar, {
  //   nullable: true,
  // })
  // public avatar?: Avatar;
  // @JoinColumn({ name: "avatarId" })
  // @Column({ nullable: true })
  // public avatarId?: number;

  // @OneToOne(() => Avatar)
  // @JoinColumn()
  // avatar?: Avatar;
}
