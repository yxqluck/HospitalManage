package com.projects.manage.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<T> {
    private List<T> list;
    private Long total;

    public static<T> PageResult<T> of(List<T> list,Long total){
        return new PageResult<>(
                list == null ? new ArrayList<>() : list,
                total == null ? 0L : total
        );
    }

    public static<T> PageResult<T> empty(){
        return new PageResult<>(new ArrayList<>(),0L);
    }
}
