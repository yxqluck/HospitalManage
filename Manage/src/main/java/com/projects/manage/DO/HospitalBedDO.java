package com.projects.manage.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalBedDO {

    private Long bedId;

    private Long roomId;

    private Integer bedNo;
    /**
     * 空闲 / 占用 / 维修（0、1、2）
     */
    private Integer bedStatus;
}