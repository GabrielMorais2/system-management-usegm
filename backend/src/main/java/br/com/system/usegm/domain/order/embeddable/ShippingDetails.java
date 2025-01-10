package br.com.system.usegm.domain.order.embeddable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShippingDetails {

    @Enumerated(EnumType.STRING)
    private ShippingTypeEnum type;

    private String deliveryAddress;
    private String street;
    private String number;
    private String neighborhood;
    private String city;
    private String state;
    private LocalDate deliveryDate;

    private String excursionName;
    private String seatNumber;
    private String sector;

    private String transporterName;
}
