package kitchen.app.orders;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {


    private final ProductRepository productRepository;
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);


    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product){
        logger.info("Adding new product: {}", product.getName());
        return productRepository.save(product);
    }

    public List<Product> getProductsBySupplier(Long supplierId) {
        logger.info("Fetching products for supplierId: {}", supplierId);

        List<Product> products = productRepository.findBySupplierId(supplierId);
        logger.info("Products found: {}", products.size());

        return products;
    }
}
