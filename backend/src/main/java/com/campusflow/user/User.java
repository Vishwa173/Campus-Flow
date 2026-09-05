package com.campusflow.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.campusflow.organization.OrganizationMember;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @OneToMany(mappedBy = "user")
    private List<OrganizationMember> memberships = new ArrayList<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "google_id", unique = true, nullable = false)
    private String googleId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}