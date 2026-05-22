import { useEffect, useState } from "react";
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
  InputAdornment,
  Popover,
} from "@mui/material";
import { Close, Palette, Upload, Refresh } from "@mui/icons-material";
import { motion } from "motion/react";
import {
  presetColors,
  extractColorFromImage,
} from "../../utils/themeGenerator";
import { toast } from "sonner";
import { HexColorPicker } from "react-colorful"; //调色盘

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
    toast.success("主题色已更新");
  };

  const handleCustomColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const color = event.target.value;
    setCustomColor(color);
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      onColorChange(color);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      const extractedColor = await extractColorFromImage(imageUrl);
      URL.revokeObjectURL(imageUrl);

      setCustomColor(extractedColor);
      onColorChange(extractedColor);
      toast.success("成功从图片提取主题色！");
    } catch (error) {
      toast.error("提取颜色失败，请重试");
    } finally {
      setIsExtracting(false);
    }
  };

  // Popover 锚点状态
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // 辅助函数：判断是否是合法的 6 位 HEX
  const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

  const handleReset = () => {
    const defaultColor = "#6750A4";
    setCustomColor(defaultColor);
    onColorChange(defaultColor);
    onDarkModeChange(false);
    toast.success("主题已重置为默认");
  };

  // 1. 新增一个局部控制变量：用于专门记录 Popover 内部拾色器的高频拖拽状态
  const [pickerColor, setPickerColor] = useState(currentColor);

  // 2. 当外部 currentColor 发生改变时（比如点预设或图片提取），记得同步给局部变量
  useEffect(() => {
    setCustomColor(currentColor);
    setPickerColor(currentColor);
  }, [currentColor]);

  // 3. 调色盘正在拖拽时的轻量回调：只更新状态，不惊动老大哥组件
  const handlePickerChange = (color: string) => {
    setPickerColor(color);
    setCustomColor(color); // 顺便让输入框跟着实时变字
  };

  // 4. 重点：当用户手指松开、结束拖拽时（或者干脆直接关掉弹窗时），再真正去改变全局主题
  const handlePickerClose = () => {
    setAnchorEl(null);
    if (isValidHex(pickerColor)) {
      onColorChange(pickerColor);
      toast.success("主题色已更新");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          p: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                toast.success(
                  e.target.checked ? "已切换到深色模式" : "已切换到浅色模式",
                );
              }}
              color="primary"
            />
          }
          label={isDarkMode ? "深色模式" : "浅色模式"}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          预设主题色
        </Typography>
        <Grid container spacing={2}>
          {presetColors.map((preset) => (
            <Grid size={{ xs: 6 }} key={preset.color}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  onClick={() => handleColorSelect(preset.color)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border: currentColor === preset.color ? 2 : 0,
                    borderColor: "primary.main",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
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

      {/* 🚀 自定义颜色（已全面美化和修复对齐） */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          自定义颜色
        </Typography>

        <TextField
          fullWidth
          label="颜色代码"
          value={customColor}
          onChange={handleCustomColorChange}
          placeholder="#6750A4"
          helperText="输入6位HEX颜色代码"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    onClick={(e) => {
                      setPickerColor(
                        isValidHex(customColor) ? customColor : "#6750A4",
                      );
                      setAnchorEl(e.currentTarget);
                    }}
                    sx={{
                      width: 26, // 📌 恢复饱满的大尺寸，保证极佳的视觉聚焦与点击体验
                      height: 26,
                      borderRadius: "50%",
                      cursor: "pointer",

                      // 📌 核心质感提升：去掉显眼的死黑边，换成干净的白边 + 现代多层环境微阴影
                      border: "2px solid #fff",
                      boxShadow: `
                        0 2px 6px rgba(0,0,0,0.12),
                        0 0 0 1px rgba(0,0,0,0.04),
                        inset 0 1px 2px rgba(0,0,0,0.06)
                      `,

                      backgroundColor: isValidHex(customColor)
                        ? customColor
                        : "#6750A4",
                      transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)", // 📌 换用小弹性的贝塞尔曲线，动效更灵动
                      "&:hover": {
                        transform: "scale(1.08)",
                        boxShadow: `
                          0 4px 12px rgba(0,0,0,0.16),
                          0 0 0 1px rgba(0,0,0,0.04)
                        `,
                      },
                      "&:active": {
                        transform: "scale(0.95)", // 点击时轻微下陷反馈
                      },
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePickerClose} // 📌 弹窗关闭时统一提交最终的色彩变动
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                p: 1.2,
                mt: 1,
                borderRadius: 1.5, // 📌 降低外层圆角（1.25rem ~ 10px），去幼稚化
                boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
                backgroundColor: "background.paper",
                "& .react-colorful": {
                  width: "200px",
                  height: "150px",
                  borderRadius: "4px", // 📌 拾色器整体圆角收敛
                },
                "& .react-colorful__saturation": {
                  borderRadius: "4px 4px 0 0", // 📌 顶部色彩画布边缘微调
                },
                "& .react-colorful__hue": {
                  height: "10px",
                  borderRadius: "2px", // 📌 下方彩虹条由浑圆改成利落的条状
                  marginTop: "10px",
                },
                "& .react-colorful__pointer": {
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%", // 游标保留正圆，但缩小尺寸，增强精致度
                  border: "2px solid #fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                },
              },
            },
          }}
        >
          <HexColorPicker color={pickerColor} onChange={handlePickerChange} />
        </Popover>
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
          style={{ display: "none" }}
          id="image-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            fullWidth
            startIcon={
              isExtracting ? <Refresh className="animate-spin" /> : <Upload />
            }
            disabled={isExtracting}
          >
            {isExtracting ? "提取中..." : "上传图片"}
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

      <Box
        sx={{ mt: 3, p: 2, backgroundColor: "action.hover", borderRadius: 2 }}
      >
        <Typography variant="caption" color="text.secondary">
          💡 提示：Material Design 3
          会根据您选择的主题色自动生成完整的配色方案，包括容器色、表面色等。
        </Typography>
      </Box>
    </Drawer>
  );
}
