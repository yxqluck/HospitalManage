package com.projects.manage.mapper;

import com.projects.manage.DO.HospitalBedDO;
import com.projects.manage.DTO.HospitalBedPageReq;
import com.projects.manage.controller.HospitalBed.VO.HospitalBedVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface HospitalBedMapper {
    @Select("select * from hospital_bed")
    List<HospitalBedDO> findAll();

    @Select("select * from hospital_bed where bed_id = #{id}")
    List<HospitalBedDO> findAllById(@Param("id") Long id);

    @Insert("insert into hospital_bed (bed_id, room_id, bed_no, bed_status) VALUES (#{bedId},#{roomId},#{bedNo},#{bedStatus})")
    void insert(HospitalBedDO hospitalBedDO);

//    @Select("select * from hospital_bed join hospital_db.hospital_room hr on hospital_bed.room_id = hr.room_id")
    List<HospitalBedVO> findPage(@Param("req") HospitalBedPageReq req ,@Param("offset") int offset ,@Param("pageSize") int pageSize);

    long countPage(@Param("req") HospitalBedPageReq req);
}
