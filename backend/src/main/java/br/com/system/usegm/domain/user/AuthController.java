package br.com.system.usegm.domain.user;

import br.com.system.usegm.domain.user.payload.LoginRequestDTO;
import br.com.system.usegm.domain.user.payload.RegisterRequestDTO;
import br.com.system.usegm.domain.user.payload.RegisterResponseDTO;
import br.com.system.usegm.domain.user.payload.TokenResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO){
        TokenResponseDTO jwtToken = userService.login(loginRequestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(jwtToken);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO){
        RegisterResponseDTO registerResponse = userService.registerUser(registerRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerResponse);
    }
}
