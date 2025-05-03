package co.com.vortex.films;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class FilmManagementBackApplication implements CommandLineRunner {
	public static void main(String[] args) {
		SpringApplication.run(FilmManagementBackApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

		String password = bCryptPasswordEncoder.encode("Admin123*");

		System.out.println("Password: " + password);
	}
}
