package co.com.vortex.films.application.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;

public interface IFirebaseStorageService {
    URL uploadFile(MultipartFile file, String folderName) throws IOException;
    URL uploadFile(MultipartFile file) throws IOException;
}
