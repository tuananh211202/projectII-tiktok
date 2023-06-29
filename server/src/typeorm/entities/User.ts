import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Noti } from "./Noti";
import { Follow } from "./Follow";

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
    notis: Noti[];
    // Người mình đang theo dõi
    @OneToMany(() => Follow, (follow) => follow.following)
    following: Follow[];
    // Người đang theo dõi mình
    @OneToMany(() => Follow, (follow) => follow.followers)
    followers: Follow[]
}