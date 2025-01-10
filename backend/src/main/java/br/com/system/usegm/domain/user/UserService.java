package br.com.system.usegm.domain.user;

import br.com.system.usegm.domain.user.payload.LoginRequestDTO;
import br.com.system.usegm.domain.user.payload.RegisterRequestDTO;
import br.com.system.usegm.domain.user.payload.RegisterResponseDTO;
import br.com.system.usegm.domain.user.payload.TokenResponseDTO;
import br.com.system.usegm.exception.EmailAlreadyExistsException;
import br.com.system.usegm.exception.EntityNotFoundException;
import br.com.system.usegm.infra.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final ModelMapper mapper;


    public RegisterResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) {
        validateEmailUniqueness(registerRequestDTO.getEmail());
        registerRequestDTO.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
        User newUser = mapper.map(registerRequestDTO, User.class);
        newUser.setRole("USER");

        userRepository.save(newUser);
        return new RegisterResponseDTO(newUser.getEmail(), newUser.getName());
    }

    public TokenResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = repository.findByEmail(loginRequestDTO.getEmail()).orElseThrow(() -> new EntityNotFoundException("Email or password incorrect"));
        if(passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            return new TokenResponseDTO(this.tokenService.generateToken(user), user.getName(), user.getRole());
        }
        throw new BadCredentialsException("Email or password incorrect");
    }

    public void validateEmailUniqueness(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already exists: " + email);
        }
    }
}
