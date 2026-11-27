package com.projects.manage.service.HospitalBed;

import com.projects.manage.DTO.HospitalBedPageReq;
import com.projects.manage.common.PageResult;
import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;

import java.util.List;


public interface HospitalBedService {

    List<HospitalBedVO> findAll();

    PageResult<HospitalBedVO> findPage(HospitalBedPageReq req);

    List<HospitalBedVO> findList(Long roomId, Integer bedStatus);

    HospitalBedVO getBedById(Long bedId);

    int create(HospitalBedVO hospitalBedVO);

    int update(HospitalBedVO hospitalBedVO);

    int delete(Long bedId);

    int updateStatus(Long bedId, Integer bedStatus);
}
