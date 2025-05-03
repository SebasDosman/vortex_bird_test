package co.com.vortex.films.domain.dto.mail;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class MailBody {
    private String to;
    private String subject;
    private String body;
    private boolean isHtml;
}
