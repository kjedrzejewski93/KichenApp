package kitchen.app.orders;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public void saveOrder(List<OrderItem> order) {
        for (OrderItem item : order) {
            try {
                System.out.println("Saving item: " + item);
                orderRepository.save(item);
            } catch (Exception e) {
                System.out.println("Error saving item: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
