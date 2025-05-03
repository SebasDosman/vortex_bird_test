package co.com.vortex.films.infrastructure.config;

import co.com.vortex.films.domain.validators.FirebaseValidator;
import co.com.vortex.films.infrastructure.exceptions.FirebaseException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ResourceUtils;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    @Value("${firebase.service-account.path}")
    private String serviceAccountPath;

    @Value("${firebase.storage.bucket-name}")
    private String bucketName;

    @PostConstruct
    public void initializeFirebase() {
        try {
            InputStream serviceAccountStream;

            try {
                serviceAccountStream = new ClassPathResource(serviceAccountPath).getInputStream();
            } catch (IOException e) {
                serviceAccountStream = new FileInputStream(ResourceUtils.getFile(serviceAccountPath));
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                    .setStorageBucket(bucketName)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) FirebaseApp.initializeApp(options);
        } catch (IOException e) {
            throw new FirebaseException(FirebaseValidator.FIREBASE_INITIALIZED_FAILED);
        }
    }
}
