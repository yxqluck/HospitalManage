package com.projects.manage.DO;

import lombok.Data;

@Data
public class HospitalPatientDO {

    private Long patientId;

    private Long roomId;

    private String patientName;
    /**
     * 男（1） / 女（0）
     */
    private Integer gender;

    private String address;

    private String phone;
}