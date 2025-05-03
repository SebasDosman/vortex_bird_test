package co.com.vortex.films.application.service;

import co.com.vortex.films.domain.dto.mail.MailBody;

public interface IMailService {
    void sendMail(MailBody mailBody);
}
