'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import HealthLiveCard from '@/components/uptime/HealthLiveCard';
import ChatRoom from '@/components/uptime/ChatRoom';

export default function UptimeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const me = 'guest'; // 로그인 닉네임 있으면 여기에 바인딩

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <HealthLiveCard healthCheckId={id} />
      <ChatRoom roomId={`hc-${id}`} me={me} />
    </div>
  );
}
