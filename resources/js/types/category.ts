export type CategoryStatus = 'active' | 'inactive';

export type Category = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    status: CategoryStatus;
};

export type CategoryFormValues = {
    code: string;
    name: string;
    description: string;
};
