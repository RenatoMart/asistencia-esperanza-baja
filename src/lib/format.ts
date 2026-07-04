// Utilidades puras compartidas por los módulos de Convertidos y Visitas.

export function initials(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 0 || parts[0] === '') return '?';
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Fecha local en formato ISO 'YYYY-MM-DD' (sin corrimiento por zona horaria de UTC).
export function toLocalIso(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Etiqueta relativa amable ("Hoy", "Ayer", "Hace N días", o fecha larga).
export function relativeDateLabel(iso: string, today = new Date()): string {
	const d = new Date(`${iso}T00:00:00`);
	const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const diffDays = Math.round((base.getTime() - d.getTime()) / DAY_MS);
	if (diffDays === 0) return 'Hoy';
	if (diffDays === 1) return 'Ayer';
	if (diffDays > 1 && diffDays < 7) return `Hace ${diffDays} días`;
	return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export interface DateGroup<T> {
	iso: string;
	label: string;
	items: T[];
}

// Agrupa por fecha de registro (campo `dateRegistered`), más reciente primero.
export function groupByDate<T extends { dateRegistered: string }>(
	list: T[],
	today = new Date(),
): DateGroup<T>[] {
	const map = new Map<string, T[]>();
	for (const item of list) {
		const arr = map.get(item.dateRegistered) ?? [];
		arr.push(item);
		map.set(item.dateRegistered, arr);
	}
	return [...map.entries()]
		.sort((a, b) => (a[0] < b[0] ? 1 : -1))
		.map(([iso, items]) => ({ iso, label: relativeDateLabel(iso, today), items }));
}
