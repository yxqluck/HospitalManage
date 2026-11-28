package com.projects.manage.DTO;


import lombok.Data;

@Data
public class HospitalRoomPageReq {
    private Integer pageNo = 1;

    private Integer pageSize = 10;

    private Integer roomId;

    private String dept;

    private String location;

    private Integer status;
}
