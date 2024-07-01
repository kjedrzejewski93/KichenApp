package kitchen.app.orders;


import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private SupplierService supplierService;
    @Autowired
    private OrderService orderService;

    @PostMapping("/add")
    public ResponseEntity<?> addProductToOrder(@RequestBody OrderItem orderItem, HttpSession session){
        System.out.println("Session ID: " + session.getId());
        try {
            List<OrderItem> order = (List<OrderItem>) session.getAttribute("order");
            if (order == null) {
                order = new ArrayList<>();
                session.setAttribute("order", order);
            }
            order.add(orderItem);
            session.setAttribute("order", order);
            System.out.println("Product added to order: " + orderItem);
            System.out.println("Current order: " + order);
            return ResponseEntity.ok(orderItem);
        } catch(ClassCastException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing order in session");
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderItem>> getOrder(HttpSession session){
        List<OrderItem> order = (List<OrderItem>) session.getAttribute("order");
        if(order == null){
            order = new ArrayList<>();
        }
        return ResponseEntity.ok(order);
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitOrder(HttpSession session){
        System.out.println("Session ID: " + session.getId());
        List<OrderItem> order = (List<OrderItem>) session.getAttribute("order");

        if (order == null) {
            System.out.println("Order is null");
            return ResponseEntity.badRequest().body("Order is empty");
        } else if (order.isEmpty()) {
            System.out.println("Order is empty");
            return ResponseEntity.badRequest().body("Order is empty");
        } else {
            System.out.println("Order items: " + order.size());
            order.forEach(item -> System.out.println(item));
        }

        try {
            // Debugging: Ensure each item is valid
            for (OrderItem item : order) {
                System.out.println("Processing item: " + item);
                if (item.getProductName() == null || item.getQuantity() <= 0 || item.getUnit() == null) {
                    System.out.println("Invalid item detected: " + item);
                    return ResponseEntity.badRequest().body("Invalid item in order");
                }
            }
            orderService.saveOrder(order);
            session.removeAttribute("order");
            return ResponseEntity.ok("Order submitted successfully");
        } catch (Exception e) {
            System.out.println("Error submitting order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting order");
        }


//    StringBuilder emailContent = new StringBuilder("Order Summary: \n");
//    for(OrderItem item : order){
//        emailContent.append(item.getProductName()).append(" ")
//                .append(item.getQuantity()).append(" ")
//                .append(item.getUnit()).append("\n");
//    }
//
//
//    session.removeAttribute("order");
//    return ResponseEntity.ok("Order submitted successfully");


}
}
