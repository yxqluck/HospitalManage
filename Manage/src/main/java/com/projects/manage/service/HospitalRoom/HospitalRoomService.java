package com.projects.manage.service.HospitalRoom;

import com.projects.manage.DTO.HospitalRoomPageReq;
import com.projects.manage.common.PageResult;
import com.projects.manage.controller.HospitalRoom.VO.HospitalRoomDetailVO;
import com.projects.manage.controller.HospitalRoom.VO.HospitalRoomVO;

import java.util.List;

public interface HospitalRoomService {

    PageResult<HospitalRoomVO> getRoomPage(HospitalRoomPageReq req);

    List<HospitalRoomVO> getRoomList();

    HospitalRoomVO getById(Long roomId);

    HospitalRoomDetailVO getDetailById(Long roomId);

    int createRoom(HospitalRoomVO hospitalRoomVO);

    int updateRoom(HospitalRoomVO hospitalRoomVO);

    int deleteRoom(Long roomId);

    int updateRoomStatus(Long roomId, Integer status);
}
