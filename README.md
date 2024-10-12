
# 拔河比赛

前置准备：

* 前人工作：无
* 技术栈：react + ws
* 平台选择：
  * MemFire 数据库 免费一个实例 国内 基于supabase 支持基于ws的realtime
  * Cloudflare 页面托管 后面可上 cdn 全球业务拓展预备
  * github 代码仓库

## 逻辑

1. 玩家首先输入用户名
   1. 不存在则创建
2. 然后选择进行游戏/查看历史/旁观战局（需要房间id，未来功能）
3. 选择游戏后：
   1. 选择是开房还是加入
      1. 开房需要写人数（可选，默认两个）
   2. 选择左右
   3. 等待玩家加入
   4. 人齐后开赛
      1. 全局ws重连
      2. 假设多点击一边比另一边多点击10下获胜
   5. 比赛结果展示
   6. 回到 2


## 数据库

### user 表

* 存放用户信息
* `id` 主键 `int8`
* `username` `text` 唯一的（按目前需求来说这样做可以使用户可以用相同的用户名重新登录，反正不需要密码，正常的项目中应该使用auth功能而非数据库中建立user表）
* `create_at` 创建时间 `timestamptz`

```sql
create table
  public.user (
    id bigint generated by default as identity,
    username text not null,
    created_at timestamp with time zone not null default now(),
    constraint user_pkey primary key (id),
    constraint user_id_key unique (id),
    constraint user_username_key unique (username)
  ) tablespace pg_default;
```

### hist 表

* 存放用户的历史比赛数据
* `id` 主键 `int8`
* `uid` 外键（`user.id`）
* `is_winner` bool
* `click_count` 点击次数 int4
* `create_at` 创建时间 `timestamptz`

```sql
create table
  public.hist (
    id bigint generated by default as identity,
    uid bigint not null,
    is_winner boolean not null,
    click_count integer not null,
    created_at timestamp with time zone not null default now(),
    constraint hist_pkey primary key (id),
    constraint hist_id_key unique (id),
    constraint hist_uid_fkey foreign key (uid) references "user" (id) on delete cascade
  ) tablespace pg_default;
```

### room 表

* 房间信息，只有房间在比赛时存在，比赛后将删除（其实这里应该做一个房间池的概念，限制房间总数）
* `id` 主键 `int8`
* `room_size` 拔河总人数 `int2`
* `win_threshold` 赢的数量（一边比一边多这么多就算赢，一般是人数*10） `int4`
* `left_count` 左边的人点击总数 `int4` max(2^31 - 1)
* `right_count` 右边的人点击总数 `int4` max(2^31 - 1)
* `create_at` 创建时间 `timestamptz`

```sql
create table
  public.room (
    id bigint generated by default as identity,
    room_size smallint not null,
    win_threshold integer not null,
    left_count integer not null,
    right_count integer not null,
    created_at timestamp with time zone not null default now(),
    constraint room_pkey primary key (id),
    constraint room_id_key unique (id),
    constraint room_left_count_check check ((left_count < 1073741823)),
    constraint room_right_count_check check ((right_count < 1073741823))
  ) tablespace pg_default;
```

### room_user 表

* 存放房间内用户信息，例如是否是观战还是正在游玩、玩家当前的点击数，用户/房间删除后自动删除
* `uid` 主键 外键（`user.id`） delete cascade
* `rid` 外键（`room.id`） delete cascade
* `click_count` 点击次数 `int4`
* `is_left` 是左边队伍 `bool`
* `is_player` 是参赛选手 `bool`

```sql
create table
  public.room_user (
    id bigint not null,
    rid bigint null,
    click_count integer not null default 0,
    is_left boolean not null,
    is_player boolean not null default false,
    constraint room_user_pkey primary key (id),
    constraint room_user_id_key unique (id),
    constraint room_user_id_fkey foreign key (id) references "user" (id) on delete cascade,
    constraint room_user_rid_fkey foreign key (rid) references room (id) on delete cascade
  ) tablespace pg_default;
```
