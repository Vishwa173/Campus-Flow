export type OrganizationRole =
    | "MEMBER"
    | "CHECKIN_STAFF"
    | "EVENT_MANAGER"
    | "ORGANIZATION_ADMIN";

export function canManageEvents(role: OrganizationRole) {
    return role === "EVENT_MANAGER" || role === "ORGANIZATION_ADMIN";
}

export function canManageMembers(role: OrganizationRole) {
    return role === "ORGANIZATION_ADMIN";
}

export function canManageOrganization(role: OrganizationRole) {
    return role === "ORGANIZATION_ADMIN";
}