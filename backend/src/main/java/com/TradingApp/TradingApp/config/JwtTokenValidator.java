//package com.TradingApp.TradingApp.config;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.AuthorityUtils;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.OncePerRequestFilter;
//import java.io.IOException;
//import java.util.List;
//
//import jakarta.servlet.FilterChain; // Use jakarta.servlet for Java 21
//import jakarta.servlet.ServletException; // Use jakarta.servlet for Java 21
//import jakarta.servlet.http.HttpServletRequest; // Use jakarta.servlet for Java 21
//import jakarta.servlet.http.HttpServletResponse; // Use jakarta.servlet for Java 21
//
//import javax.crypto.SecretKey;
//
//public class JwtTokenValidator extends OncePerRequestFilter {
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//            throws ServletException, IOException {
//        String jwt = request.getHeader(JwtConstant.JWT_HEADER);
//        // Add your JWT validation logic here
//        filterChain.doFilter(request, response);
//
//        //bearer token
//        if(jwt != null) {
//            jwt=jwt.substring(7);
//        }
//
//        try {
//            // Extract the JWT token from the request
//            SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
//
//            Claims claims = Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(jwt)
//                    .getBody();
//
//            String email = String.valueOf(claims.get("email"));
//            String authorities = String.valueOf(claims.get("authorities"));
//            List<GrantedAuthority> authoritiesList= AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
//
//
//                Authentication auth = new UsernamePasswordAuthenticationToken(
//                        email,
//                        authoritiesList,
//                        authoritiesList
//                );
//            SecurityContextHolder.getContext().setAuthentication(auth);
//
//
//        } catch (Exception e) {
//            // Handle exception
//            throw new RuntimeException("Invalid token...");
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}
//
