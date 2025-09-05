const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string, options?: RequestInit) {
    const res = await fetch(`${apiUrl}${path}`, options);
    if (!res.ok) throw new Error("API Error");
    return res.json();
}
