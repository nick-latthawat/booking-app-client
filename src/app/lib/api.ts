const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string) {
    const res = `${apiUrl}${path}`;
    if (res == "") throw new Error("API Error");
    return res;
}
