package com.campusflow.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember, Long> {
    Optional<OrganizationMember> findByUserIdAndOrganizationId(Long userId,Long organizationId);

    List<OrganizationMember> findByUserId(Long userId);

    @Query("""
            SELECT m.role
            FROM OrganizationMember m
            WHERE m.user.id = :userId
              AND m.organization.id = :organizationId
        """)
        Optional<OrganizationMember.Role> findRole(
                @Param("userId") Long userId,
                @Param("organizationId") Long organizationId
        );
}