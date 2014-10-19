--用户表
CREATE TABLE IF NOT EXISTS users
(

  id          INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  username    VARCHAR(50), --用户名字
  password    VARCHAR(50), --用户密码
  usercode     VARCHAR(50), --员工工号
  --issuper     INTEGER DEFAULT(0), --super user
  displayname VACHAR(50), --显示名称
  deptids      VACHAR(50), --dept id
--divisionid  INTEGER, --行政区划id
  time        DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --注册时间
  roleid      INTEGER                                           --角色id

);


--行政区划表
CREATE  TABLE IF NOT EXISTS divisions
  (

  id INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  parentid INTEGER, --父节点
  divisionname VARCHAR(50), --角色名称
  signaturepath VARCHAR(250), --签章路径
  divisionpath VARCHAR(50)                         --行政区划路径

  );


--角色表
CREATE TABLE IF NOT EXISTS roles
(

  id       INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  rolename VARCHAR(50)                   --角色名称


);


--功能表
CREATE TABLE IF NOT EXISTS functions
(

  id       INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  pid       int ,                             --  父节点
  funcname VARCHAR(50),                   --  功能名称
  label  VARCHAR(500),                     --  功能标识
  imgcss  VARCHAR(250),                   --  图片标识
  sortnum int                        --  排序号


);

--角色功能关联表
CREATE TABLE IF NOT EXISTS functorole
(

  id     INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  funcid INTEGER, --功能id
  roleid INTEGER                    --角色id

);

----------------------业务功能表设计----------------------------------------------------
--枚举类型表
CREATE VIRTUAL TABLE IF NOT EXISTS enumerate USING fts3
  (
  id INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  enumeratetype VARCHAR(50), --枚举类型
  enumeratevalue VARCHAR(50), --枚举值
  enumeratelabel VARCHAR(50)             --枚举标识

  );

-- 日志表
CREATE TABLE IF NOT EXISTS systemlog
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --注册时间 --  提交时间
  userid     INT, --  用户id
  logcontent VARCHAR(500), --  附件名称
  logtype    VARCHAR(50)        --   日志类型

);

-- 检查科室
CREATE TABLE IF NOT EXISTS checkdept
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  提交时间
  depttype     INT, --
  deptname VARCHAR(100), --  科室名称
  pycode  VARCHAR(100)   --拼音代码


);
-- 检查项目
CREATE TABLE IF NOT EXISTS checkitem
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  提交时间
  deptid     INTEGER, -- 科室代码
  itemname VARCHAR(100), --  项目名称
  price VARCHAR(100), --  价格
  sortnum int,        --排序号
  pycode  VARCHAR(100)   --拼音代码

);


-- 检查项目明细
CREATE TABLE IF NOT EXISTS checkItemDetail
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  itemid     INTEGER, -- 项目代码
  itemdetailname VARCHAR(100), --  明细名称
  unit VARCHAR(100), --  单位
  downlimit VARCHAR(100), --  参考下限
  uplimit		 VARCHAR(100), --  参考上限
  std_mess		 VARCHAR(100), --  正常提示
  down_mess    VARCHAR(100), --  偏低提示
  up_mess    VARCHAR(100), --  偏高提示
  sortnum int,        --排序号
  pycode  VARCHAR(100)   --拼音代码

);

--体检单位
CREATE TABLE IF NOT EXISTS examinationUnit
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME    DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  unitcode     VARCHAR(100), -- 代码
  unitname    VARCHAR(100), --  名称
  manager     VARCHAR(100), --  负责人
  contacter   VARCHAR(100), --  联系人
  telephone		 VARCHAR(100), --  联系电话
  email		    VARCHAR(100), --  联系email
  address     VARCHAR(100), --  联系地址
  postcode    VARCHAR(100), --  邮政编码
  bank        VARCHAR(100), --  业务银行
  bank_no     VARCHAR(100), --  银行帐号
  remark      VARCHAR(100), --  备注
  sortnum     int,        --排序号
  useflag     VARCHAR(100)  --是否有效

);


--体检会员单位员工
CREATE TABLE IF NOT EXISTS examinationMember
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME    DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  unitid     integer,
  membername    VARCHAR(100), --  员工姓名
  marry     VARCHAR(100), --  婚姻状况
  cardnum     VARCHAR(100), -- 卡号
  sex   VARCHAR(100), --  性别
  birthday		 datetime, --  出生日期
  duty		    VARCHAR(100), --  职务
  address     VARCHAR(100), --  联系地址
  telephone		 VARCHAR(100), --  联系电话
  ischeck      VARCHAR(100), --是否体检
  title     VARCHAR(100) --  职称

);

--体检套餐
CREATE TABLE IF NOT EXISTS examinationPackage
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME    DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  packagename    VARCHAR(100), --  套餐名称
  pycode     VARCHAR(100), --  拼音代码
  sortnum     int, -- 顺序号
  type   VARCHAR(100), --  适用范围 0: 通用 1: 团体，2: 个人
  useflag		 VARCHAR(100) --  是否有效

);
--套餐与明细对应
CREATE TABLE IF NOT EXISTS packageWithItem
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME    DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  packageid     integer   --  套餐代码
  proportion    DECIMAL(9,2), --  套餐名称
  itemcode     integer --  项目代码

);

--单位分组
CREATE TABLE IF NOT EXISTS unitWithGroup
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME    DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  unitid     integer,   --  单位代码
  groupname     varchar(20),    --  分组名称
  marry     varchar(20) , --  未婚,已婚，no limit
  sex     varchar(20) , --  男，女，no limit
  downage     int , --  男，女，no limit
  upage     int , --
  duty     varchar(20) , -- 职务  高层，中层，普通，no limit
  title     varchar(20)  -- 职称  高层，中层，普通高级，中级，初级，no limit

);

--单位分组与细目对照
CREATE TABLE IF NOT EXISTS unitWithGroupAndItem
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME    DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  unitid     integer,   --  单位代码
  groupid     integer,    --  组编码
  packageid   integer , --  套餐代码
  itemcode     integer --  细目代码
);

--科室常见描述维护
CREATE TABLE IF NOT EXISTS deptCustomDescript
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT, --自增主键
  DATETIME    DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')), --  时间
  deptid     integer,   --  科室代码
  status     varchar(20) ,    --  使用状态
  pycode    varchar(20) , --  拼音代码
  content    varchar(100) , --  建议内容
  name     varchar(20), --  诊断名称
  sortnum     int       --  排序号
);



--init

insert into functions (pid,funcname,label)values(-1,"绍兴市人民医院体检系统","绍兴市人民医院体检系统");
insert into functions (pid,funcname,label)values(1,"系统菜单","系统菜单");
insert into functions (pid,funcname,label)values(2,"权限设置","权限设置");
insert into functions (pid,funcname,label)values(3,"用户管理","usermanagerpanel");
insert into functions (pid,funcname,label)values(3,"功能管理","funcmanagerpanel");
insert into functions (pid,funcname,label)values(3,"角色管理","rolemanagerpanel");
insert into roles(rolename)values('系统管理员');
insert into functorole(funcid,roleid)values(-1,1);
insert into functorole(funcid,roleid)values(1,1);
insert into functorole(funcid,roleid)values(2,1);
insert into functorole(funcid,roleid)values(3,1);
insert into functorole(funcid,roleid)values(4,1);
insert into functorole(funcid,roleid)values(5,1);
insert into functorole(funcid,roleid)values(6,1);
update users set roleid =1;


--ALTER TABLE 'users' ADD 'usercode' nvarchar(100) ;


