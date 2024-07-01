package kitchen.app.orders;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);


    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
        return new ResponseEntity<>(productService.addProduct(product), HttpStatus.CREATED);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<Product>> getProductsBySupplier(@PathVariable("supplierId") Long supplierId) {
        logger.info("Received GET request for products by supplierId: {}", supplierId);

        List<Product> products = productService.getProductsBySupplier(supplierId);
        logger.info("Products retrieved: {}", products.size());

        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
