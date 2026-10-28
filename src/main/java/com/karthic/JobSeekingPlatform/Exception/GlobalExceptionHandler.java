package com.karthic.JobSeekingPlatform.Exception;


import com.karthic.JobSeekingPlatform.payload.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;


@RestControllerAdvice

public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> CustomMethodArgumentNotValidException(MethodArgumentNotValidException e){
        Map<String,String> response = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(err -> {
            String fieldName = (err instanceof FieldError fe) ? fe.getField() : err.getObjectName();
            response.put(fieldName, err.getDefaultMessage());
        });
        // one readable sentence for clients that just want to show a message
        response.put("message", response.values().stream().findFirst().orElse("Invalid request"));

        return new ResponseEntity<Map<String,String>>(response, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse> CustomResourceNotFoundException(ResourceNotFoundException e){
        String message = e.getMessage();
        APIResponse apiResponse = new APIResponse(message,false );
        return new ResponseEntity<>(apiResponse,HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<APIResponse> badCredentials(org.springframework.security.authentication.BadCredentialsException e) {
        return new ResponseEntity<>(new APIResponse("Wrong username or password", false), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(org.springframework.data.mapping.PropertyReferenceException.class)
    public ResponseEntity<APIResponse> badSortField(org.springframework.data.mapping.PropertyReferenceException e) {
        return new ResponseEntity<>(new APIResponse("Cannot sort by that field", false), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(APIException.class)
    public ResponseEntity<APIResponse> CustomAPIException(APIException e){
        String message = e.getMessage();
        APIResponse apiResponse = new APIResponse(message,false );
        return new ResponseEntity<>(apiResponse,HttpStatus.BAD_REQUEST);
    }

}
