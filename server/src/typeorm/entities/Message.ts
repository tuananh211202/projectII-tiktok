import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'message' })
export class Message {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    description: string;
    // Người gửi

    @Column()
    createAt: Date;

    @ManyToOne(() => User, (user) => user.senders)
    sender: User;
    // Người nhận
    @ManyToOne(() => User, (user) => user.receivers)
    receiver: User;
}