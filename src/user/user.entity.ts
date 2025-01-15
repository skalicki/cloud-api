import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { File } from '../file/file.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid', { comment: 'Unique UUID for the user' })
    id: string;

    @Column({ unique: true, comment: 'Unique email address of the user used for login' })
    email: string;

    @Column({ comment: 'Hashed password of the user' })
    password: string;

    @Column({ comment: 'First name of the user' })
    firstName: string;

    @Column({ comment: 'Last name of the user' })
    lastName: string;

    @Column({ nullable: true, comment: 'Profile picture URL of the user (optional)' })
    avatarUrl: string;

    @Column({ default: false, comment: 'Indicates whether the email address is verified' })
    isVerified: boolean;

    @Column({ default: false, comment: 'Indicates whether the user has administrative privileges' })
    isAdmin: boolean;

    @CreateDateColumn({ comment: 'The date when the user registered' })
    createdAt: Date;

    @UpdateDateColumn({ comment: 'The date when the user profile was last updated' })
    updatedAt: Date;

    @OneToMany(() => File, (file) => file.owner, { cascade: true })
    files: File[];
}
