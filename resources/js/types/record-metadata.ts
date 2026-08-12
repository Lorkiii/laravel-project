export type RecordCreator = {
    id: number;
    name: string;
    username: string;
};

export type RecordMetadata = {
    creator: RecordCreator | null;
    created_at: string | null;
    updated_at: string | null;
};
