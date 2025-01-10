package br.com.system.usegm.domain.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE (:reference IS NULL OR p.reference LIKE %:reference%) ORDER BY p.createdAt DESC")
    Page<Product> findAllByReference(@Param("reference") String reference, Pageable pageable);
}