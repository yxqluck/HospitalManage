package com.projects.manage.mapper;

import com.projects.manage.DO.HospitalRoomDO;
import com.projects.manage.DTO.HospitalRoomPageReq;
import com.projects.manage.controller.HospitalRoom.VO.HospitalRoomVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface HospitalRoomMapper {

    // 获取分页数据
    List<HospitalRoomVO> getRoomPage(@Param("req") HospitalRoomPageReq req, @Param("offset") Integer offset, @Param("pageSize") Integer pageSize);

    // 获取满足分页的数据总数
    Long countPage(@Param("req") HospitalRoomPageReq req);

    @Select("select * from hospital_room where deleted = 0")
    List<HospitalRoomDO> getRoomList();

    @Select("select * from hospital_room where room_id = #{roomId} and deleted = 0")
    HospitalRoomVO getById(@Param("roomId") Long roomId);

    // 新增room信息
    @Insert("insert into hospital_room (room_id, location, fee, dept, status) VALUES (#{roomId},#{location},#{fee},#{dept},#{status})")
    int createRoom(HospitalRoomVO hospitalRoomVO);

    // 修改room信息
    @Update("update hospital_room set location = #{location}, fee = #{fee}, dept = #{dept}, status = #{status} where room_id = #{roomId} and deleted = 0")
    int updateRoom(HospitalRoomVO hospitalRoomVO);

    // 删除room信息
    @Update("update hospital_room set deleted = 1 where room_id = #{roomId} and deleted = 0")
    int deleteRoom(@Param("roomId") Long roomId);
}
