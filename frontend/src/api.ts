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

export async function getOrganizationEvents(organizationId: number) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/organizations/${organizationId}/events`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch organization events");
    }

    return response.json();
}

export async function createEvent(
    organizationId: number,
    data: {
        title: string;
        description?: string;
        venue: string;
        startTime: string;
        endTime: string;
        capacity: number;
        categoryId: number;
        bannerUrl?: string;
    }
) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/organizations/${organizationId}/events`,
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
        throw new Error("Failed to create event");
    }

    return response.json();
}

export async function getEvent(organizationId: number, eventId: number) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/organizations/${organizationId}/events/${eventId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch event");
    }

    return response.json();
}

export async function updateEvent(
    organizationId: number,
    eventId: number,
    data: {
        title: string;
        description?: string;
        venue: string;
        startTime: string;
        endTime: string;
        capacity: number;
        categoryId: number;
        bannerUrl?: string;
    }
) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/organizations/${organizationId}/events/${eventId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update event");
    }

    return response.json();
}

export async function publishEvent(organizationId: number, eventId: number) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/organizations/${organizationId}/events/${eventId}/publish`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to publish event");
    }

    return response.json();
}