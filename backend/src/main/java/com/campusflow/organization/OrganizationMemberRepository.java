package com.campusflow.organization;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationMemberRepository
        extends JpaRepository<OrganizationMember, Long> {
}