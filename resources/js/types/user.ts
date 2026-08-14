import type { RecordMetadata } from '@/types/record-metadata';

export type UserStatus = 'active' | 'inactive';

export type UserRoleOption = {
    value: string;
    label: string;
};

export type ManagedUser = {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    username: string;
    email: string;
    phone_number: string | null;
    role: string | null;
    status: UserStatus;
};

export type ManagedUserDetails = ManagedUser &
    Pick<RecordMetadata, 'created_at' | 'updated_at'>;

export type UserFormValues = {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    role: string;
    is_active: boolean;
};

export type CreatedUserCredentials = {
    email: string;
    username: string;
    password: string;
};
