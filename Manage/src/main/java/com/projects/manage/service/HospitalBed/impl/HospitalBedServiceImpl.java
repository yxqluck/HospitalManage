package com.projects.manage.service.HospitalBed.impl;

import com.projects.manage.DTO.HospitalBedPageReq;
import com.projects.manage.common.PageResult;
import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import com.projects.manage.mapper.HospitalBedMapper;
import com.projects.manage.service.HospitalBed.HospitalBedService;
import com.projects.manage.utils.ConvertUtils;
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

    @Override
    public PageResult<HospitalBedVO> findPage(HospitalBedPageReq req) {
        // 修正PageNo
        if (req.getPageNo() == null || req.getPageNo() < 1){
            req.setPageNo(1);
        }
        // 修正PageSize
        if (req.getPageSize() == null || req.getPageSize() < 1){
            req.setPageSize(10);
        } else if (req.getPageSize() > 100) {
            req.setPageSize(100);
        }
        // 修正dept
        String dept = req.getDept();
        if (dept != null) {
            dept = dept.trim();
            if (dept.isEmpty()) {
                req.setDept(null);
            } else {
                req.setDept(dept);
            }
        }
        // 设置分页的起始项数
        int offset = (req.getPageNo()-1)* req.getPageSize();
        // 获取数据库中的全部数据
        long total = hospitalBedMapper.countPage(req);
        // 判断数据是否为空
        if (total == 0)
            return PageResult.of(new ArrayList<>(), 0L);
        // 获得当前分页的数据列表
        List<HospitalBedVO> list = hospitalBedMapper.findPage(req,offset,req.getPageSize());

        return PageResult.of(list,total);
    }

    @Override
    public List<HospitalBedVO> findList(Long roomId, Integer bedStatus) {
        return hospitalBedMapper.findList(roomId, bedStatus);
    }

    @Override
    public HospitalBedVO getBedById(Long bedId) {
        return hospitalBedMapper.getBedById(bedId);
    }

    @Override
    public int create(HospitalBedVO hospitalBedVO) {
        return hospitalBedMapper.create(hospitalBedVO);
    }

    @Override
    public int update(HospitalBedVO hospitalBedVO) {
        return hospitalBedMapper.update(hospitalBedVO);
    }

    @Override
    public int delete(Long bedId) {
        // 判断床位是否被占用
        final HospitalBedVO hospitalBedVO = hospitalBedMapper.getBedById(bedId);
        if (hospitalBedVO == null)
            return 0;
        if (hospitalBedVO.getBedStatus() == 1)
            return 0;
        return hospitalBedMapper.delete(bedId);
    }

    @Override
    public int updateStatus(Long bedId, Integer bedStatus) {
        HospitalBedVO hospitalBedVO = getBedById(bedId);
        hospitalBedVO.setBedStatus(bedStatus);
        return hospitalBedMapper.update(hospitalBedVO);
    }


}
