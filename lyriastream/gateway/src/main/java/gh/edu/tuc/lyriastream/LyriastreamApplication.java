package gh.edu.tuc.lyriastream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import gh.edu.tuc.lyriastream.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableAsync
@EnableScheduling
public class LyriastreamApplication {
    public static void main(String[] args) {
        SpringApplication.run(LyriastreamApplication.class, args);
    }
}
