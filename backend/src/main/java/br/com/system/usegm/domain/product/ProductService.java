package br.com.system.usegm.domain.product;

import br.com.system.usegm.domain.product.dto.ProductRequest;
import br.com.system.usegm.domain.product.dto.ProductResponse;
import br.com.system.usegm.exception.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper mapper;

    public Page<ProductResponse> getAllProducts(String reference, Pageable pageable) {
        Page<Product> productPage = productRepository.findAllByReference(reference, pageable);
        return productPage.map(product -> mapper.map(product, ProductResponse.class));
    }

    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = mapper.map(productRequest, Product.class);
        product.setCreatedAt(LocalDateTime.now());
        Product savedProduct = productRepository.save(product);
        return mapper.map(savedProduct, ProductResponse.class);
    }

    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        existingProduct.setName(productRequest.getName());
        existingProduct.setReference(productRequest.getReference());
        existingProduct.setQuantity(productRequest.getQuantity());
        existingProduct.setImage(productRequest.getImage());

        Product updatedProduct = productRepository.save(existingProduct);
        return mapper.map(updatedProduct, ProductResponse.class);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}
