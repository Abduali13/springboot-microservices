package com.techie.microservices.product.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    @Override
    public Collection<GrantedAuthority> convert(final Jwt jwt) {

        final Map<String, Object> claims = jwt.getClaims();

        // Extract realm roles
        final Map<String, List<String>> realmAccess = 
                (Map<String, List<String>>) claims.getOrDefault("realm_access", emptyMap());
        List<String> realmRoles = realmAccess.getOrDefault("roles", emptyList());

        // Extract client roles
        final Map<String, Map<String, List<String>>> resourceAccess =
                (Map<String, Map<String, List<String>>>) claims.getOrDefault("resource_access", emptyMap());
        Map<String, List<String>> clientRoles = resourceAccess.getOrDefault("angular-client", emptyMap());
        List<String> clientRolesList = clientRoles.getOrDefault("roles", emptyList());

        // Combine realm and client roles
        List<String> allRoles = new java.util.ArrayList<>();
        allRoles.addAll(realmRoles);
        allRoles.addAll(clientRolesList);

        // Convert to GrantedAuthority with ROLE_ prefix for Spring Security
        return allRoles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());
    }
}
