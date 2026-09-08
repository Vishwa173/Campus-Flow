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

export async function searchEvents(query: string,categoryId?: number) {
    const token = getToken();
    const params = new URLSearchParams();

    params.append("q", query);

    if (categoryId !== undefined) {
        params.append("categoryId", categoryId.toString());
    }

    const response = await fetch(
        `${API_URL}/api/search/events?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search events");
    }

    return response.json();
}

export async function registerForEvent(eventId: number) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/events/${eventId}/register`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to register for event");
    }

    return response.json();
}

export async function cancelRegistration(eventId: number) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/events/${eventId}/register`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to cancel registration");
    }
}

export async function checkRegistration(eventId: number) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/events/${eventId}/registration`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to check registration");
    }

    return response.json();
}

export async function getMyRegistrations() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/registrations/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch registrations");
    }

    return response.json();
}

export async function getRegistrationCount(eventId: number) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/api/events/${eventId}/registration/count`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch registration count");
    }

    return response.json();
}