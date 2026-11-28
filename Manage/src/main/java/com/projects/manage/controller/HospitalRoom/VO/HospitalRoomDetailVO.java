package com.projects.manage.controller.HospitalRoom.VO;

import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import lombok.Data;

import java.util.List;

@Data
public class HospitalRoomDetailVO {
    private HospitalRoomVO room;

    private List<HospitalBedVO> beds;
}
