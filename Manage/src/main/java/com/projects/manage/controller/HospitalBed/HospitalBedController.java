package com.projects.manage.controller.HospitalBed;

import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class HospitalBedController {
    @GetMapping("/bed")
    public List<HospitalBedVO> FindAll(){
        return List.of();
    }
}
