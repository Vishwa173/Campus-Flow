package com.campusflow.organization.dto;

import com.campusflow.organization.OrganizationMember;

public record MyOrganizationResponse(
        Long id,
        String name,
        String description,
        String logoUrl,
        OrganizationMember.Role role
) {}