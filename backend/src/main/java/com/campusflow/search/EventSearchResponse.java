package com.campusflow.search;

import java.time.LocalDateTime;

public record EventSearchResponse(
        Long id,
        Long organizationId,
        Long categoryId,
        String categoryName,
        String title,
        String description,
        String venue,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer capacity,
        String status,
        String bannerUrl
) {
    public static EventSearchResponse from(EventDocument event) {
        return new EventSearchResponse(
                event.getId(),
                event.getOrganizationId(),
                event.getCategoryId(),
                event.getCategoryName(),
                event.getTitle(),
                event.getDescription(),
                event.getVenue(),
                event.getStartTime(),
                event.getEndTime(),
                event.getCapacity(),
                event.getStatus(),
                event.getBannerUrl()
        );
    }
}