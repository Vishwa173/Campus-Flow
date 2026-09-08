package com.campusflow.event;

import com.campusflow.category.Category;
import com.campusflow.category.CategoryRepository;
import com.campusflow.common.exception.ForbiddenException;
import com.campusflow.event.dto.CreateEventRequest;
import com.campusflow.event.dto.EventResponse;
import com.campusflow.event.dto.UpdateEventRequest;
import com.campusflow.organization.Organization;
import com.campusflow.organization.OrganizationAuthorizationService;
import com.campusflow.organization.OrganizationMember;
import com.campusflow.organization.OrganizationRepository;
import com.campusflow.search.EventSearchService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizationRepository organizationRepository;
    private final CategoryRepository categoryRepository;
    private final OrganizationAuthorizationService authorizationService;
    private final EventSearchService eventSearchService;

    public EventService(
            EventRepository eventRepository,
            OrganizationRepository organizationRepository,
            CategoryRepository categoryRepository,
            OrganizationAuthorizationService authorizationService,
            EventSearchService eventSearchService
    ) {
        this.eventRepository = eventRepository;
        this.organizationRepository = organizationRepository;
        this.categoryRepository = categoryRepository;
        this.authorizationService = authorizationService;
        this.eventSearchService = eventSearchService;
    }

    @Transactional
    public EventResponse createEvent(Long userId, Long organizationId, CreateEventRequest request) {

        OrganizationMember.Role role = authorizationService.getRole(userId, organizationId);

        if (role != OrganizationMember.Role.ORGANIZATION_ADMIN && role != OrganizationMember.Role.EVENT_MANAGER) {
            throw new ForbiddenException("You do not have permission to create events");
        }

        if (!request.startTime().isBefore(request.endTime())) {
            throw new IllegalArgumentException( "Event start time must be before end time");
        }

        Organization organization = organizationRepository
                        .findById(organizationId)
                        .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        Category category =
                categoryRepository
                        .findById(request.categoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Event event = new Event();

        event.setOrganization(organization);
        event.setCategory(category);
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setVenue(request.venue());
        event.setStartTime(request.startTime());
        event.setEndTime(request.endTime());
        event.setCapacity(request.capacity());
        event.setBannerUrl(request.bannerUrl());

        event.setStatus(Event.Status.DRAFT);
        event = eventRepository.save(event);

        eventSearchService.indexEvent(event);
        return EventResponse.from(event);
    }

    @Transactional
    public EventResponse updateEvent(Long userId,Long organizationId,Long eventId,UpdateEventRequest request) {
        OrganizationMember.Role role = authorizationService.getRole(userId, organizationId);

        if (role != OrganizationMember.Role.ORGANIZATION_ADMIN && role != OrganizationMember.Role.EVENT_MANAGER) {
            throw new ForbiddenException("You do not have permission to update events");
        }

        if (!request.startTime().isBefore(request.endTime())) {
            throw new IllegalArgumentException("Event start time must be before end time");
        }

        Event event = eventRepository
                        .findByIdAndOrganizationId( eventId, organizationId)
                        .orElseThrow(() -> new IllegalArgumentException( "Event not found"));

        Category category = categoryRepository
                        .findById(request.categoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setVenue(request.venue());
        event.setStartTime(request.startTime());
        event.setEndTime(request.endTime());
        event.setCapacity(request.capacity());
        event.setCategory(category);
        event.setBannerUrl(request.bannerUrl());

        event = eventRepository.save(event);
        eventSearchService.indexEvent(event);

        return EventResponse.from(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getOrganizationEvents( Long userId, Long organizationId) {

        authorizationService.getRole(userId, organizationId);

        return eventRepository
                .findByOrganizationId(organizationId)
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getEvent(Long userId,Long organizationId,Long eventId) {
        authorizationService.getRole(userId, organizationId);

        Event event = eventRepository
                        .findByIdAndOrganizationId(
                                eventId,
                                organizationId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Event not found"
                                )
                        );

        return EventResponse.from(event);
    }

    @Transactional
    public void deleteEvent(Long userId,Long organizationId,Long eventId) {
        OrganizationMember.Role role = authorizationService.getRole(userId, organizationId);

        if (role != OrganizationMember.Role.ORGANIZATION_ADMIN && role != OrganizationMember.Role.EVENT_MANAGER) {
            throw new ForbiddenException("You do not have permission to delete events");
        }

        Event event = eventRepository
                        .findByIdAndOrganizationId(eventId, organizationId)
                        .orElseThrow(() ->new IllegalArgumentException( "Event not found"));

        eventRepository.delete(event);
        eventSearchService.deleteEvent(eventId);
    }

    @Transactional
    public EventResponse publishEvent(Long userId,Long organizationId,Long eventId) {

        OrganizationMember.Role role = authorizationService.getRole(userId, organizationId);

        if (role != OrganizationMember.Role.ORGANIZATION_ADMIN && role != OrganizationMember.Role.EVENT_MANAGER) {
            throw new ForbiddenException("You do not have permission to publish events");
        }

        Event event = eventRepository
                        .findByIdAndOrganizationId(
                                eventId,
                                organizationId
                        )
                        .orElseThrow(() ->new IllegalArgumentException("Event not found"));

        if (event.getStatus() != Event.Status.DRAFT) {
            throw new IllegalArgumentException(
                    "Only draft events can be published"
            );
        }

        event.setStatus(Event.Status.PUBLISHED);
        event = eventRepository.save(event);
        eventSearchService.indexEvent(event);

        return EventResponse.from(event);
    }
}