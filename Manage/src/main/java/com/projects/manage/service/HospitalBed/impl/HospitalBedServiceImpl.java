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
}
