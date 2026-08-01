export type SidebarFilterItem = {
    id: string;
    label: string;
    href?: string;
    permission?: string;
    children?: SidebarFilterItem[];
};

function hasPermission(permissions: string[], permission?: string): boolean {
    if (!permission) {
        return true;
    }

    return permissions.includes(permission);
}

/**
 * Filters the sidebar tree by permissions and flattens groups that
 * only have a single visible child after filtering.
 */
export function filterSidebarNav<T extends SidebarFilterItem>(
    items: T[],
    permissions: string[],
): T[] {
    const filtered: T[] = [];

    for (const item of items) {
        if (item.children?.length) {
            const visibleChildren = item.children.filter((child) =>
                hasPermission(permissions, child.permission),
            ) as T[];

            if (visibleChildren.length === 0) {
                continue;
            }

            if (visibleChildren.length === 1) {
                filtered.push({ ...visibleChildren[0] });
                continue;
            }

            filtered.push({
                ...item,
                children: visibleChildren,
            });
            continue;
        }

        if (!hasPermission(permissions, item.permission)) {
            continue;
        }

        filtered.push(item);
    }

    return filtered;
}

export function isSidebarPathActive(pathname: string, href?: string): boolean {
    if (!href) {
        return false;
    }

    if (pathname === href) {
        return true;
    }

    if (href === "/") {
        return false;
    }

    return pathname.startsWith(`${href}/`);
}

export function groupContainsActivePath(
    item: SidebarFilterItem,
    pathname: string,
): boolean {
    if (!item.children?.length) {
        return false;
    }

    return item.children.some((child) =>
        isSidebarPathActive(pathname, child.href),
    );
}
