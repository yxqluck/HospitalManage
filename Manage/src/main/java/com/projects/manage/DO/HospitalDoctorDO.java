package com.projects.manage.DO;

import lombok.Data;

@Data
public class HospitalDoctorDO {

    private Long docId;

    private String docName;
    /**
     * 男（1） / 女（0）
     */
    private Integer gender;

    private String title;

    private String phone;

    private String dept;
}