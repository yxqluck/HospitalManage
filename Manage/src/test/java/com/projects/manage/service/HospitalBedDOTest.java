package com.projects.manage.service;

import com.projects.manage.service.HospitalBed.HospitalBedService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class HospitalBedDOTest {
    @Autowired
    private HospitalBedService hospitalBedService;
    @Test
    public void findalltest(){
        System.out.println(hospitalBedService.findAll());
    }

    @Test
    public void findListTest(){
        System.out.println(hospitalBedService.findList(101L,null));
    }

    @Test
    public void getBedById(){
        System.out.println(hospitalBedService.getBedById(1001L));
    }
}
