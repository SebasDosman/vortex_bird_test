package co.com.vortex.films.infrastructure.exceptions;

public class MailException extends RuntimeException {
    public MailException(String message) {
        super(message);
    }
}
