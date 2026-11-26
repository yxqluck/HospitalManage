package com.projects.manage.service.HospitalBed;

import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface HospitalBedService {

    List<HospitalBedVO> findAll();
}
