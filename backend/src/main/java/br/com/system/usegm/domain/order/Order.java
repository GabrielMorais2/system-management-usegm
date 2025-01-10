package br.com.system.usegm.domain.order;

import br.com.system.usegm.domain.order.embeddable.CustomerDetails;
import br.com.system.usegm.domain.order.embeddable.ShippingDetails;
import br.com.system.usegm.domain.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private CustomerDetails customerDetails;

    @Embedded
    private ShippingDetails shippingDetails;

    @Enumerated(EnumType.STRING)
    private OrderStatusEnum status;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    private String observations;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProduct> orderProducts = new ArrayList<>();
}