import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { ImageOutlined } from '@mui/icons-material';
import { motion } from 'motion/react';

interface ImagePlaceholderProps {
  src?: string;
  alt: string;
  height?: number | string;
  category?: string;
}

export default function ImagePlaceholder({
  src,
  alt,
  height = 200,
  category = '技术',
}: ImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // M3 风格的渐变背景色
  const gradients = {
    设计: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    前端开发: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    性能优化: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    技术: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    生活: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    默认: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  };

  const gradient = gradients[category as keyof typeof gradients] || gradients.默认;

  if (imageError || !src) {
    return (
      <Box
        sx={{
          height,
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <ImageOutlined
            sx={{
              fontSize: 64,
              color: 'rgba(255, 255, 255, 0.9)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
        </motion.div>

        {/* M3 风格的装饰性背景 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
          }}
        />

        {/* M3 风格的波浪装饰 */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '40%',
            background: 'rgba(255, 255, 255, 0.15)',
          }}
        />

        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height, overflow: 'hidden' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ImageOutlined
              sx={{
                fontSize: 48,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            />
          </motion.div>
        </Box>
      )}

      <motion.img
        src={src}
        alt={alt}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'relative',
          zIndex: 2,
        }}
      />
    </Box>
  );
}
