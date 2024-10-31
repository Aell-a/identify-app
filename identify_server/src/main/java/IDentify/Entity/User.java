package IDentify.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primary key

    @Column(unique = true, nullable = false)
    private String nickname;  // Unique nickname for the user

    @Column(unique = true, nullable = false)
    private String email;  // Unique email address

    @Column(nullable = false)
    private boolean isMailVisible = false;  // Default is false

    @Column(nullable = false)
    private String password;  // Hashed password

    private String profilePicture = "";  // URL or path to the profile picture

    private String bio = "";  // Short bio or description of the user

    @Column(nullable = false)
    private LocalDateTime accountCreated = LocalDateTime.now(); // Timestamp for account creation date

    private LocalDateTime lastActivity = LocalDateTime.now();  // Timestamp for the last activity

    @ElementCollection
    private List<Long> followedTags = new ArrayList<>();  // Tag IDs for followed tags

    @ElementCollection
    private List<Long> interests= new ArrayList<>();  // Tag IDs for interests

    @ElementCollection
    private List<Long> badges= new ArrayList<>();  // Badge IDs

    @ElementCollection
    private List<Long> reports= new ArrayList<>();  // Complaint IDs

    @ElementCollection
    private List<Long> suspensions= new ArrayList<>();  // Suspension IDs

    private int totalPoint = 0;  // Total points accumulated

    private int upvote = 0;  // Total upvotes received

    private int downvote = 0;  // Total downvotes received

    private boolean isDeleted = false;  // Soft delete flag

    public User(String nickname, String email, String password) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

    public User() {

    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isMailVisible() {
        return isMailVisible;
    }

    public void setMailVisible(boolean mailVisible) {
        isMailVisible = mailVisible;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public LocalDateTime getAccountCreated() {
        return accountCreated;
    }

    public void setAccountCreated(LocalDateTime accountCreated) {
        this.accountCreated = accountCreated;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    public List<Long> getFollowedTags() {
        return followedTags;
    }

    public void setFollowedTags(List<Long> followedTags) {
        this.followedTags = followedTags;
    }

    public List<Long> getInterests() {
        return interests;
    }

    public void setInterests(List<Long> interests) {
        this.interests = interests;
    }

    public List<Long> getBadges() {
        return badges;
    }

    public void setBadges(List<Long> badges) {
        this.badges = badges;
    }

    public List<Long> getReports() {
        return reports;
    }

    public void setReports(List<Long> reports) {
        this.reports = reports;
    }

    public List<Long> getSuspensions() {
        return suspensions;
    }

    public void setSuspensions(List<Long> suspensions) {
        this.suspensions = suspensions;
    }

    public int getTotalPoint() {
        return totalPoint;
    }

    public void setTotalPoint(int totalPoint) {
        this.totalPoint = totalPoint;
    }

    public int getUpvote() {
        return upvote;
    }

    public void setUpvote(int upvote) {
        this.upvote = upvote;
    }

    public int getDownvote() {
        return downvote;
    }

    public void setDownvote(int downvote) {
        this.downvote = downvote;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}