package com.projects.manage.DO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HospitalRecordInhDO {

    private Long inhId;

    private Long roomId;

    private Long bedId;

    private Long patientId;

    private LocalDateTime recordDate;

    private LocalDateTime inTime;

    private LocalDateTime outTime;
}