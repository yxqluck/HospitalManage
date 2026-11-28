package com.projects.manage.controller.HospitalBed;

import com.projects.manage.DTO.HospitalBedPageReq;
import com.projects.manage.common.PageResult;
import com.projects.manage.common.Result;
import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import com.projects.manage.service.HospitalBed.HospitalBedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hospital/bed")
public class HospitalBedController {
    @Autowired
    private HospitalBedService hospitalBedService;

    @GetMapping("/page")
    public Result<PageResult<HospitalBedVO>> getBedPage(HospitalBedPageReq hospitalBedPageReq){
        return Result.success(hospitalBedService.findPage(hospitalBedPageReq));
    }

    @GetMapping("/list")
    public Result<List<HospitalBedVO>> getBedList(
            @RequestParam(required = false) Long roomId,
            @RequestParam(required = false) Integer bedStatus
    ){
        return Result.success(hospitalBedService.findList(roomId,bedStatus));
    }

    @GetMapping("/get")
    public Result<HospitalBedVO> getBedById(@RequestParam("id") Long bedId){
        return Result.success(hospitalBedService.getBedById(bedId));
    }

    @PostMapping("/create")
    public Result<HospitalBedVO> create(@RequestBody HospitalBedVO hospitalBedVO){
        if (hospitalBedService.create(hospitalBedVO) != 1)
            return Result.error(400,"添加失败");
        return Result.success(hospitalBedVO);
    }

    @PutMapping("/update")
    public Result<HospitalBedVO> update(@RequestBody HospitalBedVO hospitalBedVO){
        if (hospitalBedService.update(hospitalBedVO) != 1)
            return Result.error(400,"更新失败");
        return Result.success(hospitalBedVO);
    }

    @DeleteMapping("/delete")
    public Result<HospitalBedVO> delete(@RequestParam("id") Long bedId){
        if (hospitalBedService.delete(bedId) != 1)
            return Result.error(400,"删除失败");
        return Result.success();
    }

    @PutMapping("/update-status")
    public Result<HospitalBedVO> updateStatus(@RequestBody Map<String,Object> map ) {
        Long bedId = Long.valueOf(map.get("id").toString());
        Integer bedStatus = Integer.valueOf(map.get("bedStatus").toString());

        if (hospitalBedService.updateStatus(bedId,bedStatus) != 1)
            return Result.error(400,"更新状态失败");
        return Result.success();
    }
}
