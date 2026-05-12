import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Article as ArticleIcon,
  Photo as PhotoIcon,
  Person as PersonIcon,
  LightMode,
  DarkMode,
  Palette,
} from '@mui/icons-material';
import { motion } from 'motion/react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onOpenThemeSettings: () => void;
}

const menuItems = [
  { id: 'home', label: '首页', icon: <HomeIcon /> },
  { id: 'blog', label: '博客', icon: <ArticleIcon /> },
  { id: 'gallery', label: '图库', icon: <PhotoIcon /> },
  { id: 'about', label: '关于', icon: <PersonIcon /> },
];

export default function AppLayout({
  children,
  currentPage,
  onNavigate,
  onThemeToggle,
  isDarkMode,
  onOpenThemeSettings,
}: AppLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => handleNavigate(item.id)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentPage === item.id ? 'inherit' : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={motion.div}
              sx={{ flexGrow: 1, fontWeight: 600 }}
              whileHover={{ scale: 1.02 }}
            >
              我的博客
            </Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IconButton
                      color={currentPage === item.id ? 'primary' : 'inherit'}
                      onClick={() => handleNavigate(item.id)}
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        backgroundColor:
                          currentPage === item.id ? theme.palette.primary.main + '20' : 'transparent',
                      }}
                    >
                      {item.icon}
                      <Typography variant="button" sx={{ ml: 1 }}>
                        {item.label}
                      </Typography>
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            )}

            <IconButton onClick={onThemeToggle} color="inherit" sx={{ ml: 1 }}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            <IconButton onClick={onOpenThemeSettings} color="inherit" sx={{ ml: 1 }}>
              <Palette />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ pt: 2 }}>{drawer}</Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
