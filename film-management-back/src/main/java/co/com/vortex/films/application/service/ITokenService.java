package co.com.vortex.films.application.service;

import co.com.vortex.films.domain.models.User;

public interface ITokenService {
    String generateToken(User user) throws Exception;
    String getSubject(String token) throws Exception;
    String getType(String token) throws Exception;
    Long getExpirationTime(String token) throws Exception;
}
