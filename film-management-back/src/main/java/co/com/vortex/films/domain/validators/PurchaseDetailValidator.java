package co.com.vortex.films.domain.validators;

public class PurchaseDetailValidator {
    public static final String ID_NOT_NULL = "The purchase detail ID cannot be null";
    public static final String ID_POSITIVE = "The purchase detail ID must be a positive number";

    public static final String FILM_ID_NOT_NULL = "The film ID cannot be null";
    public static final String FILM_ID_POSITIVE = "The film ID must be a positive number";

    public static final String QUANTITY_NOT_NULL = "The ticket quantity cannot be null";
    public static final String QUANTITY_MIN = "The ticket quantity must be at least 1";

    public static final String PURCHASE_DETAIL_NOT_FOUND = "The purchase detail with ID: %s was not found";
}
