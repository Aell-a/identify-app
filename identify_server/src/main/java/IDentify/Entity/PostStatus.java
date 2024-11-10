package IDentify.Entity;

public enum PostStatus {
    ACTIVE, // Post still allows guess comments
    RESOLVED, // Object identified, guess comments are not allowed but user discussion is still up
    FLAGGED, // Post has many unresolved reports about it breaking the rules, visibility limited
    DELETED // Post deleted by user or administration (Users can only delete posts without any discussion)
}
