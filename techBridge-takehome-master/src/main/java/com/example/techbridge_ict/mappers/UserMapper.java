package com.example.techbridge_ict.mappers;


import com.example.techbridge_ict.dto.user.UserDto;
import com.example.techbridge_ict.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", uses = {RoleMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper extends EntityMapper<UserDto, User> {

    @Mapping(target = "password", ignore = true)
    UserDto toDto(User user);

    User toEntity(UserDto userDto);

    @Mapping(target = "password", ignore = true)
    Set<UserDto> toDto(Set<User> userList);

    Set<User> toEntity(Set<UserDto> userDtoList);
}
