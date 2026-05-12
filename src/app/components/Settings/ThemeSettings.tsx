import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Grid,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Close,
  Palette,
  Upload,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'motion/react';
import { presetColors, extractColorFromImage } from '../../utils/themeGenerator';
import { toast } from 'sonner';

interface ThemeSettingsProps {
  open: boolean;
  onClose: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

export default function ThemeSettings({
  open,
  onClose,
  currentColor,
  onColorChange,
  isDarkMode,
  onDarkModeChange,
}: ThemeSettingsProps) {
  const [customColor, setCustomColor] = useState(currentColor);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    onColorChange(color);
    toast.success('主题色已更新');
  };

  const handleCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setCustomColor(color);
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      onColorChange(color);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      const extractedColor = await extractColorFromImage(imageUrl);
      URL.revokeObjectURL(imageUrl);

      setCustomColor(extractedColor);
      onColorChange(extractedColor);
      toast.success('成功从图片提取主题色！');
    } catch (error) {
      toast.error('提取颜色失败，请重试');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleReset = () => {
    const defaultColor = '#6750A4';
    setCustomColor(defaultColor);
    onColorChange(defaultColor);
    onDarkModeChange(false);
    toast.success('主题已重置为默认');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Palette color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            主题设置
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          外观模式
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={(e) => {
                onDarkModeChange(e.target.checked);
                toast.success(e.target.checked ? '已切换到深色模式' : '已切换到浅色模式');
              }}
              color="primary"
            />
          }
          label={isDarkMode ? '深色模式' : '浅色模式'}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          预设主题色
        </Typography>
        <Grid container spacing={2}>
          {presetColors.map((preset) => (
            <Grid size={{ xs: 6 }} key={preset.color}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Paper
                  onClick={() => handleColorSelect(preset.color)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: currentColor === preset.color ? 2 : 0,
                    borderColor: 'primary.main',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 40,
                      backgroundColor: preset.color,
                      borderRadius: 2,
                      mb: 1,
                    }}
                  />
                  <Typography variant="caption" align="center" display="block">
                    {preset.name}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          自定义颜色
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="颜色代码"
            value={customColor}
            onChange={handleCustomColorChange}
            placeholder="#6750A4"
            helperText="输入6位HEX颜色代码"
          />
          <Box
            sx={{
              width: 56,
              height: 56,
              backgroundColor: customColor,
              borderRadius: 2,
              border: 2,
              borderColor: 'divider',
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          从图片提取颜色
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          上传图片，系统将自动提取主色调作为主题色
        </Typography>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="image-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            fullWidth
            startIcon={isExtracting ? <Refresh className="animate-spin" /> : <Upload />}
            disabled={isExtracting}
          >
            {isExtracting ? '提取中...' : '上传图片'}
          </Button>
        </label>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Button
        variant="outlined"
        fullWidth
        startIcon={<Refresh />}
        onClick={handleReset}
      >
        重置为默认主题
      </Button>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="caption" color="text.secondary">
          💡 提示：Material Design 3 会根据您选择的主题色自动生成完整的配色方案，包括容器色、表面色等。
        </Typography>
      </Box>
    </Drawer>
  );
}
