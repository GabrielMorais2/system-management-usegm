package br.com.system.usegm.domain.order.dto;

import br.com.system.usegm.domain.order.OrderStatusEnum;
import br.com.system.usegm.domain.order.embeddable.CustomerDetails;
import br.com.system.usegm.domain.order.embeddable.ShippingDetails;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotNull
    private CustomerDetails customerDetails;

    private ShippingDetails shippingDetails;

    private OrderStatusEnum status;

    private String observations;

    @NotNull
    private List<ProductOrderRequest> products;
}