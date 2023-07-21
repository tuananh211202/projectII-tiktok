export type CreateUserParams = {
    username: string;
    password: string;
    name: string;
    description: string;
}

export type CreateUserNotiParams = {
    description: string;
    isRead: number;
    type: string;
}

export type GetNotiParams = {
    id: number;
}

export type CreateMessageParams = {
    description: string;
    senderId: number;
    receiverId: number;
}

export type UpdateUserParams = {
    name: string;
    description: string;
}

export type UpdatePasswordParams = {
    old_password: string;
    password: string;
}

export type UploadPostParams = {
    description: string;
    driveId: string;
    cost: number;
    permission: string;
}