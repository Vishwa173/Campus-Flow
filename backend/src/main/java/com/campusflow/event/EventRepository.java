package com.campusflow.event;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizationId(Long organizationId);

    Optional<Event> findByIdAndOrganizationId(Long eventId,Long organizationId);
}