import yaml from 'js-yaml';
import axios from 'axios';

export const loadConfig = async () => {
  try {
    // 修改為正確的配置文件路徑
    const response = await axios.get('/src/config.yaml');
    return yaml.load(response.data);
  } catch (error) {
    console.error('Error loading config:', error);
    // 如果讀取失敗，返回預設配置
    return {
      regions: {
        main_area: {
          points: [
            [800, 50],
            [1000, 50],
            [1000, 700],
            [800, 700]
          ],
          padding: 1000,
          enabled: true
        }
      }
    };
  }
};

export const saveConfig = async (config) => {
  try {
    const yamlString = yaml.dump(config);
    // 確保後端 API 端點正確
    const response = await axios.post('/api/save-config', { config: yamlString });
    return response.data.success;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}; 