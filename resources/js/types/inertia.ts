export type SharedAuthUser = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    roles: string[];
    permissions: string[];
};

export type SharedPageProps = {
    app: {
        name: string;
    };
    auth: {
        user: SharedAuthUser | null;
    };
};
