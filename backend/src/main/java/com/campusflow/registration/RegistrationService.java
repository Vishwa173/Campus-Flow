package com.campusflow.registration;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusflow.event.Event;
import com.campusflow.event.EventRepository;
import com.campusflow.user.User;
import com.campusflow.user.UserRepository;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            EventRepository eventRepository,
            UserRepository userRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Registration register(Long userId, Long eventId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));


        Event event = eventRepository.findByIdForUpdate(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (event.getStatus() != Event.Status.PUBLISHED) {
            throw new IllegalArgumentException("Only published events can be registered for" );
        }

        Registration existing =
                registrationRepository
                        .findByUserIdAndEventId(userId, eventId)
                        .orElse(null);


        if (existing != null && existing.getStatus() == RegistrationStatus.REGISTERED) {
            throw new IllegalArgumentException( "User is already registered for this event");
        }

        long registeredCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.REGISTERED);

        if (registeredCount >= event.getCapacity()) {
            throw new IllegalArgumentException( "Event is full");
        }

        if (existing != null) {
            existing.reactivate();
            return registrationRepository.save(existing);
        }

        Registration registration =  new Registration(user, event);

        return registrationRepository.save(registration);
    }

    @Transactional
    public void cancel(Long userId, Long eventId) {

        Registration registration =
                registrationRepository
                        .findByUserIdAndEventId(userId, eventId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Registration not found"));

        if (registration.getStatus() != RegistrationStatus.REGISTERED) {
            throw new IllegalArgumentException( "User is not registered for this event");
        }

        registration.cancel();
        registrationRepository.save(registration);
    }

    @Transactional(readOnly = true)
    public List<Registration> getMyRegistrations(Long userId) {

        return registrationRepository.findByUserIdAndStatus(
                userId,
                RegistrationStatus.REGISTERED
        );
    }

    @Transactional(readOnly = true)
    public boolean isRegistered(Long userId, Long eventId) {

        return registrationRepository
                .findByUserIdAndEventId(userId, eventId)
                .map(registration -> registration.getStatus() == RegistrationStatus.REGISTERED)
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public long getRegistrationCount(Long eventId) {
        return registrationRepository.countByEventIdAndStatus(
                eventId,
                RegistrationStatus.REGISTERED
        );
    }
}