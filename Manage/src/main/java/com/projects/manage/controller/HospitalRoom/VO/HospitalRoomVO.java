package com.projects.manage.controller.HospitalRoom.VO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HospitalRoomVO {
    private Long roomId;

    private String location;

    private BigDecimal fee;

    private String dept;
    /**
     * 0:启用，1:禁止
     */
    private Integer status;

    private Integer bedCount;

    private Integer freeBedCount;

    private Integer occupiedBedCount;

    private Integer repairBedCount;
}
