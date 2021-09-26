export const entries = <K extends string, V>(o: Partial<Record<K, V>>) => Object.entries<V | undefined>(o) as [K, V][];

export const fromEntries = <K extends string, V>(t: [K, V][]) => Object.fromEntries<V>(t) as Record<K, V>;
