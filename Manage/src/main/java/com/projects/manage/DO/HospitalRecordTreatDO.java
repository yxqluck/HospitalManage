package com.projects.manage.DO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HospitalRecordTreatDO {

    private Long treatId;

    private Long patientId;

    private Long docId;

    private LocalDateTime treatTime;

    private String diagnosis;

    private String plan;
}