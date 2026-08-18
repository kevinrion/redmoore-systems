async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        ...init,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export function getJson<T>(url: string): Promise<T> {
    return request<T>(url);
}

export function postJson<T>(url: string, body: unknown = {}): Promise<T> {
    return request<T>(url, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}
