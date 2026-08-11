export type SharedAuthUser = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string | null;
    roles: string[];
    permissions: string[];
};

export type SuccessModalPayload = {
    title: string;
    description: string;
    actionLabel?: string;
};

export type SharedPageProps = {
    app: {
        name: string;
    };
    auth: {
        user: SharedAuthUser | null;
    };
    flash: {
        success: string | null;
    };
};

export type AccountPageProps = {
    account: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        phone_number: string | null;
        roles: string[];
    };
};
