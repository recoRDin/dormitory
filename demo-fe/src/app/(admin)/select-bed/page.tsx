'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, Typography, Button, List, message, Spin, Space, Tag, Breadcrumb } from 'antd';
import { HomeOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { selectBed } from '@/api/Student';
import { useAuthStore } from '@/store/useAuthStore';

const { Title, Text } = Typography;

interface BedInfo {
  id: string;
  roomId: string;
  bedNo: number;
  status: number;
}

interface RoomInfo {
  id: string;
  buildingId: string;
  floor: number;
  roomNo: string;
  roomType: string;
  capacity: number;
  currentCount: number;
}

type ViewLevel = 'buildings' | 'floors' | 'rooms';

export default function SelectBedPage() {
  const roleCode = useAuthStore((s) => s.roleCode);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(false);
  const [hasBed, setHasBed] = useState(false);

  // 基础数据
  const [buildings, setBuildings] = useState<any[]>([]);
  const [allRooms, setAllRooms] = useState<RoomInfo[]>([]);
  const [bedsByRoom, setBedsByRoom] = useState<Record<string, BedInfo[]>>({});

  // 导航状态
  const [viewLevel, setViewLevel] = useState<ViewLevel>('buildings');
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [bldgs, roomRes] = await Promise.all([
          request.get<any[]>('/building/list'),
          request.get<any>('/room/page', { params: { current: 1, size: 200 } }),
        ]);
        setBuildings(bldgs);
        setAllRooms(roomRes.records || roomRes);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 加载某个房间的床位
  const loadBeds = async (roomId: string) => {
    if (bedsByRoom[roomId]) return;
    try {
      const beds = await request.get<BedInfo[]>(`/room/${roomId}/beds`);
      setBedsByRoom((prev) => ({ ...prev, [roomId]: beds }));
    } catch { /* skip */ }
  };

  const handleSelect = async (bedId: string) => {
    setSelecting(bedId);
    try {
      await selectBed(bedId);
      message.success('选床成功！');
      setHasBed(true);
    } catch { /* 错误已在拦截器提示 */ }
    finally { setSelecting(null); }
  };

  // ---------- 各层级数据计算 ----------

  // 楼宇级别：统计每个楼宇的可选房间数
  const buildingStats = useMemo(() => {
    return buildings.map((b) => {
      const buildingRooms = allRooms.filter((r) => r.buildingId === b.id);
      return { ...b, roomCount: buildingRooms.length };
    });
  }, [buildings, allRooms]);

  // 楼层级别：按楼层分组
  const floorGroups = useMemo(() => {
    if (!selectedBuilding) return [];
    const buildingRooms = allRooms.filter((r) => r.buildingId === selectedBuilding.id);
    const floors = [...new Set(buildingRooms.map((r) => r.floor))].sort((a, b) => a - b);
    return floors.map((floor) => ({
      floor,
      roomCount: buildingRooms.filter((r) => r.floor === floor).length,
    }));
  }, [selectedBuilding, allRooms]);

  // 房间级别：选定楼层的房间列表
  const floorRooms = useMemo(() => {
    if (!selectedBuilding || selectedFloor === null) return [];
    return allRooms
      .filter((r) => r.buildingId === selectedBuilding.id && r.floor === selectedFloor)
      .sort((a, b) => a.roomNo.localeCompare(b.roomNo));
  }, [selectedBuilding, selectedFloor, allRooms]);

  // 进入某层时预加载所有房间的床位
  useEffect(() => {
    if (viewLevel === 'rooms') {
      floorRooms.forEach((r) => loadBeds(r.id));
    }
  }, [viewLevel, floorRooms]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  if (hasBed) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={3} type="success">选床成功！</Title>
        <Button style={{ marginTop: 16 }} onClick={() => { setHasBed(false); setViewLevel('buildings'); }}>
          继续选床
        </Button>
      </div>
    );
  }

  // ---------- 导航面包屑 ----------
  const breadcrumbItems = [
    {
      title: (
        <a onClick={() => { setViewLevel('buildings'); setSelectedBuilding(null); setSelectedFloor(null); }}>
          宿舍楼
        </a>
      ),
    },
  ];
  if (selectedBuilding) {
    breadcrumbItems.push({
      title: (
        <a onClick={() => { setViewLevel('floors'); setSelectedFloor(null); }}>
          {selectedBuilding.buildingName}
        </a>
      ),
    });
  }
  if (selectedFloor !== null) {
    breadcrumbItems.push({ title: <>{selectedFloor} 层</> });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          <Title level={4} style={{ margin: 0 }}>自选床位</Title>
          <Breadcrumb items={breadcrumbItems} />
        </Space>
        {(roleCode === 'admin' || roleCode === 'manager') && (
          <Button
            icon={<ReloadOutlined />}
            loading={initLoading}
            onClick={async () => {
              setInitLoading(true);
              try {
                await request.post('/bed/init-stock');
                message.success('库存初始化完成');
                setBedsByRoom({});
                window.location.reload();
              } catch { /* ignored */ }
              finally { setInitLoading(false); }
            }}
          >
            初始化库存
          </Button>
        )}
      </div>

      {/* ====== 第一层：宿舍楼列表 ====== */}
      {viewLevel === 'buildings' && (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={buildingStats}
          renderItem={(b: any) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => {
                  setSelectedBuilding(b);
                  setViewLevel('floors');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <HomeOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                    <span style={{ fontSize: 16, fontWeight: 500 }}>{b.buildingName}</span>
                  </Space>
                  <Space>
                    <Text type="secondary">{b.roomCount} 个房间</Text>
                    <RightOutlined />
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
          locale={{ emptyText: '暂无宿舍楼' }}
        />
      )}

      {/* ====== 第二层：楼层列表 ====== */}
      {viewLevel === 'floors' && (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={floorGroups}
          renderItem={({ floor, roomCount }) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => {
                  setSelectedFloor(floor);
                  setViewLevel('rooms');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Tag color="blue" style={{ fontSize: 14, padding: '2px 12px' }}>{floor} 层</Tag>
                  </Space>
                  <Space>
                    <Text type="secondary">{roomCount} 个房间</Text>
                    <RightOutlined />
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
          locale={{ emptyText: '该楼宇暂无房间' }}
        />
      )}

      {/* ====== 第三层：房间+床位 ====== */}
      {viewLevel === 'rooms' && (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={floorRooms}
          renderItem={(room: RoomInfo) => {
            const allBeds = bedsByRoom[room.id] || [];
            return (
              <List.Item>
                <Card
                  size="small"
                  title={
                    <Space>
                      <span>{room.roomNo}</span>
                      <Tag>{room.roomType || '普通间'}</Tag>
                      <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>
                        已住 {room.currentCount}/{room.capacity}
                      </Text>
                    </Space>
                  }
                >
                  {allBeds.length === 0 ? (
                    <Text type="secondary">加载中...</Text>
                  ) : (
                    <List
                      grid={{ gutter: 8, column: 4 }}
                      dataSource={allBeds}
                      renderItem={(bed: BedInfo) => {
                        const occupied = bed.status !== 0;
                        return (
                        <List.Item>
                          <Button
                            type={occupied ? 'default' : 'primary'}
                            size="small"
                            icon={<HomeOutlined />}
                            loading={selecting === bed.id}
                            disabled={occupied}
                            onClick={() => handleSelect(bed.id)}
                            block
                            style={occupied ? { color: '#999' } : undefined}
                          >
                            {bed.bedNo}号
                          </Button>
                        </List.Item>
                        );
                      }}
                    />
                  )}
                </Card>
              </List.Item>
            );
          }}
          locale={{ emptyText: '该楼层暂无房间' }}
        />
      )}
    </div>
  );
}
