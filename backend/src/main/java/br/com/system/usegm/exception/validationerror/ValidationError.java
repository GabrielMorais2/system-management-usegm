package br.com.system.usegm.exception.validationerror;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValidationError {

    private final String message;
    private final String field;

}