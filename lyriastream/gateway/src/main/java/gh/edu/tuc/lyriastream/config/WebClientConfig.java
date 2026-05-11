package gh.edu.tuc.lyriastream.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebClientConfig {

    private final AppProperties props;

    public WebClientConfig(AppProperties props) {
        this.props = props;
    }

    /**
     * WebClient pre-configured for AIM communication.
     * - X-AIM-Key header injected on every request
     * - Long read timeout for GPU generation jobs
     * - 256 MB codec buffer (audio chunk payloads)
     */
    @Bean("aimWebClient")
    public WebClient aimWebClient() {
        HttpClient httpClient = HttpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, props.aim().connectTimeoutMs())
            .doOnConnected(conn -> conn.addHandlerLast(
                new ReadTimeoutHandler(props.aim().readTimeoutMs(), TimeUnit.MILLISECONDS)
            ));

        ExchangeStrategies strategies = ExchangeStrategies.builder()
            .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(256 * 1024 * 1024))
            .build();

        return WebClient.builder()
            .baseUrl(props.aim().baseUrl())
            .defaultHeader("X-AIM-Key", props.aim().apiKey())
            .defaultHeader("Content-Type", "application/json")
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .exchangeStrategies(strategies)
            .build();
    }
}
