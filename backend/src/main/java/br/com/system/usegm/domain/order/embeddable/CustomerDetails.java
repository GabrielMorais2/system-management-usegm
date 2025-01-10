package br.com.system.usegm.domain.order.embeddable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDetails {

    private String name;
    private String email;
    private String phone;
}