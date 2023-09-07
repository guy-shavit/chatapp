import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GroupMember } from "./GroupMember";

// this is a table in the users database 
@Entity()
export class User {

    @PrimaryGeneratedColumn('increment',{
        type: 'bigint',
        name: 'user_id'
    })
    id: number;

    @Column({
        nullable: true,
        default: 'default.jpg'
    })
    profile_image: string;


    @Column({
        nullable: false,
        default: ''
    })
    username: string;

    @Column({
        nullable: false,
        default: ''
    })
    password: string;

    @Column({
        nullable: true,
    })
    socketId: string;

    

    @OneToMany(() => GroupMember, (groupMember) => groupMember.user)
    groupMembers: GroupMember[];

   


}