'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button, List, message, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { selectBed } from '@/api/Student';

const { Title } = Typography;

interface BedInfo {
  id: string;
  roomId: string;
  bedNo: number;
  status: number;
}

export default function SelectBedPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bedsByRoom, setBedsByRoom] = useState<Record<string, BedInfo[]>>({});
  const [buildingMap, setBuildingMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [hasBed, setHasBed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [roomRes, buildings] = await Promise.all([
          request.get<any>('/room/page', { params: { current: 1, size: 100 } }),
          request.get<any[]>('/building/list'),
        ]);

        const bmap: Record<string, string> = {};
        buildings.forEach((b: any) => { bmap[b.id] = b.buildingName; });
        setBuildingMap(bmap);

        const roomRecords = roomRes.records || roomRes;
        const bedMap: Record<string, BedInfo[]> = {};

        for (const room of roomRecords) {
          try {
            const beds = await request.get<BedInfo[]>(`/room/${room.id}/beds`);
            const freeBeds = beds.filter((b) => b.status === 0);
            if (freeBeds.length > 0) {
              bedMap[room.id] = freeBeds;
            }
          } catch { /* skip */ }
        }

        setBedsByRoom(bedMap);
        setRooms(roomRecords);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelect = async (bedId: string) => {
    setSelecting(bedId);
    try {
      await selectBed(bedId);
      message.success('选床成功！');
      setHasBed(true);
      setBedsByRoom((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = next[key].filter((b) => b.id !== bedId);
          if (next[key].length === 0) delete next[key];
        }
        return next;
      });
    } catch {
      /* 错误已在拦截器提示 */
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  if (hasBed) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={3} type="success">选床成功！</Title>
      </div>
    );
  }

  const availableRooms = rooms.filter((r: any) => bedsByRoom[r.id]?.length > 0);

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>自选床位</Title>
      {availableRooms.length === 0 ? (
        <Card><Typography.Text type="secondary">暂无可选床位</Typography.Text></Card>
      ) : (
        availableRooms.map((room: any) => (
          <Card
            key={room.id}
            title={`${buildingMap[room.buildingId] || room.buildingId} - ${room.roomNo}（${room.roomType || '普通间'}）`}
            style={{ marginBottom: 16 }}
          >
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={bedsByRoom[room.id] || []}
              renderItem={(bed: BedInfo) => (
                <List.Item>
                  <Button
                    type="primary"
                    icon={<HomeOutlined />}
                    loading={selecting === bed.id}
                    onClick={() => handleSelect(bed.id)}
                    block
                  >
                    {bed.bedNo} 号床
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        ))
      )}
    </div>
  );
}
