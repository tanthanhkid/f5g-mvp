'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Investor {
  id: number;
  name: string;
  logo: string;
  dailyContribution: number;
  percentage: number;
  tier: string;
  color: string;
}

interface InvestorThreeDProps {
  investors: Investor[];
  formatCurrency: (amount: number) => string;
}

// Component cho từng khối Nhà Tài Trợ
function InvestorBox({ 
  investor, 
  position, 
  size, 
  formatCurrency 
}: { 
  investor: Investor; 
  position: [number, number, number]; 
  size: [number, number, number];
  formatCurrency: (amount: number) => string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  // Màu sắc theo tier
  const getColor = () => {
    switch (investor.tier) {
      case 'platinum': return '#8b5cf6'; // Purple
      case 'gold': return '#f59e0b'; // Yellow
      case 'silver': return '#3b82f6'; // Blue
      case 'bronze': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <group position={position}>
      {/* Khối chính */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={getColor()} 
          transparent 
          opacity={hovered ? 0.9 : 0.8}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Text hiển thị tên công ty */}
      <Text
        position={[0, size[1] / 2 + 0.5, 0]}
        fontSize={Math.max(size[0] * 0.15, 0.3)}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {investor.name}
      </Text>

      {/* Text hiển thị tỉ lệ */}
      <Text
        position={[0, -size[1] / 2 - 0.3, 0]}
        fontSize={Math.max(size[0] * 0.12, 0.25)}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {investor.percentage}%
      </Text>

      {/* Tooltip khi hover */}
      {hovered && (
        <Html position={[0, size[1] / 2 + 1.5, 0]} center>
          <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700 min-w-[200px]">
            <div className="font-bold text-lg mb-1">{investor.name}</div>
            <div className="text-sm text-gray-300 mb-1">
              Tier: <span className="capitalize text-yellow-400">{investor.tier}</span>
            </div>
            <div className="text-sm text-gray-300 mb-1">
              Đóng góp: <span className="text-green-400">{formatCurrency(investor.dailyContribution)}/ngày</span>
            </div>
            <div className="text-sm text-gray-300">
              Tỉ lệ: <span className="text-blue-400">{investor.percentage}% tổng pool</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Component scene chính
function InvestorScene({ investors, formatCurrency }: { investors: Investor[]; formatCurrency: (amount: number) => string }) {
  const { camera } = useThree();

  // Tính toán vị trí và kích thước cho từng khối
  const investorBoxes = useMemo(() => {
    const sortedInvestors = [...investors].sort((a, b) => b.percentage - a.percentage);
    const boxes: Array<{
      investor: Investor;
      position: [number, number, number];
      size: [number, number, number];
    }> = [];

    let currentX = 0;
    let currentZ = 0;
    let rowHeight = 0;
    const spacing = 1;
    const maxRowWidth = 15;

    sortedInvestors.forEach((investor, index) => {
      // Tính kích thước dựa trên tỉ lệ đóng góp
      const baseSize = Math.sqrt(investor.percentage) * 0.8;
      const width = Math.max(baseSize, 1);
      const height = Math.max(baseSize * 1.2, 1.5);
      const depth = Math.max(baseSize, 1);

      // Kiểm tra nếu cần xuống hàng mới
      if (currentX + width > maxRowWidth && currentX > 0) {
        currentX = 0;
        currentZ += rowHeight + spacing;
        rowHeight = 0;
      }

      boxes.push({
        investor,
        position: [currentX + width / 2, height / 2, currentZ + depth / 2],
        size: [width, height, depth],
      });

      currentX += width + spacing;
      rowHeight = Math.max(rowHeight, depth);
    });

    return boxes;
  }, [investors]);

  // Đặt camera ở vị trí tốt
  React.useEffect(() => {
    camera.position.set(10, 8, 12);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Ánh sáng */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Sàn */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1f2937" transparent opacity={0.8} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[30, 30, '#374151', '#374151']} position={[0, 0, 0]} />

      {/* Các khối Nhà Tài Trợ */}
      {investorBoxes.map((box) => (
        <InvestorBox
          key={box.investor.id}
          investor={box.investor}
          position={box.position}
          size={box.size}
          formatCurrency={formatCurrency}
        />
      ))}

      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Component chính
const InvestorThreeD: React.FC<InvestorThreeDProps> = ({ investors, formatCurrency }) => {
  return (
    <div className="w-full bg-gray-900 rounded-2xl p-6 overflow-hidden">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          🎯 Bản Đồ 3D Nhà Tài Trợ
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Kích thước khối 3D tương ứng với tỉ lệ đóng góp. Kéo để xoay, cuộn để zoom.
        </p>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-300 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span>Platinum (25%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>Gold (15-20%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Silver (10%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Bronze (2-5%)</span>
          </div>
        </div>
      </div>

      {/* Canvas 3D */}
      <div className="w-full h-[600px] bg-gray-800 rounded-xl overflow-hidden">
        <Canvas
          camera={{ position: [10, 8, 12], fov: 60 }}
          style={{ background: 'linear-gradient(to bottom, #1f2937, #111827)' }}
        >
          <InvestorScene investors={investors} formatCurrency={formatCurrency} />
        </Canvas>
      </div>

      {/* Hướng dẫn */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        💡 Mẹo: Kéo chuột để xoay, cuộn để zoom, hover vào khối để xem chi tiết
      </div>
    </div>
  );
};

export default InvestorThreeD; 