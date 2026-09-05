package com.campusflow.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateOrganizationRequest(

        @NotBlank
        @Size(max = 150)
        String name,

        @Size(max = 5000)
        String description,

        @Size(max = 500)
        String logoUrl

) {}