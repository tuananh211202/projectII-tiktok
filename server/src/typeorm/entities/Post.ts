import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;
    
    @Column()
    description: string;

    @Column()
    driveId: string;
    
    @Column({ type: 'bigint' })
    cost: number;

    @Column({ type: 'bigint' })
    react: number;

    @Column()
    permission: string;

    @ManyToOne(() => User,(user) => user.posts)
    user: User;

    @OneToMany(() => Comment,(comment) => comment.post)
    comments: Comment[];
}