package com.exportify;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExportifyApplication {

	public static void main(String[] args) {

		// Cargar las variables de entorno desde el .env
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

		System.setProperty("DB_URL", dotenv.get("DB_URL", ""));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME", ""));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD", ""));

        //JWT
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET", ""));
        System.setProperty("JWT_EXPIRATION_MS", dotenv.get("JWT_EXPIRATION_MS", ""));
		SpringApplication.run(ExportifyApplication.class, args);
	}

}
