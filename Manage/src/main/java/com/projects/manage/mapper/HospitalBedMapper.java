package com.projects.manage.mapper;

import com.projects.manage.DO.HospitalBedDO;
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

    @Select("insert into hospital_bed (bed_id, room_id, bed_no, bed_status) VALUES (#{bedId},#{roomId},#{bedNo},#{bedStatus})")
    void insert(HospitalBedDO hospitalBedDO);
}
