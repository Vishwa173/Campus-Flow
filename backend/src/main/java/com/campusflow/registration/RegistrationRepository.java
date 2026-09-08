package com.campusflow.registration;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {

    Optional<Registration> findByUserIdAndEventId(
            Long userId,
            Long eventId
    );

    List<Registration> findByUserIdAndStatus(
            Long userId,
            RegistrationStatus status
    );

    long countByEventIdAndStatus(
            Long eventId,
            RegistrationStatus status
    );
}