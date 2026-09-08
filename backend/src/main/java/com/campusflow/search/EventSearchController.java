package com.campusflow.search;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class EventSearchController {

    private final EventSearchService eventSearchService;

    public EventSearchController(EventSearchService eventSearchService) {
        this.eventSearchService = eventSearchService;
    }

    @GetMapping("/events")
    public List<EventSearchResponse> searchEvents(
            @RequestParam String q,
            @RequestParam(required = false) Long categoryId
    ) {
        return eventSearchService.searchEvents(q, categoryId);
    }
}