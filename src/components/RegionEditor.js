import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Image, Circle, Group } from 'react-konva';
import { useLocation } from 'react-router-dom';
import { loadConfig, saveConfig } from '../utils/configLoader';

function RegionEditor() {
  const location = useLocation();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [regions, setRegions] = useState([]);
  const [currentRegion, setCurrentRegion] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const stageRef = useRef(null);

  const [config, setConfig] = useState(null);

  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (location.state?.frameDataURL) {
      const image = new window.Image();
      image.src = location.state.frameDataURL;
      image.onload = () => {
        setBackgroundImage(image);
      };
    }
  }, [location.state]);

  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        const configData = await loadConfig();
        console.log('Loaded config:', configData);
        
        if (configData?.zones) {
          const loadedRegions = Object.entries(configData.zones).map(([id, zone]) => ({
            id,
            points: zone.points.reduce((acc, point) => [...acc, ...point], []),
            isDragging: false,
            enabled: zone.enabled,
            padding: zone.padding
          }));
          console.log('Loaded regions:', loadedRegions);
          setRegions(loadedRegions);
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };
    
    loadInitialConfig();
  }, []);

  const handleMouseDown = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    // 檢查是否靠近起始點
    if (currentRegion.length >= 6) { // 至少有3個點
      const startX = currentRegion[0];
      const startY = currentRegion[1];
      const distance = Math.sqrt(
        Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2)
      );
      
      if (distance < 20) { // 距離閾值，可調整
        finishRegion();
        return;
      }
    }
    
    setCurrentRegion([...currentRegion, pos.x, pos.y]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    stage.container().style.cursor = 'crosshair';

    // 顯示與起始點的連線預覽
    if (currentRegion.length >= 6) {
      const pos = stage.getPointerPosition();
      const startX = currentRegion[0];
      const startY = currentRegion[1];
      const distance = Math.sqrt(
        Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2)
      );
      
      if (distance < 20) {
        stage.container().style.cursor = 'pointer';
      }
    }
  };

  const finishRegion = () => {
    if (currentRegion.length >= 6) {
      const newRegion = {
        id: `zone_${regions.length + 1}`,
        points: [...currentRegion],
        isDragging: false,
        enabled: true,
        padding: 1000
      };
      setRegions([...regions, newRegion]);
      setCurrentRegion([]);
      setIsDrawing(false);
    }
  };

  const handleDragStart = (e) => {
    const id = e.target.id();
    setSelectedRegion(id);
    const items = regions.slice();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.isDragging = true;
      setRegions(items);
    }
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const items = regions.slice();
    const item = items.find((i) => i.id === id);
    if (item) {
      const newPoints = e.target.points();
      item.points = newPoints;
      item.isDragging = false;
      setRegions(items);
    }
    setSelectedRegion(null);
  };

  const saveRegions = async () => {
    setSaveStatus('saving');
    const zonesConfig = regions.reduce((acc, region) => {
      const points = [];
      for (let i = 0; i < region.points.length; i += 2) {
        points.push([region.points[i], region.points[i + 1]]);
      }
      
      acc[region.id] = {
        points,
        padding: region.padding,
        enabled: region.enabled
      };
      return acc;
    }, {});

    const newConfig = { zones: zonesConfig };
    const success = await saveConfig(newConfig);
    
    setSaveStatus(success ? 'saved' : 'error');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setIsDrawing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={isDrawing}
          >
            開始繪製區域
          </button>
          <button
            onClick={saveRegions}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            保存配置
          </button>
          {saveStatus && (
            <span className={`ml-2 ${
              saveStatus === 'saved' ? 'text-green-600' : 'text-red-600'
            }`}>
              {saveStatus === 'saving' ? '保存中...' :
               saveStatus === 'saved' ? '保存成功' : '保存失敗'}
            </span>
          )}
        </div>
      </div>

      <Stage
        ref={stageRef}
        width={1280}
        height={720}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{ background: backgroundImage ? 'transparent' : '#f0f0f0' }}
      >
        <Layer>
          {backgroundImage && (
            <Image
              image={backgroundImage}
              width={1280}
              height={720}
              opacity={0.7}
            />
          )}
          {regions.map((region, i) => (
            <Group
              key={i}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <Line
                points={region.points}
                closed={true}
                fill="rgba(0, 0, 255, 0.2)"
                stroke="blue"
                strokeWidth={2}
                opacity={region.isDragging ? 0.5 : 1}
              />
              {region.points.map((point, index) => {
                if (index % 2 === 0) {
                  return (
                    <Circle
                      key={index}
                      x={point}
                      y={region.points[index + 1]}
                      radius={4}
                      fill="white"
                      stroke="blue"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              })}
            </Group>
          ))}
          {currentRegion.length > 0 && (
            <Line
              points={currentRegion}
              stroke="red"
              strokeWidth={2}
              closed={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default RegionEditor;