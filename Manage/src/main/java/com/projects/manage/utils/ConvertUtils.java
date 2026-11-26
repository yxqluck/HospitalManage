package com.projects.manage.utils;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

@Component
public class ConvertUtils {

    /**
     * 将源列表的元素转换为目标类的元素
     * 主要实现DO转VO
     *
     * @param srcList   源列表
     * @param targetClass   目标类
     * @return  转换后列表
     */
    public static <S, T> List<T> CovertList(List<S> srcList, Class<T> targetClass){
        List<T> returnList = new ArrayList<>();
        srcList.forEach(s -> {
                try{
                    T t = targetClass.getDeclaredConstructor().newInstance();
                    BeanUtils.copyProperties(s,t);
                    returnList.add(t);
                }catch (Exception e){
                    System.out.println("ERROR");
                    System.out.println(e.getMessage());
                }

            }
        );

        return returnList;
    }
}
