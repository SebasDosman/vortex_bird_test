package co.com.vortex.films.domain.validators;

public class PurchaseValidator {
    public static final String ID_NOT_NULL = "The purchase ID cannot be null";
    public static final String ID_POSITIVE = "The purchase ID must be a positive number";

    public static final String USER_ID_NOT_NULL = "The user ID cannot be null";
    public static final String USER_ID_POSITIVE = "The user ID must be a positive number";

    public static final String PAYMENT_METHOD_NOT_NULL = "The payment method cannot be null";
    public static final String PAYMENT_STATUS_NOT_NULL = "The payment status cannot be null";

    public static final String DETAILS_NOT_NULL = "The purchase details list cannot be null";
    public static final String DETAILS_NOT_EMPTY = "The purchase must have at least one detail";

    public static final String PURCHASE_NOT_FOUND = "The purchase with ID: %s was not found";
    public static final String PURCHASE_NOT_FOUND_BY_USER = "The purchase with user ID: %s was not found";
}
