package com.campusflow.registration;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.campusflow.user.User;
import com.campusflow.user.UserRepository;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserRepository userRepository;

    public RegistrationController(
            RegistrationService registrationService,
            UserRepository userRepository
    ) {
        this.registrationService = registrationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/events/{eventId}/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationResponse register(
            @PathVariable Long eventId,
            @AuthenticationPrincipal Jwt jwt
    ) {

        User user = getCurrentUser(jwt);

        Registration registration =
                registrationService.register(
                        user.getId(),
                        eventId
                );

        return RegistrationResponse.from(registration);
    }

    @DeleteMapping("/events/{eventId}/register")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(
            @PathVariable Long eventId,
            @AuthenticationPrincipal Jwt jwt
    ) {

        User user = getCurrentUser(jwt);

        registrationService.cancel(
                user.getId(),
                eventId
        );
    }

    @GetMapping("/events/{eventId}/registration")
    public boolean isRegistered(
            @PathVariable Long eventId,
            @AuthenticationPrincipal Jwt jwt
    ) {

        User user = getCurrentUser(jwt);

        return registrationService.isRegistered(
                user.getId(),
                eventId
        );
    }

    @GetMapping("/registrations/me")
    public List<RegistrationResponse> getMyRegistrations(
            @AuthenticationPrincipal Jwt jwt
    ) {

        User user = getCurrentUser(jwt);

        return registrationService
                .getMyRegistrations(user.getId())
                .stream()
                .map(RegistrationResponse::from)
                .toList();
    }

    private User getCurrentUser(Jwt jwt) {

        String email = jwt.getClaimAsString("email");

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        ));
    }

    @GetMapping("/events/{eventId}/registration/count")
    public long getRegistrationCount( @PathVariable Long eventId) {
        return registrationService.getRegistrationCount(eventId);
    }
}