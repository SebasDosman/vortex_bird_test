package co.com.vortex.films.application.controller;

import co.com.vortex.films.application.service.IFilmService;
import co.com.vortex.films.domain.dto.film.CreateFilmRequest;
import co.com.vortex.films.domain.dto.film.UpdateFilmRequest;
import co.com.vortex.films.domain.dto.film.FilmResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RequestMapping("/film")
@RestController
@Tag(name = "Film", description = "Endpoints for managing films")
@SecurityRequirement(name = "bearer-key")
public class FilmController {
    private final IFilmService filmService;

    @Operation(summary = "Get all films", description = "Retrieves a paginated list of all films.")
    @GetMapping()
    public ResponseEntity<Slice<FilmResponse>> findAll(@PageableDefault Pageable pageable) {
        return new ResponseEntity<>(filmService.findAll(pageable), HttpStatus.OK);
    }

    @Operation(summary = "Get all films enabled", description = "Retrieves a paginated list of all enabled films.")
    @GetMapping("/enabled")
    public ResponseEntity<Slice<FilmResponse>> findAllEnabled(@PageableDefault Pageable pageable) {
        return new ResponseEntity<>(filmService.findAllEnabled(pageable), HttpStatus.OK);
    }

    @Operation(summary = "Get film by ID", description = "Retrieves a film by their unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<FilmResponse> findById(@PathVariable Long id) {
        return new ResponseEntity<>(filmService.findById(id), HttpStatus.OK);
    }

    @Operation(summary = "Get film by title", description = "Retrieves a film by their title.")
    @GetMapping("/title/{title}")
    public ResponseEntity<Slice<FilmResponse>> findByTitle(@PathVariable String title, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(filmService.findByTitle(title, pageable), HttpStatus.OK);
    }

    @Operation(summary = "Save film", description = "Saves a new film and uploads its image.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FilmResponse> save(
            @RequestPart("filmData") @Valid CreateFilmRequest createFilmRequest,
            @RequestPart("image") MultipartFile image,
            @RequestParam(value = "folder", required = false) String folder
    ) throws IOException {
        return new ResponseEntity<>(filmService.save(createFilmRequest, image, folder), HttpStatus.CREATED);
    }

    @Operation(summary = "Update film", description = "Updates an existing films information.")
    @PutMapping()
    public ResponseEntity<FilmResponse> update(@RequestBody @Valid UpdateFilmRequest updateFilmRequest) {
        return new ResponseEntity<>(filmService.update(updateFilmRequest), HttpStatus.OK);
    }

    @Operation(summary = "Update film status", description = "Updates the status of a film.")
    @PutMapping("/{id}")
    public ResponseEntity<FilmResponse> updateStatus(@PathVariable Long id) {
        return new ResponseEntity<>(filmService.updateStatus(id), HttpStatus.OK);
    }

    @Operation(summary = "Delete film", description = "Deletes a film by their unique ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        filmService.delete(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
