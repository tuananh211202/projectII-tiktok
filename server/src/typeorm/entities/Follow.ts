import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "follow" })
export class Follow {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;
    // Người được theo dõi
    @ManyToOne(() => User, (user) => user.following)
    following: User;
    // Người theo dõi
    @ManyToOne(() => User, (user) => user.followers)
    followers: User;
}