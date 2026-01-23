package com.exportify.features.users.controller;

import com.exportify.features.users.dto.UserRequest;
import com.exportify.features.users.dto.UserResponse;
import com.exportify.features.users.model.Users;
import com.exportify.features.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(service.createUser(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getForId(@PathVariable Long id){
        return ResponseEntity.ok(service.getForId(id));
    }

    @GetMapping
    public ResponseEntity<Iterable<UserResponse>> listUsers(){
        return ResponseEntity.ok(service.listUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PutMapping("/{id}/desactivate")
    public ResponseEntity<?> desactivate(@PathVariable Long id) {
        service.desactivate(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    // POST: http://localhost:8080/users/1/follow/5
    @PostMapping("/{myId}/follow/{targetId}")
    public ResponseEntity<String> followUser(@PathVariable Long myId, @PathVariable Long targetId) {
        service.followUser(myId, targetId);
        return ResponseEntity.ok("¡Usuario seguido con éxito!");
    }

    // DELETE: http://localhost:8080/users/1/unfollow/5
    @DeleteMapping("/{myId}/unfollow/{targetId}")
    public ResponseEntity<String> unfollowUser(@PathVariable Long myId, @PathVariable Long targetId) {
        service.unfollowUser(myId, targetId);
        return ResponseEntity.ok("Dejaste de seguir al usuario.");
    }

    // GET: http://localhost:8080/users/1/following
    @GetMapping("/{myId}/following")
    public ResponseEntity<List<UserResponse>> getMyFollowing(@PathVariable Long myId) {
        return ResponseEntity.ok(service.getFollowingList(myId));
    }
}
