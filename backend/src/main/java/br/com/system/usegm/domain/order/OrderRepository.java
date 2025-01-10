package br.com.system.usegm.domain.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderProducts op LEFT JOIN FETCH op.product " +
            "WHERE (:status IS NULL OR o.status = :status) ORDER BY o.createdAt DESC")
    Page<Order> findAllByStatusWithItems(@Param("status") OrderStatusEnum status, Pageable pageable);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderProducts op LEFT JOIN FETCH op.product " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findAllWithItems(Pageable pageable);
}
