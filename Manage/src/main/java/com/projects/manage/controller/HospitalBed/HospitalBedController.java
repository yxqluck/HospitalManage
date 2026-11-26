package com.projects.manage.controller.HospitalBed;

import com.projects.manage.DTO.HospitalBedPageReq;
import com.projects.manage.common.PageResult;
import com.projects.manage.common.Result;
import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import com.projects.manage.service.HospitalBed.HospitalBedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hospital/bed")
public class HospitalBedController {
    @Autowired
    private HospitalBedService hospitalBedService;

    @GetMapping("/all")
    public List<HospitalBedVO> FindAll(){
        return List.of();
    }

    @GetMapping("/page")
    public Result<PageResult<HospitalBedVO>> getPage(HospitalBedPageReq hospitalBedPageReq){

        return Result.success(hospitalBedService.findPage(hospitalBedPageReq));
    }
}
