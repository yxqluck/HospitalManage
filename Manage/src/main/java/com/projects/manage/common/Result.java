package com.projects.manage.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    private Integer code = 0;
    private String msg = "";
    private T data;

    public static<T> Result<T> success(T data){
        return new Result<>(0, "", data);
    }

    public static<T> Result<T> success(){
        return success(null);
    }

    public static <T> Result<T> error(Integer code, String msg) {
        return new Result<>(code, msg, null);
    }
}
