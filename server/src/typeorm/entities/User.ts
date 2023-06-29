import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Noti } from "./Noti";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    createAt: Date;

    @OneToMany(() => Noti, (noti) => noti.user)
    notis: Noti[]
}