package br.com.system.usegm.domain.order.dto;

import br.com.system.usegm.domain.order.OrderStatusEnum;
import lombok.Data;

@Data
public class PatchStatusDTO {
    private OrderStatusEnum status;
}
