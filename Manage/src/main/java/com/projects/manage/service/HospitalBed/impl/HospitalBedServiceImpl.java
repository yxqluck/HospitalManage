package com.projects.manage.service.HospitalBed.impl;

import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import com.projects.manage.mapper.HospitalBedMapper;
import com.projects.manage.service.HospitalBed.HospitalBedService;
import com.projects.manage.utils.ConvertUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HospitalBedServiceImpl implements HospitalBedService {

    @Autowired
    private HospitalBedMapper hospitalBedMapper;

    @Override
    public List<HospitalBedVO> findAll() {
        return ConvertUtils.CovertList(hospitalBedMapper.findAll(), HospitalBedVO.class);
    }
}
