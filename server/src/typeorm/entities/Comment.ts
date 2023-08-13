import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity({ name: "comment" })
export class Comment {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    description: string;
    
    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;
}