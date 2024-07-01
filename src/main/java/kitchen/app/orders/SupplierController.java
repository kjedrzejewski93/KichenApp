package kitchen.app.orders;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping
    public ResponseEntity<Supplier> addSupplier(@RequestBody Supplier supplier){
        return new ResponseEntity<>(supplierService.addSupplier(supplier), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers(){
        List<Supplier> suppliers = supplierService.getAllSuppliers();
        return new ResponseEntity<>(suppliers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id){
        boolean isRemoved = supplierService.deleteSupplier(id);

        if(!isRemoved){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PostMapping("/{id}/products")
    public ResponseEntity<Product> addProductToSupplier(@PathVariable Long id, @RequestBody Product product){
        Product createdProduct = supplierService.addProductToSupplier(id, product);
        if(createdProduct == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
}
