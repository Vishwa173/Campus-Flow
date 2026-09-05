package com.campusflow.organization;

import com.campusflow.organization.dto.CreateOrganizationRequest;
import com.campusflow.organization.dto.MyOrganizationResponse;
import com.campusflow.organization.dto.OrganizationResponse;
import com.campusflow.user.User;
import com.campusflow.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository memberRepository;
    private final UserRepository userRepository;

    public OrganizationService(OrganizationRepository organizationRepository,OrganizationMemberRepository memberRepository,UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrganizationResponse createOrganization(Long userId,CreateOrganizationRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() ->new IllegalArgumentException("User not found"));

        Organization organization = new Organization();

        organization.setName(request.name());
        organization.setDescription(request.description());
        organization.setLogoUrl(request.logoUrl());

        organization = organizationRepository.save(organization);

        OrganizationMember member = new OrganizationMember();

        member.setUser(user);
        member.setOrganization(organization);
        member.setRole(OrganizationMember.Role.ORGANIZATION_ADMIN);
        memberRepository.save(member);

        return OrganizationResponse.from(organization);
    }

    @Transactional(readOnly = true)
    public List<MyOrganizationResponse> getMyOrganizations(Long userId) {

        List<OrganizationMember> memberships = memberRepository.findByUserId(userId);

        return memberships.stream()
                .map(member -> {

                    Organization organization = member.getOrganization();

                    return new MyOrganizationResponse(
                            organization.getId(),
                            organization.getName(),
                            organization.getDescription(),
                            organization.getLogoUrl(),
                            member.getRole()
                    );
                }).toList();
    }
}