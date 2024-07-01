package kitchen.app.controller;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kitchen.app.model.User;
import kitchen.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.ServletRequestAttributes;

//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpSession;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081/")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        if(user.getUsername() == null || user.getPassword() == null){
            return ResponseEntity.badRequest().body("Nazwa użytkownika i hasło nie mogą być puste");
        }
        if(userRepository.findByUsername(user.getUsername()) != null){
            return ResponseEntity.badRequest().body("Login użyto");
        }

        user.setAdmin(false);
        userRepository.save(user);
        return ResponseEntity.ok("Dodano prawidłowo");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpSession session){
        if(user.getUsername() == null || user.getPassword() == null){
            return ResponseEntity.badRequest().body("Nazwa użytkownika i hasło nie mogą być puste");
        }
        try {
            User existingUser = userRepository.findByUsername(user.getUsername());
            if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
                session.setAttribute("user", existingUser);
                return ResponseEntity.ok(existingUser);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Błędny login lub hasło");
            }
        } catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Błąd serwera");
        }
    }

    @GetMapping("/welcome")
    public ResponseEntity<?> welcome(HttpSession session){
        try {
//            HttpSession session = request.getSession();
            User user = (User) session.getAttribute("user");
            if (user != null) {
                return ResponseEntity.ok("Witaj, " + user.getUsername() + "!");
            } else {
                return ResponseEntity.status(401).body("Nie udało się zalogować");
            }
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("Błąd serwera");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session){
        session.invalidate();
        return ResponseEntity.ok("Udało się wylogować");
    }

    private User getUserFromSession(HttpServletRequest request){
        HttpSession session = request.getSession();
        return (User) session.getAttribute("user");
    }


    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(){
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{userId}/toggle-admin")
    public ResponseEntity<?> toggleAdminStatus(@PathVariable Long userId){
        Optional<User> optionalUser = userRepository.findById(userId);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            user.setAdmin(!user.isAdmin());
            userRepository.save(user);
            return ResponseEntity.ok("Udało się zmienić status dla użytkownika" + user.getUsername());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/admin-panel")
    public ResponseEntity<?> showAdminPanel(HttpSession session){
        User user = (User) session.getAttribute("user");
        if(user != null && user.isAdmin()){
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }





}
