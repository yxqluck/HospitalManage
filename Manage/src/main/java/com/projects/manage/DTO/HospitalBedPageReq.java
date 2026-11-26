package com.projects.manage.DTO;

import lombok.Data;

@Data
public class HospitalBedPageReq {

    private Integer pageNo = 1;

    private Integer pageSize = 10;

    private Long roomId;

    private String dept;

    private Integer bedStatus;
}
