package co.com.vortex.films.domain.dto.error;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@AllArgsConstructor
@Builder
@Data
public class ErrorResponse {
    private String message;
    private String code;
    private String status;
    private Map<String, String> details;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String code, String status, Map<String, String> details) {
        this.message = message;
        this.code = code;
        this.status = status;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}
