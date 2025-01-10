package br.com.system.usegm.domain.order.dto;

import br.com.system.usegm.domain.order.OrderStatusEnum;
import br.com.system.usegm.domain.order.embeddable.CustomerDetails;
import br.com.system.usegm.domain.order.embeddable.ShippingDetails;
import br.com.system.usegm.domain.product.dto.ProductResponse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {

    private Long id;
    private CustomerDetails customerDetails;
    private ShippingDetails shippingDetails;
    private OrderStatusEnum status;
    private LocalDateTime createdAt;
    private String observations;
    private List<ProductResponse> products;
}