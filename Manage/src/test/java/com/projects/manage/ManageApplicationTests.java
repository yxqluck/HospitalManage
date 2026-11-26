package com.projects.manage;

import com.projects.manage.DO.HospitalBedDO;
import com.projects.manage.mapper.HospitalBedMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootTest
class ManageApplicationTests {

    @Test
    void contextLoads() {
    }
    @Autowired
    private DataSource dataSource;

    @Autowired
    private HospitalBedMapper hospitalBedMapper;

    @Test
    public void connectdb() throws Exception{
        try (Connection conn = dataSource.getConnection()) {
            System.out.println(" 数据库连接成功！");
            System.out.println("连接信息：" + conn.getMetaData().getURL());
        }

    }

    @Test
    public void selecttest(){
        System.out.println(hospitalBedMapper.findAll());
        System.out.println("=====================");
        System.out.println(hospitalBedMapper.findAllById(1001L));
        System.out.println(hospitalBedMapper.findAllById(101L));

    }

    @Test
    public void insertTest(){
        HospitalBedDO hospitalBedDO = new HospitalBedDO(1002L,101L,1,0);
        hospitalBedMapper.insert(hospitalBedDO);
    }

}
