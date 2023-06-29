import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'user_notis' })
export class Noti {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    description: string;

    @ManyToOne(() => User, (user) => user.notis)
    user: User;
}