package br.com.system.usegm.domain.order;

import br.com.system.usegm.domain.order.dto.OrderRequest;
import br.com.system.usegm.domain.order.dto.OrderResponse;
import br.com.system.usegm.domain.order.dto.PatchStatusDTO;
import br.com.system.usegm.domain.order.dto.ProductOrderRequest;
import br.com.system.usegm.domain.order.embeddable.CustomerDetails;
import br.com.system.usegm.domain.order.embeddable.ShippingDetails;
import br.com.system.usegm.domain.order.embeddable.ShippingTypeEnum;
import br.com.system.usegm.domain.product.Product;
import br.com.system.usegm.domain.product.ProductRepository;
import br.com.system.usegm.domain.product.dto.ProductResponse;
import br.com.system.usegm.exception.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ModelMapper mapper;

    public Page<OrderResponse> getAllOrders(OrderStatusEnum status, Pageable pageable, boolean all) {
        return all ? getAllOrdersWithoutStatus(pageable) : getPagedOrders(status, pageable);
    }

    private Page<OrderResponse> getAllOrdersWithoutStatus(Pageable pageable) {
        return orderRepository.findAllWithItems(pageable)
                .map(order -> {
                    OrderResponse orderResponse = mapper.map(order, OrderResponse.class);

                    List<ProductResponse> productResponses = order.getOrderProducts().stream()
                            .map(op -> {
                                Product product = op.getProduct();
                                return new ProductResponse(
                                        product.getId(),
                                        product.getName(),
                                        product.getReference(),
                                        op.getQuantity(),
                                        product.getImage()
                                );
                            })
                            .collect(Collectors.toList());

                    // Associa os produtos ao OrderResponse
                    orderResponse.setProducts(productResponses);

                    return orderResponse;
                });
    }

    private Page<OrderResponse> getPagedOrders(OrderStatusEnum status, Pageable pageable) {
        return orderRepository.findAllByStatusWithItems(status, pageable)
                .map(order -> {
                    OrderResponse orderResponse = mapper.map(order, OrderResponse.class);

                    List<ProductResponse> productResponses = order.getOrderProducts().stream()
                            .map(op -> {
                                Product product = op.getProduct();
                                return new ProductResponse(
                                        product.getId(),
                                        product.getName(),
                                        product.getReference(),
                                        op.getQuantity(),
                                        product.getImage()
                                );
                            })
                            .collect(Collectors.toList());

                    orderResponse.setProducts(productResponses);

                    return orderResponse;
                });
    }

    public OrderResponse getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(order -> mapper.map(order, OrderResponse.class))
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
    }

    public OrderResponse createOrder(OrderRequest orderRequest) {
        Order order = buildNewOrder(orderRequest);
        order.setOrderProducts(handleOrderProducts(orderRequest.getProducts(), order, false));
        return mapper.map(orderRepository.save(order), OrderResponse.class);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        handleProductStockOnDeletion(order.getOrderProducts());
        orderRepository.deleteById(id);
    }

    public OrderResponse updateOrderStatus(Long id, PatchStatusDTO status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        order.setStatus(status.getStatus());
        return mapper.map(orderRepository.save(order), OrderResponse.class);
    }

    public OrderResponse updateOrder(Long id, OrderRequest orderRequest) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        updateCustomerDetails(order.getCustomerDetails(), orderRequest.getCustomerDetails());
        updateShippingDetails(order.getShippingDetails(), orderRequest.getShippingDetails());
        updateSimpleFields(order, orderRequest);
        updateOrderProducts(order, orderRequest.getProducts());

        return mapper.map(orderRepository.save(order), OrderResponse.class);
    }

    private Order buildNewOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setCustomerDetails(orderRequest.getCustomerDetails());
        order.setShippingDetails(orderRequest.getShippingDetails());
        order.setObservations(orderRequest.getObservations());
        order.setCreatedAt(LocalDateTime.now());
        if(orderRequest.getShippingDetails().getType().equals(ShippingTypeEnum.LOJA)){
            order.setStatus(OrderStatusEnum.LOJA);
        } else {
            order.setStatus(OrderStatusEnum.ABERTO);
        }
        return order;
    }

    private List<OrderProduct> handleOrderProducts(List<ProductOrderRequest> productRequests, Order order, boolean isReversing) {
        List<OrderProduct> orderProducts = new ArrayList<>();

        for (ProductOrderRequest item : productRequests) {
            Product product = productRepository.findById(item.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Product with ID " + item.getId() + " not found"));

            int quantityChange = isReversing ? item.getQuantity() : -item.getQuantity();

            if (product.getQuantity() + quantityChange < 0) {
                throw new IllegalArgumentException(
                        "Produto " + product.getName() + " tem saldo insuficiente. Requerido: " + item.getQuantity()
                                + ", Disponível: " + product.getQuantity());
            }

            product.setQuantity(product.getQuantity() + quantityChange);
            productRepository.save(product);

            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setOrder(order);
            orderProduct.setProduct(product);
            orderProduct.setQuantity(item.getQuantity());
            orderProducts.add(orderProduct);
        }

        return orderProducts;
    }

    private void handleProductStockOnDeletion(List<OrderProduct> orderProducts) {
        orderProducts.forEach(orderProduct -> {
            Product product = orderProduct.getProduct();
            product.setQuantity(product.getQuantity() + orderProduct.getQuantity());
            productRepository.save(product);
        });
    }

    private void updateCustomerDetails(CustomerDetails existingDetails, CustomerDetails requestDetails) {
        if (requestDetails == null) return;
        updateIfNotEmpty(requestDetails.getName(), existingDetails::setName);
        updateIfNotEmpty(requestDetails.getEmail(), existingDetails::setEmail);
        updateIfNotEmpty(requestDetails.getPhone(), existingDetails::setPhone);
    }

    private void updateShippingDetails(ShippingDetails existingDetails, ShippingDetails requestDetails) {
        if (requestDetails == null) return;

        if (requestDetails.getType() == ShippingTypeEnum.EXCURSAO) {
            updateIfNotEmpty(requestDetails.getExcursionName(), existingDetails::setExcursionName);
            updateIfNotEmpty(requestDetails.getSeatNumber(), existingDetails::setSeatNumber);
            updateIfNotEmpty(requestDetails.getSector(), existingDetails::setSector);
            updateIfNotNull(requestDetails.getDeliveryDate(), existingDetails::setDeliveryDate);
        } else if (requestDetails.getType() == ShippingTypeEnum.TRANSPORTADORA) {
            updateIfNotEmpty(requestDetails.getDeliveryAddress(), existingDetails::setDeliveryAddress);
            updateIfNotEmpty(requestDetails.getStreet(), existingDetails::setStreet);
            updateIfNotEmpty(requestDetails.getNumber(), existingDetails::setNumber);
            updateIfNotEmpty(requestDetails.getNeighborhood(), existingDetails::setNeighborhood);
            updateIfNotEmpty(requestDetails.getCity(), existingDetails::setCity);
            updateIfNotEmpty(requestDetails.getState(), existingDetails::setState);
        } else if (requestDetails.getType() == ShippingTypeEnum.LOJA) {
            existingDetails.setDeliveryDate(LocalDate.now());
        }

        updateIfNotNull(requestDetails.getType(), existingDetails::setType);
    }

    private void updateSimpleFields(Order existingOrder, OrderRequest orderRequest) {
        updateIfNotNull(orderRequest.getStatus(), existingOrder::setStatus);
        updateIfNotEmpty(orderRequest.getObservations(), existingOrder::setObservations);
    }

    private void updateOrderProducts(Order existingOrder, List<ProductOrderRequest> productsRequest) {
        if (productsRequest == null || productsRequest.isEmpty()) return;
        handleProductStockOnDeletion(existingOrder.getOrderProducts());
        existingOrder.setOrderProducts(handleOrderProducts(productsRequest, existingOrder, false));
    }

    private void updateIfNotEmpty(String value, Consumer<String> updater) {
        Optional.ofNullable(value).filter(v -> !v.isEmpty()).ifPresent(updater);
    }

    private <T> void updateIfNotNull(T value, Consumer<T> updater) {
        Optional.ofNullable(value).ifPresent(updater);
    }
}
