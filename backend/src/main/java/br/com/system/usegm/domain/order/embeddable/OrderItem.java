package br.com.system.usegm.domain.order.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    private String referencia;
    private String name;
    private Integer quantity;
    private String color;
    @Column(columnDefinition = "TEXT")
    private String image;

}
