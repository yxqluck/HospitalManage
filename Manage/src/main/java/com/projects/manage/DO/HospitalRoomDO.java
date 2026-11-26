package com.projects.manage.DO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HospitalRoomDO {

    private Long roomId;

    private String location;

    private BigDecimal fee;

    private String dept;
}