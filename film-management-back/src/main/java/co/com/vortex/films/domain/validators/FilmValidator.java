package co.com.vortex.films.domain.validators;

public class FilmValidator {
    public static final String ID_NOT_NULL = "The film ID cannot be null";
    public static final String ID_POSITIVE = "The film ID must be a positive number";

    public static final String TITLE_NOT_BLANK = "The film title cannot be null or empty";
    public static final String TITLE_SIZE = "The film title must be between 1 and 255 characters";
    public static final String TITLE_PATTERN = "The film title must contain only letters, numbers, spaces, punctuation marks and special characters";
    public static final String TITLE_REGEX = "^[\\p{L}0-9 .,'!&()\\-]+$";

    public static final String DESCRIPTION_NOT_BLANK = "The film description cannot be null or empty";
    public static final String DESCRIPTION_SIZE = "The film description must be between 1 and 500 characters";

    public static final String GENRE_NOT_NULL = "The film genre cannot be null";

    public static final String CLASSIFICATION_NOT_NULL = "The film classification cannot be null";

    public static final String DURATION_NOT_NULL = "The film duration cannot be null";
    public static final String DURATION_POSITIVE = "The film duration must be a positive number";

    public static final String TICKET_PRICE_NOT_NULL = "The ticket price cannot be null";
    public static final String TICKET_PRICE_MIN = "The ticket price must be at least 1";

    public static final String FILM_NOT_FOUND = "The film with ID: %d was not found";
    public static final String FILM_NOT_FOUND_BY_TITLE = "The film with title: %s was not found";
}
