import type { ComponentType } from 'react';

type PageModule = { default: ComponentType };
type PageLoader = () => Promise<unknown>;

const pages = import.meta.glob('../../pages/**/*.tsx');

function pageKey(name: string): string {
    return `../../pages/${name}.tsx`;
}

export async function resolvePage(name: string): Promise<ComponentType> {
    const loader = pages[pageKey(name)] as PageLoader | undefined;

    if (!loader) {
        throw new Error(`Inertia page not found: ${name}`);
    }

    const module = (await loader()) as PageModule;
    return module.default;
}

export function preloadPage(name: string): void {
    const loader = pages[pageKey(name)] as PageLoader | undefined;
    void loader?.();
}
