package com.campusflow.registration;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import com.campusflow.event.Event;
import com.campusflow.user.User;

@Entity
@Table(
    name = "registrations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_registration_user_event",
            columnNames = {"user_id", "event_id"}
        )
    },
    indexes = {
        @Index(name = "idx_registration_user", columnList = "user_id"),
        @Index(name = "idx_registration_event", columnList = "event_id")
    }
)
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationStatus status;

    @Column(nullable = false)
    private LocalDateTime registeredAt;

    private LocalDateTime cancelledAt;

    protected Registration() {
    }

    public Registration(User user, Event event) {
        this.user = user;
        this.event = event;
        this.status = RegistrationStatus.REGISTERED;
        this.registeredAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Event getEvent() {
        return event;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void cancel() {
        this.status = RegistrationStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    public void reactivate() {
        this.status = RegistrationStatus.REGISTERED;
        this.cancelledAt = null;
        this.registeredAt = LocalDateTime.now();
    }
}