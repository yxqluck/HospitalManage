package com.projects.manage.mapper;

import com.projects.manage.DO.HospitalBedDO;
import com.projects.manage.DTO.HospitalBedPageReq;
import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface HospitalBedMapper {
    @Select("select * from hospital_bed")
    List<HospitalBedDO> findAll();

    // 使用bedId查找
    @Select("select bed_id, room_id, bed_no, bed_status from hospital_bed where bed_id = #{id} and deleted = 0")
    HospitalBedVO getBedById(@Param("id") Long id);

    // 新增bed信息
    @Insert("insert into hospital_bed (room_id, bed_no, bed_status) VALUES (#{roomId},#{bedNo},#{bedStatus})")
    int create(HospitalBedVO hospitalBedVO);

    // 获得分页
    List<HospitalBedVO> findPage(@Param("req") HospitalBedPageReq req ,@Param("offset") int offset ,@Param("pageSize") int pageSize);

    // 获得当前条件所有数据总数
    long countPage(@Param("req") HospitalBedPageReq req);

    // 获得满足条件的床位号
    List<HospitalBedVO> findList(@Param("roomId") Long roomId, @Param("bedStatus")Integer bedStatus);

    @Update("update hospital_bed set room_id = #{roomId}, bed_no = #{bedNo}, bed_status = #{bedStatus} where bed_id = #{bedId} and deleted = 0")
    int update(HospitalBedVO hospitalBedVO);

    @Update("update hospital_bed set deleted = 1 where bed_id = #{bedId} and deleted = 0")
    int delete(@Param("bedId") Long bedId);

    // 获得同一间病房中的对应状态的床位数量
    int countBedByRoom(@Param("roomId") Long roomId, @Param("bedStatus") Integer bedStatus);
}
