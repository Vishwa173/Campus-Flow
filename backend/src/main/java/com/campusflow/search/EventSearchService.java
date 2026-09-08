package com.campusflow.search;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.stereotype.Service;

import com.campusflow.event.Event;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;

@Service
public class EventSearchService {

    private final EventSearchRepository eventSearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    public EventSearchService(
            EventSearchRepository eventSearchRepository,
            ElasticsearchOperations elasticsearchOperations
    ) {
        this.eventSearchRepository = eventSearchRepository;
        this.elasticsearchOperations = elasticsearchOperations;
    }

    // Index an event in Elasticsearch
    public void indexEvent(Event event) {

        EventDocument document = new EventDocument();

        document.setId(event.getId());
        document.setOrganizationId(event.getOrganization().getId());
        document.setCategoryId(event.getCategory().getId());
        document.setCategoryName(event.getCategory().getName());
        document.setTitle(event.getTitle());
        document.setDescription(event.getDescription());
        document.setVenue(event.getVenue());
        document.setStartTime(event.getStartTime());
        document.setEndTime(event.getEndTime());
        document.setCapacity(event.getCapacity());
        document.setStatus(event.getStatus().name());
        document.setBannerUrl(event.getBannerUrl());

        eventSearchRepository.save(document);
    }

    // Delete an event from Elasticsearch
    public void deleteEvent(Long eventId) {
        eventSearchRepository.deleteById(eventId);
    }

    // Search only published and upcoming events
    public List<EventSearchResponse> searchEvents(
            String query,
            Long categoryId
    ) {

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm");

        String now = LocalDateTime.now().format(formatter);

        Query searchQuery = Query.of(q -> q
                .bool(b -> {

                    /*
                     * Full-text search + prefix search
                     */
                    b.must(m -> m
                            .bool(inner -> inner

                                    // Normal full-text search
                                    .should(s -> s
                                            .multiMatch(mm -> mm
                                                    .query(query)
                                                    .fields(
                                                            "title",
                                                            "description",
                                                            "venue",
                                                            "categoryName"
                                                    )
                                            )
                                    )

                                    // Prefix search
                                    .should(s -> s
                                            .multiMatch(mm -> mm
                                                    .query(query)
                                                    .type(TextQueryType.BoolPrefix)
                                                    .fields(
                                                            "title",
                                                            "description",
                                                            "venue",
                                                            "categoryName"
                                                    )
                                            )
                                    )

                                    .minimumShouldMatch("1")
                            )
                    );

                    /*
                     * Only published events should appear
                     * in public event discovery.
                     */
                    b.filter(f -> f
                            .term(t -> t
                                    .field("status")
                                    .value("PUBLISHED")
                            )
                    );

                    /*
                     * Category filter
                     */
                    if (categoryId != null) {
                        b.filter(f -> f
                                .term(t -> t
                                        .field("categoryId")
                                        .value(categoryId)
                                )
                        );
                    }

                    /*
                     * Only return events that have not ended.
                     */
                    b.filter(f -> f
                            .range(r -> r
                                    .date(d -> d
                                            .field("endTime")
                                            .gt(now)
                                    )
                            )
                    );

                    return b;
                })
        );

        /*
         * Sort upcoming events first.
         */
        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(searchQuery)
                .withSort(s -> s
                        .field(f -> f
                                .field("startTime")
                                .order(SortOrder.Asc)
                        )
                )
                .build();

        return elasticsearchOperations
                .search(nativeQuery, EventDocument.class)
                .stream()
                .map(SearchHit::getContent)
                .map(EventSearchResponse::from)
                .toList();
    }
}