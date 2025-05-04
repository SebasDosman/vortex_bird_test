package co.com.vortex.films.application.controller;

import co.com.vortex.films.application.service.IPurchaseService;
import co.com.vortex.films.domain.dto.purchase.CreatePurchaseRequest;
import co.com.vortex.films.domain.dto.purchase.PurchaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/purchase")
@RestController
@Tag(name = "Purchase", description = "Endpoints for managing purchases")
@SecurityRequirement(name = "bearer-key")
public class PurchaseController {
    private final IPurchaseService purchaseService;

    @Operation(summary = "Get all purchases", description = "Retrieves a paginated list of all purchases.")
    @GetMapping()
    public ResponseEntity<Slice<PurchaseResponse>> findAll(@PageableDefault Pageable pageable) {
        return new ResponseEntity<>(purchaseService.findAll(pageable), HttpStatus.OK);
    }

    @Operation(summary = "Get all purchases by user", description = "Retrieves a paginated list of all purchases by user.")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Slice<PurchaseResponse>> findByUserId(@PathVariable Long userId, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(purchaseService.findByUserId(userId, pageable), HttpStatus.OK);
    }

    @Operation(summary = "Get purchase by ID", description = "Retrieves a purchase by their unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseResponse> findById(@PathVariable Long id) {
        return new ResponseEntity<>(purchaseService.findById(id), HttpStatus.OK);
    }

    @Operation(summary = "Save purchase and purchase details", description = "Saves a new purchase and purchase detail.")
    @PostMapping()
    public ResponseEntity<PurchaseResponse> save(@RequestBody @Valid CreatePurchaseRequest createPurchaseRequest) {
        return new ResponseEntity<>(purchaseService.save(createPurchaseRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Delete purchase", description = "Deletes a purchase by their unique ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        purchaseService.delete(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
