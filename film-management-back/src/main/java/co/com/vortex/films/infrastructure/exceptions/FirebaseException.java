package co.com.vortex.films.infrastructure.exceptions;

public class FirebaseException extends RuntimeException {
    public FirebaseException(String message) {
        super(message);
    }
}
