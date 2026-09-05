package com.campusflow.auth;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.campusflow.user.User;
import com.campusflow.user.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(UserRepository userRepository,JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        try {

            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

            String googleId = oauthUser.getAttribute("sub");
            String name = oauthUser.getAttribute("name");
            String email = oauthUser.getAttribute("email");
            String picture = oauthUser.getAttribute("picture");

            System.out.println("Google login successful");
            System.out.println("Email: " + email);

            User user = userRepository.findByGoogleId(googleId).orElseGet(() -> {

                    System.out.println("Creating new user...");
                    User newUser = new User();
                    newUser.setGoogleId(googleId);
                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setProfilePicture(picture);
                    return userRepository.save(newUser);
            });

            String token = jwtService.generateToken(user);
            response.sendRedirect("http://localhost:5173/oauth/callback?token=" + token);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Authentication failed");
        }
    }
}