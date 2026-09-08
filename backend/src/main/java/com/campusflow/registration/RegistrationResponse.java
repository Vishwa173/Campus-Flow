package com.campusflow.registration;
import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        Long eventId,
        Long organizationId,
        String eventTitle,
        RegistrationStatus status,
        LocalDateTime registeredAt

) {

    public static RegistrationResponse from( Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getEvent().getId(),
                registration.getEvent().getOrganization().getId(),
                registration.getEvent().getTitle(),
                registration.getStatus(),
                registration.getRegisteredAt()
        );
    }
}