package com.projects.manage.controller.HospitalRoom;


import com.projects.manage.DTO.HospitalRoomPageReq;
import com.projects.manage.common.PageResult;
import com.projects.manage.common.Result;
import com.projects.manage.controller.HospitalRoom.VO.HospitalRoomDetailVO;
import com.projects.manage.controller.HospitalRoom.VO.HospitalRoomVO;
import com.projects.manage.service.HospitalRoom.HospitalRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hospital/room")
public class HospitalRoomController {

    @Autowired
    private HospitalRoomService hospitalRoomService;

    @GetMapping("/page")
    public Result<PageResult<HospitalRoomVO>> getRoomPage(HospitalRoomPageReq hospitalRoomPageReq){
        return Result.success(hospitalRoomService.getRoomPage(hospitalRoomPageReq));
    }

    @GetMapping("/list")
    public Result<List<HospitalRoomVO>> getRoomList(){
        return Result.success(hospitalRoomService.getRoomList());
    }

    @GetMapping("/get")
    public Result<HospitalRoomVO> getById(@RequestParam("id") Long roomId){
        return Result.success(hospitalRoomService.getById(roomId));
    }

    @GetMapping("/detail")
    public Result<HospitalRoomDetailVO> getDetailById(@RequestParam("id") Long roomId){
        return Result.success(hospitalRoomService.getDetailById(roomId));
    }

    @PostMapping("/create")
    public Result<HospitalRoomVO> createRoom(@RequestBody HospitalRoomVO hospitalRoomVO){
        if (hospitalRoomService.createRoom(hospitalRoomVO) != 1)
            return Result.error(400,"添加失败");
        return Result.success(hospitalRoomVO);
    }

    @PutMapping("/update")
    public Result<HospitalRoomVO> updateRoom(@RequestBody HospitalRoomVO hospitalRoomVO){
        if (hospitalRoomService.updateRoom(hospitalRoomVO) != 1)
            return Result.error(400,"更新失败");
        return Result.success(hospitalRoomVO);
    }

    @DeleteMapping("/delete")
    public Result<HospitalRoomVO> deleteRoom(@RequestParam("id") Long roomId){
        if (hospitalRoomService.deleteRoom(roomId) != 1)
            return Result.error(400,"删除失败");
        return Result.success();
    }

    @PutMapping("/update-status")
    public Result<HospitalRoomVO> updateStatus(@RequestBody Map<String,Object> map){
        Long roomId = Long.valueOf(map.get("id").toString());
        Integer roomStatus = Integer.valueOf(map.get("status").toString());

        if (hospitalRoomService.updateRoomStatus(roomId,roomStatus) != 1)
            return Result.error(400,"更新状态失败");
        return Result.success();
    }
}
