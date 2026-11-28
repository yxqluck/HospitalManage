package com.projects.manage.service.HospitalRoom.impl;

import com.projects.manage.DO.HospitalRoomDO;
import com.projects.manage.DTO.HospitalRoomPageReq;
import com.projects.manage.common.PageResult;
import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import com.projects.manage.controller.HospitalRoom.VO.HospitalRoomDetailVO;
import com.projects.manage.controller.HospitalRoom.VO.HospitalRoomVO;
import com.projects.manage.mapper.HospitalBedMapper;
import com.projects.manage.mapper.HospitalRoomMapper;
import com.projects.manage.service.HospitalBed.HospitalBedService;
import com.projects.manage.service.HospitalRoom.HospitalRoomService;
import com.projects.manage.utils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

@Service
public class HospitalRoomServiceImpl implements HospitalRoomService {
    @Autowired
    HospitalRoomMapper hospitalRoomMapper;
    @Autowired
    HospitalBedMapper hospitalBedMapper;
    @Autowired
    HospitalBedService hospitalBedService;

    @Override
    public PageResult<HospitalRoomVO> getRoomPage(HospitalRoomPageReq req) {
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
        // 修正location
        String location = req.getLocation();
        if (location != null){
            location = location.trim();
            if (location.isEmpty()){
                req.setLocation(null);
            } else {
                req.setLocation(location);
            }
        }
        // 设置分页的起始项数
        int offset = (req.getPageNo()-1)* req.getPageSize();
        // 获取全部数据量
        long total = hospitalRoomMapper.countPage(req);
        // 判断数据是否为空
        if (total == 0)
            return PageResult.of(new ArrayList<>(), 0L);
        // 获得当前分页的数据列表
        List<HospitalRoomVO> list = hospitalRoomMapper.getRoomPage(req,offset,req.getPageSize());
        list.forEach(vo ->{
            vo.setBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),null));
            vo.setFreeBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(), 0));
            vo.setOccupiedBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),1));
            vo.setRepairBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),2));
        });
        return PageResult.of(list, total);
    }

    @Override
    public List<HospitalRoomVO> getRoomList() {
        List<HospitalRoomDO> roomList = hospitalRoomMapper.getRoomList();
        List<HospitalRoomVO> roomVOList = ConvertUtils.CovertList(roomList, HospitalRoomVO.class);
        roomVOList.forEach(vo ->{
            vo.setBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),null));
            vo.setFreeBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(), 0));
            vo.setOccupiedBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),1));
            vo.setRepairBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),2));
        });
        return roomVOList;
    }

    @Override
    public HospitalRoomVO getById(Long roomId) {
        HospitalRoomVO vo = hospitalRoomMapper.getById(roomId);
        vo.setBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),null));
        vo.setFreeBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(), 0));
        vo.setOccupiedBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),1));
        vo.setRepairBedCount(hospitalBedMapper.countBedByRoom(vo.getRoomId(),2));
        return vo;
    }

    @Override
    public HospitalRoomDetailVO getDetailById(Long roomId) {
        HospitalRoomVO hospitalRoomVO = getById(roomId);
        List<HospitalBedVO> list = hospitalBedService.findList(roomId,null);
        HospitalRoomDetailVO hospitalRoomDetailVO = new HospitalRoomDetailVO();
        hospitalRoomDetailVO.setRoom(hospitalRoomVO);
        hospitalRoomDetailVO.setBeds(list);
        return hospitalRoomDetailVO;
    }

    @Override
    public int createRoom(HospitalRoomVO hospitalRoomVO) {
        return hospitalRoomMapper.createRoom(hospitalRoomVO);
    }

    @Override
    public int updateRoom(HospitalRoomVO hospitalRoomVO) {
        return hospitalRoomMapper.updateRoom(hospitalRoomVO);
    }

    @Override
    public int deleteRoom(Long roomId) {
        // 判断病房是否存在
        final HospitalRoomVO hospitalRoomVO = hospitalRoomMapper.getById(roomId);
        if (hospitalRoomVO == null)
            return 0;
        // 判断病房中是否还有占用中的床位
        if (hospitalBedMapper.countBedByRoom(roomId, 1) > 0)
            return 0;
        List<HospitalBedVO> list = hospitalBedService.findList(roomId,null);
        list.forEach(vo ->{
            hospitalBedMapper.delete(vo.getBedId());
        });
        return hospitalRoomMapper.deleteRoom(roomId);
    }

    @Override
    public int updateRoomStatus(Long roomId, Integer status) {
        HospitalRoomVO hospitalRoomVO = hospitalRoomMapper.getById(roomId);
        if (hospitalRoomVO == null)
            return 0;
        hospitalRoomVO.setStatus(status);
        return hospitalRoomMapper.updateRoom(hospitalRoomVO);
    }


}
