package co.com.vortex.films.application.controller;

import co.com.vortex.films.application.service.IPurchaseDetailService;
import co.com.vortex.films.domain.dto.purchasedetail.PurchaseDetailResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/purchaseDetail")
@RestController
@Tag(name = "Purchase Detail", description = "Endpoints for managing purchase details")
@SecurityRequirement(name = "bearer-key")
public class PurchaseDetailController {
    private final IPurchaseDetailService purchaseDetailService;

    @Operation(summary = "Get all purchase details", description = "Retrieves a paginated list of all purchase details.")
    @GetMapping()
    public ResponseEntity<Slice<PurchaseDetailResponse>> findAll(@PageableDefault Pageable pageable) {
        return new ResponseEntity<>(purchaseDetailService.findAll(pageable), HttpStatus.OK);
    }

    @Operation(summary = "Get purchase detail by ID", description = "Retrieves a purchase detail by their unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseDetailResponse> findById(@PathVariable Long id) {
        return new ResponseEntity<>(purchaseDetailService.findById(id), HttpStatus.OK);
    }

    @Operation(summary = "Delete purchase detail", description = "Deletes a purchase detail by their unique ID.")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        purchaseDetailService.delete(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
