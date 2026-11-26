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

}
