package co.com.vortex.films.application.service.implementation;

import co.com.vortex.films.application.repository.FilmRepository;
import co.com.vortex.films.application.repository.PurchaseRepository;
import co.com.vortex.films.application.repository.UserRepository;
import co.com.vortex.films.application.service.IMailService;
import co.com.vortex.films.application.service.IPurchaseService;
import co.com.vortex.films.domain.dto.mail.MailBody;
import co.com.vortex.films.domain.dto.purchase.CreatePurchaseRequest;
import co.com.vortex.films.domain.dto.purchase.PurchaseResponse;
import co.com.vortex.films.domain.dto.purchasedetail.CreatePurchaseDetailRequest;
import co.com.vortex.films.domain.mappers.PurchaseDetailMapper;
import co.com.vortex.films.domain.mappers.PurchaseMapper;
import co.com.vortex.films.domain.models.*;
import co.com.vortex.films.domain.validators.FilmValidator;
import co.com.vortex.films.domain.validators.MailValidator;
import co.com.vortex.films.domain.validators.PurchaseValidator;
import co.com.vortex.films.domain.validators.UserValidator;
import co.com.vortex.films.infrastructure.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PurchaseService implements IPurchaseService {
    private static final String REFERENCE_CODE_PREFIX = "FM-";
    private static final int REFERENCE_CODE_MIN = 10000;
    private static final int REFERENCE_CODE_MAX = 99999;

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final FilmRepository filmRepository;
    private final IMailService mailService;
    private final SpringTemplateEngine springTemplateEngine;

    @Override
    @Transactional(readOnly = true)
    public Slice<PurchaseResponse> findAll(Pageable pageable) {
        return PurchaseMapper.toPurchaseResponseSlice(purchaseRepository.findAll(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<PurchaseResponse> findByUserId(Long userId, Pageable pageable) {
        Slice<Purchase> purchases = purchaseRepository.findByUserId(userId, pageable);

        if (purchases.isEmpty()) throw new NotFoundException(String.format(PurchaseValidator.PURCHASE_NOT_FOUND_BY_USER, userId));

        return PurchaseMapper.toPurchaseResponseSlice(purchases);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseResponse findById(Long id) {
        if (!purchaseRepository.existsById(id)) throw new NotFoundException(String.format(PurchaseValidator.PURCHASE_NOT_FOUND, id));

        return PurchaseMapper.toPurchaseResponse(purchaseRepository.getReferenceById(id));
    }

    @Override
    @Transactional
    public PurchaseResponse save(CreatePurchaseRequest createPurchaseRequest) {
        if (!userRepository.existsById(createPurchaseRequest.getUserId())) throw new NotFoundException(String.format(UserValidator.USER_NOT_FOUND, createPurchaseRequest.getUserId()));

        User user = userRepository.getReferenceById(createPurchaseRequest.getUserId());
        Purchase purchase = PurchaseMapper.toPurchase(createPurchaseRequest, user);

        processPurchaseDetails(purchase, createPurchaseRequest.getDetails());
        calculateTotalAmount(purchase);
        sendConfirmationEmail(purchase);

        return PurchaseMapper.toPurchaseResponse(purchaseRepository.save(purchase));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!purchaseRepository.existsById(id)) throw new NotFoundException(String.format(PurchaseValidator.PURCHASE_NOT_FOUND, id));

        purchaseRepository.deleteById(id);
    }

    private void processPurchaseDetails(Purchase purchase, List<CreatePurchaseDetailRequest> detailRequests) {
        detailRequests.forEach(detailRequest -> {
            if (!filmRepository.existsById(detailRequest.getFilmId())) throw new NotFoundException(String.format(FilmValidator.FILM_NOT_FOUND, detailRequest.getFilmId()));
            Film film = filmRepository.getReferenceById(detailRequest.getFilmId());

            PurchaseDetail detail = PurchaseDetailMapper.toPurchaseDetail(detailRequest, film);

            purchase.addDetail(detail);
        });
    }

    private void calculateTotalAmount(Purchase purchase) {
        int totalAmount = purchase.getDetails().stream()
                .mapToInt(detail -> detail.getFilm().getTicketPrice() * detail.getQuantity())
                .sum();

        purchase.setTotalAmount(totalAmount);
    }

    private void sendConfirmationEmail(Purchase purchase) {
        Context context = createEmailContext(purchase);
        String htmlContent = springTemplateEngine.process("email-ticket-template", context);

        MailBody mailBody = MailBody.builder()
                .to(purchase.getUser().getEmail())
                .subject(MailValidator.EMAIL_TITLE)
                .body(htmlContent)
                .isHtml(true)
                .build();

        mailService.sendMail(mailBody);
    }

    private Context createEmailContext(Purchase purchase) {
        Context context = new Context();
        context.setVariable("purchase", purchase);
        context.setVariable("details", purchase.getDetails());
        context.setVariable("user", purchase.getUser());
        context.setVariable("referenceCode", generateReferenceCode());

        return context;
    }

    private String generateReferenceCode() {
        int randomCode = (int)(Math.random() * (REFERENCE_CODE_MAX - REFERENCE_CODE_MIN + 1)) + REFERENCE_CODE_MIN;

        return REFERENCE_CODE_PREFIX + randomCode;
    }
}
