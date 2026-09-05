package com.campusflow.organization;

import com.campusflow.common.exception.ForbiddenException;
import org.springframework.stereotype.Service;

@Service
public class OrganizationAuthorizationService {

    private final OrganizationMemberRepository memberRepository;

    public OrganizationAuthorizationService(OrganizationMemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public OrganizationMember.Role getRole(Long userId,Long organizationId) {
        return memberRepository.findRole(userId,organizationId).orElseThrow(() ->
                new ForbiddenException("You are not a member of this organization")
        );
    }

    public void requireRole(Long userId,Long organizationId,OrganizationMember.Role requiredRole) {
        OrganizationMember.Role actualRole = getRole(userId, organizationId);

        if (actualRole != requiredRole) {
            throw new ForbiddenException("You do not have permission to perform this action");
        }
    }
}