package com.campusflow.event.dto;

import com.campusflow.event.Event;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        Long organizationId,
        Long categoryId,
        String title,
        String description,
        String venue,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer capacity,
        Event.Status status,
        String bannerUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static EventResponse from(Event event) {
        return new EventResponse(
                event.getId(),
                event.getOrganization().getId(),
                event.getCategory().getId(),
                event.getTitle(),
                event.getDescription(),
                event.getVenue(),
                event.getStartTime(),
                event.getEndTime(),
                event.getCapacity(),
                event.getStatus(),
                event.getBannerUrl(),
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
}