package com.example.techbridge_ict.mappers;



import com.example.techbridge_ict.dto.BaseDto;
import com.example.techbridge_ict.model.AbstractModel;

import java.util.List;

public interface EntityMapper<D extends BaseDto, E extends AbstractModel> {

    E toEntity(D dto);

    D toDto(E entity);

    List<E> toEntity(List<D> dtoList);

    List<D> toDto(List<E> entityList);
}
