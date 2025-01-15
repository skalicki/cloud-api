import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('files')
export class File {
    @PrimaryGeneratedColumn('uuid', { comment: 'Unique UUID for the file' })
    id: string;

    @Column({ comment: 'Original name of the file uploaded by the user' })
    name: string;

    @Column({ comment: 'Storage path of the file (e.g., S3 bucket or local directory)' })
    path: string;

    @Column({ nullable: true, comment: 'MIME type of the file (e.g., "image/png", "application/pdf")' })
    mimeType: string;

    @Column({ comment: 'Size of the file in bytes' })
    size: number;

    @Column({ default: false, comment: 'Indicates whether the file is publicly accessible' })
    isPublic: boolean;

    // @ManyToOne(() => User, (user) => user.files)
    // owner: User;

    @CreateDateColumn({ comment: 'The date when the file was uploaded' })
    createdAt: Date;

    @UpdateDateColumn({ comment: 'The date when the file was last modified' })
    updatedAt: Date;

    // @Column('simple-array', { nullable: true, comment: 'List of user IDs with whom the file is shared' })
    // sharedWith: string[];
}
