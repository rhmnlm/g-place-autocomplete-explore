package com.github.rhmnlm.gplace_autocomplete.interceptor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class RequestResponseLoggingInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (request instanceof ContentCachingRequestWrapper) {
            ContentCachingRequestWrapper wrappedRequest = (ContentCachingRequestWrapper) request;
            logRequest(wrappedRequest);
        }
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (response instanceof ContentCachingResponseWrapper) {
            ContentCachingResponseWrapper wrappedResponse = (ContentCachingResponseWrapper) response;
            logResponse(wrappedRequest(request), wrappedResponse);
            try {
                wrappedResponse.copyBodyToResponse();
            } catch (IOException e) {
                log.error("Error copying response body", e);
            }
        }
    }
    
    private void logRequest(ContentCachingRequestWrapper request) {
        String requestBody = getRequestBody(request);
        log.info("REQUEST: {} {} | Headers: {} | Body: {}", 
            request.getMethod(), 
            request.getRequestURI(),
            getHeadersAsString(request),
            requestBody);
    }
    
    private void logResponse(HttpServletRequest request, ContentCachingResponseWrapper response) {
        String responseBody = getResponseBody(response);
        log.info("RESPONSE: {} {} | Status: {} | Body: {}", 
            request.getMethod(),
            request.getRequestURI(),
            response.getStatus(),
            responseBody);
    }
    
    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] contentAsByteArray = request.getContentAsByteArray();
        if (contentAsByteArray.length > 0) {
            return new String(contentAsByteArray, StandardCharsets.UTF_8);
        }
        return "";
    }
    
    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] contentAsByteArray = response.getContentAsByteArray();
        if (contentAsByteArray.length > 0) {
            return new String(contentAsByteArray, StandardCharsets.UTF_8);
        }
        return "";
    }
    
    private String getHeadersAsString(HttpServletRequest request) {
        StringBuilder headers = new StringBuilder();
        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
            headers.append(headerName).append(": ").append(request.getHeader(headerName)).append(", ");
        });
        return headers.length() > 0 ? headers.substring(0, headers.length() - 2) : "";
    }
    
    private HttpServletRequest wrappedRequest(HttpServletRequest request) {
        return request instanceof ContentCachingRequestWrapper ? request : request;
    }
}
