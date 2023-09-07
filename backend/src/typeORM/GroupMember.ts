import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

// this is a table in the users database 
@Entity()
export class GroupMember {
    @PrimaryGeneratedColumn('increment',{
        type: 'bigint',
        name: 'group_member_id'
    })
    id: number;

    @Column({
        nullable: false,
        name: 'joined_datetime'
    })
    joinedDatetime: Date;

    @Column({nullable: true})
    userId: number;

    @ManyToOne(() => User, (user) => user.groupMembers, {
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({nullable: true})
    conversationId: number;

    @ManyToOne(() => Conversation, (conversation) => conversation.groupMembers, {
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: "conversationId" })
    conversation: Conversation;
}