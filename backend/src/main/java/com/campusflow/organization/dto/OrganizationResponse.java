package com.campusflow.organization.dto;

import com.campusflow.organization.Organization;

public record OrganizationResponse(
        Long id,
        String name,
        String description,
        String logoUrl
) {

    public static OrganizationResponse from(Organization organization) {
        return new OrganizationResponse(
                organization.getId(),
                organization.getName(),
                organization.getDescription(),
                organization.getLogoUrl()
        );
    }
}