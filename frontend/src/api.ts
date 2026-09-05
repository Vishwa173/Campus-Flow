import { getToken } from "./auth/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCurrentUser() {
    const token = getToken();

    const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch current user");
    }

    return response.json();
}

export async function getMyOrganizations() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/organizations/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch organizations");
    }

    return response.json();
}

export async function createOrganization(data: {
    name: string;
    description?: string;
    logoUrl?: string | null;
}) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/organizations`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create organization");
    }

    return response.json();
}