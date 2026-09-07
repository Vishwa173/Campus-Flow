package com.campusflow.event;

import com.campusflow.event.dto.CreateEventRequest;
import com.campusflow.event.dto.EventResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.campusflow.event.dto.UpdateEventRequest;

import java.util.List;

@RestController
@RequestMapping("/api/organizations/{organizationId}/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @PathVariable Long organizationId,
            @Valid @RequestBody CreateEventRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);
        EventResponse event = eventService.createEvent(userId,organizationId,request);
        return ResponseEntity.ok(event);
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getOrganizationEvents(@PathVariable Long organizationId,Authentication authentication) {
        Long userId = getUserId(authentication);

        return ResponseEntity.ok(eventService.getOrganizationEvents(userId,organizationId));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEvent(
            @PathVariable Long organizationId,
            @PathVariable Long eventId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return ResponseEntity.ok(eventService.getEvent(userId,organizationId,eventId));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long organizationId,
            @PathVariable Long eventId,
            @Valid @RequestBody UpdateEventRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);
    
        EventResponse event = eventService.updateEvent(
                userId,
                organizationId,
                eventId,
                request
        );
    
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long organizationId,@PathVariable Long eventId,Authentication authentication) {
        Long userId = getUserId(authentication);
        eventService.deleteEvent(userId,organizationId,eventId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{eventId}/publish")
    public ResponseEntity<EventResponse> publishEvent(
            @PathVariable Long organizationId,
            @PathVariable Long eventId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);
        EventResponse event = eventService.publishEvent(userId,organizationId,eventId);
        return ResponseEntity.ok(event);
    }

    private Long getUserId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return Long.valueOf(jwt.getSubject());
    }
}