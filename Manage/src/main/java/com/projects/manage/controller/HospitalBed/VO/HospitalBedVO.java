package com.projects.manage.controller.HospitalBed.VO;

import lombok.Data;

@Data
public class HospitalBedVO {
    private Long bedId;

    private Long roomId;

    private Integer bedNo;
    /**
     * 空闲 / 占用 / 维修（0、1、2）
     */
    private Integer bedStatus;
}
