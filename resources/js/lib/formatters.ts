export function formatDateTime(value: string | null): string {
    if (!value) {
        return 'Unknown';
    }

    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}
