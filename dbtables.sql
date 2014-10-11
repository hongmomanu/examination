--用户组
CREATE TABLE IF NOT EXISTS tbl_sys_group
(

  sys_id integer primary key autoincrement,   --自增主键
  sys_group VARCHAR(8)                       --角色名称

);

--用户组权限
CREATE TABLE IF NOT EXISTS tbl_sys_gright
(

  sys_id integer primary key autoincrement,   --自增主键
  sys_group VARCHAR(8),
  sys_menu   varchar(30)
);

--系统菜单
CREATE TABLE IF NOT EXISTS tbl_sys_menu
(

  sys_id integer primary key autoincrement,   --自增主键
  sys_menuid VARCHAR(3),
  sys_menu varchar (30),
  sys_menu_name varchar (30),
  sys_window varchar (30)  ,
  sys_function varchar(200)
);

--用户
CREATE TABLE IF NOT EXISTS tbl_sys_user
(

  sys_id integer primary key autoincrement,   --自增主键
  sys_user VARCHAR(8),
  sys_password varchar (8),
  sys_group varchar (20),
  em_code varchar (8)  ,
  em_name varchar(20)
);

--员工表
CREATE TABLE IF NOT EXISTS tbl_tj_emp
(

  em_code integer primary key autoincrement,   --自增主键
  em_name VARCHAR(20),
  py_code varchar (10),
  dis_order integer,
  useflag integer DEFAULT (1)
);
--员工权限设置
CREATE TABLE IF NOT EXISTS tbl_tj_emp_right
(

  id integer primary key autoincrement,   --自增主键
  em_code integer,
  dept_code integer
);






