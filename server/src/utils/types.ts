export type CreateUserParams = {
    username: string;
    password: string;
    name: string;
    description: string;
}

export type CreateUserNotiParams = {
    description: string;
}

export type GetNotiParams = {
    id: number;
}

export type CreateMessageParams = {
    description: string;
    senderId: number;
    receiverId: number;
}