package co.com.vortex.films.application.service.implementation;

import co.com.vortex.films.application.service.IMailService;
import co.com.vortex.films.domain.dto.mail.MailBody;
import co.com.vortex.films.domain.validators.MailValidator;
import co.com.vortex.films.infrastructure.exceptions.MailException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@RequiredArgsConstructor
@Service
public class MailService implements IMailService {
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.from-address}")
    private String fromEmail;

    @Override
    public void sendMail(MailBody mailBody) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(mailBody.getTo());

            try {
                helper.setFrom(new InternetAddress(fromEmail, "Films Management"));
            } catch (UnsupportedEncodingException e) {
                throw new MailException(String.format(MailValidator.EMAIL_ADDRESS_FAILED, fromEmail));
            }

            helper.setSubject(mailBody.getSubject());
            helper.setText(mailBody.getBody(), mailBody.isHtml());

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new MailException(MailValidator.EMAIL_SEND_FAILED);
        }
    }
}
