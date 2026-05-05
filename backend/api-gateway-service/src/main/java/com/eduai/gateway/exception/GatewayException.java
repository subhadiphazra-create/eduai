package com.eduai.gateway.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base exception for all gateway-level errors.
 * Extend this class to create domain-specific exceptions.
 *
 * Example usage:
 *   throw new GatewayException("Service unavailable", "SERVICE_DOWN", HttpStatus.SERVICE_UNAVAILABLE);
 */
@Getter
public class GatewayException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus httpStatus;

    public GatewayException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    public GatewayException(String message, String errorCode, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    // --- Common factory methods ---

    public static GatewayException unauthorized(String message) {
        return new GatewayException(message, "UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }

    public static GatewayException forbidden(String message) {
        return new GatewayException(message, "FORBIDDEN", HttpStatus.FORBIDDEN);
    }

    public static GatewayException serviceUnavailable(String serviceName) {
        return new GatewayException(
                "Service '" + serviceName + "' is currently unavailable",
                "SERVICE_UNAVAILABLE",
                HttpStatus.SERVICE_UNAVAILABLE
        );
    }

    public static GatewayException badGateway(String message) {
        return new GatewayException(message, "BAD_GATEWAY", HttpStatus.BAD_GATEWAY);
    }
}
