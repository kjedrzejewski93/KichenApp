package kitchen.app.orders;


import kitchen.app.orders.SupplierNotFoundException.SupplierNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    private static final Logger logger = LoggerFactory.getLogger(SupplierService.class);

    @Autowired
    private ProductRepository productRepository;

    public Supplier addSupplier(Supplier supplier){
        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAllSuppliers(){
        logger.info("Fetching all suppliers");
        List<Supplier> suppliers = supplierRepository.findAll();
        logger.info("Fetched {} suppliers", suppliers.size());
        return suppliers;
    }

    public boolean deleteSupplier(Long id){
        if(supplierRepository.existsById(id)){
            supplierRepository.deleteById(id);
            return true;
        }
        return false;
    }

//    public Product addProductToSupplier(long supplierId, Product product){
//        Optional<Supplier> supplierOptional = supplierRepository.findById(supplierId);
//        if(!supplierOptional.isPresent()){
//            return null;
//        }
//        Supplier supplier = supplierOptional.get();
//        product.setSupplier(supplier);
//        supplier.setProductCount(supplier.getProductCount() + 1);
//        return productRepository.save(product);
//    }

    public Product addProductToSupplier(Long supplierId, Product product) {
        logger.info("Adding product to supplier with id {}", supplierId);
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new SupplierNotFoundException("Supplier not found"));
        logger.info("Found supplier: {}", supplier.getName());

        supplier.addProduct(product);
        supplierRepository.save(supplier);
        logger.info("Product added successfully");

        return product;
    }



//    public Product addProduct(Product product) {
//        return productRepository.save(product);
//    }
}
