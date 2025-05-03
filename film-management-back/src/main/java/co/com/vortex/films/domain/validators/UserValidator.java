package co.com.vortex.films.domain.validators;

public class UserValidator {
    public static final String ID_NOT_NULL = "The user ID cannot be null";
    public static final String ID_POSITIVE = "The user ID must be a positive number";

    public static final String NAME_NOT_BLANK = "The user name cannot be null or empty";
    public static final String NAME_SIZE = "The user name must be between 1 and 100 characters";
    public static final String NAME_PATTERN = "The user name must contain only letters, numbers, spaces, hyphens and underscores";
    public static final String NAME_REGEX = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_ -]*$";

    public static final String LAST_NAME_NOT_BLANK = "The user last name cannot be null or empty";
    public static final String LAST_NAME_SIZE = "The user last name must be between 1 and 100 characters";
    public static final String LAST_NAME_PATTERN = "The user last name must contain only letters, numbers, spaces, hyphens and underscores";
    public static final String LAST_NAME_REGEX = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_ -]*$";

    public static final String PHONE_NOT_BLANK = "The user phone cannot be null or empty";
    public static final String PHONE_SIZE = "The user phone must be between 1 and 10 characters";
    public static final String PHONE_PATTERN = "The user phone must contain only numbers and must be 10 digits long";
    public static final String PHONE_REGEX = "^[0-9]{10}$";
    public static final String PHONE_ALREADY_EXISTS = "The user with phone: %s already exists";

    public static final String EMAIL_NOT_BLANK = "The user email cannot be null or empty";
    public static final String EMAIL_SIZE = "The user email must be between 1 and 150 characters";
    public static final String EMAIL_PATTERN = "The user email must be a valid email address";
    public static final String EMAIL_ALREADY_EXISTS = "The user with email: %s already exists";

    public static final String PASSWORD_NOT_BLANK = "The user password cannot be null or empty";
    public static final String PASSWORD_SIZE = "The user password must be between 1 and 50 characters";
    public static final String PASSWORD_PATTERN = "The user password must contain at least one uppercase letter, one lowercase letter, one number and one special character";
    public static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{8,}$";

    public static final String USER_NOT_FOUND = "The user with ID: %s was not found";
    public static final String USER_NOT_FOUND_BY_EMAIL = "The user with email: %s was not found";
}
