/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2026/11/18 10:54:04                          */
/*==============================================================*/

drop table if exists hospital_bed;
drop table if exists hospital_doctor;
drop table if exists hospital_patient;
drop table if exists hospital_record_inh;
drop table if exists hospital_record_treat;
drop table if exists hospital_room;

/*==============================================================*/
/* Table: hospital_bed                                          */
/*==============================================================*/
create table hospital_bed
(
   bed_id               BIGINT not null,
   room_id              BIGINT not null,
   bed_no               INT not null,
   bed_status           INT not null,
   primary key (bed_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*==============================================================*/
/* Table: hospital_doctor                                       */
/*==============================================================*/
create table hospital_doctor
(
   doc_id               BIGINT not null,
   doc_name             varchar(20) not null,
   gender               INT not null,
   title                varchar(50) not null,
   phone                varchar(11) not null,
   dept                 varchar(50) not null,
   primary key (doc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*==============================================================*/
/* Table: hospital_patient                                      */
/*==============================================================*/
create table hospital_patient
(
   patient_id           BIGINT not null,
   room_id              BIGINT,
   patient_name         varchar(20) not null,
   gender               INT not null,
   address              varchar(100),
   phone                varchar(11) not null,
   primary key (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*==============================================================*/
/* Table: hospital_record_inh                                   */
/*==============================================================*/
create table hospital_record_inh
(
   inh_id               BIGINT not null,
   room_id              BIGINT not null,
   bed_id               BIGINT not null,
   patient_id           BIGINT not null,
   record_date          datetime not null,
   in_time              datetime not null,
   out_time             datetime,
   primary key (inh_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*==============================================================*/
/* Table: hospital_record_treat                                 */
/*==============================================================*/
create table hospital_record_treat
(
   treat_id             BIGINT not null,
   patient_id           BIGINT not null,
   doc_id               BIGINT not null,
   treat_time           datetime not null,
   diagnosis            text not null,
   plan                 text not null,
   primary key (treat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*==============================================================*/
/* Table: hospital_room                                         */
/*==============================================================*/
create table hospital_room
(
   room_id              BIGINT not null,
   location             varchar(50) not null,
   fee                  DECIMAL(10,2) not null,
   dept                 varchar(50) not null,
   primary key (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

alter table hospital_bed add constraint FK_have foreign key (room_id)
      references hospital_room (room_id) on delete restrict on update restrict;

alter table hospital_patient add constraint FK_live foreign key (room_id)
      references hospital_room (room_id) on delete restrict on update restrict;

alter table hospital_record_inh add constraint FK_bed foreign key (bed_id)
      references hospital_bed (bed_id) on delete restrict on update restrict;

alter table hospital_record_inh add constraint FK_get_in foreign key (patient_id)
      references hospital_patient (patient_id) on delete restrict on update restrict;

alter table hospital_record_inh add constraint FK_room foreign key (room_id)
      references hospital_room (room_id) on delete restrict on update restrict;

alter table hospital_record_treat add constraint FK_judge foreign key (patient_id)
      references hospital_patient (patient_id) on delete restrict on update restrict;

alter table hospital_record_treat add constraint FK_treat foreign key (doc_id)
      references hospital_doctor (doc_id) on delete restrict on update restrict;
