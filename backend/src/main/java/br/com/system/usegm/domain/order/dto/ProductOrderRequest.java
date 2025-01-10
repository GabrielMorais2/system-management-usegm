package br.com.system.usegm.domain.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductOrderRequest {

    @NotNull
    private Long id;

    @Min(1)
    private int quantity;
}