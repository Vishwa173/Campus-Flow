package com.campusflow.organization;

import com.campusflow.organization.dto.CreateOrganizationRequest;
import com.campusflow.organization.dto.MyOrganizationResponse;
import com.campusflow.organization.dto.OrganizationResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;
    private final OrganizationAuthorizationService authorizationService;

    public OrganizationController(OrganizationService organizationService, OrganizationAuthorizationService organizationAuthorizationService) {
        this.organizationService = organizationService;
        this.authorizationService = organizationAuthorizationService;
    }

    @PostMapping
    public ResponseEntity<OrganizationResponse> createOrganization(@Valid @RequestBody CreateOrganizationRequest request,Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = Long.valueOf(jwt.getSubject());

        OrganizationResponse organization = organizationService.createOrganization(userId,request);

        return ResponseEntity.ok(organization);
    }

    @GetMapping("/{organizationId}/admin-test")
    public ResponseEntity<String> adminTest(@PathVariable Long organizationId,Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = Long.valueOf(jwt.getSubject());

        authorizationService.requireRole(userId,organizationId,OrganizationMember.Role.ORGANIZATION_ADMIN);

        return ResponseEntity.ok("You are an organization admin.");
    }

    @GetMapping("/me")
    public ResponseEntity<List<MyOrganizationResponse>> getMyOrganizations(Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();

        Long userId = Long.valueOf(jwt.getSubject());

        return ResponseEntity.ok(organizationService.getMyOrganizations(userId));
    }
}