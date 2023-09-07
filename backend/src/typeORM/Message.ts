import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne,
    PrimaryGeneratedColumn
 } from "typeorm";

 import { Conversation } from "./Conversation";

// this is a table in the users database 
@Entity()
export class Message {

    @PrimaryGeneratedColumn('increment',{
        type: 'bigint',
        name: 'message_id'
    })
    id: number;

    @Column({ // the user who sent the message
        nullable: true
    })
    from_user: string;

    @Column({ // the user who sent the message
        type: 'text',
        name: 'message_text'
    })
    text: string;

    @Column({ 
        type: 'datetime'
    })
    sent_datetime: Date;

    @Column({nullable: true})
    conversationId: number;

    @ManyToOne(() => Conversation,  (conversation) => conversation.messages, {
        onDelete: 'CASCADE' 
    })
    @JoinColumn({"name": "conversationId"})
    conversation: Conversation;
}