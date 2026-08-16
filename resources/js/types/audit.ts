export type AuditAction = 'created' | 'updated';

export type AuditSubjectType = 'product' | 'category' | 'user';

export type AuditEventRow = {
    id: number;
    created_at: string;
    actor_name: string;
    actor_role: string | null;
    action: AuditAction;
    subject_type: AuditSubjectType;
    subject_label: string;
    changes_summary: string;
};

export type AuditTrailFilters = {
    period: number;
    subject_type: 'all' | AuditSubjectType;
    action: 'all' | AuditAction;
    actor_id: string;
};

export type AuditTrailActorOption = {
    id: number;
    name: string;
};
