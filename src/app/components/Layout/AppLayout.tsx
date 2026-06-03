import { useState } from "react";
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
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Article as ArticleIcon,
  Photo as PhotoIcon,
  Person as PersonIcon,
  LightMode,
  DarkMode,
  Palette,
} from "@mui/icons-material";
import { motion } from "motion/react";
import Logo from "@/assets/logo.svg";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onOpenThemeSettings: () => void;
}

const menuItems = [
  { id: "home", label: "首页", icon: <HomeIcon /> },
  { id: "blog", label: "博客", icon: <ArticleIcon /> },
  { id: "gallery", label: "图库", icon: <PhotoIcon /> },
  { id: "about", label: "关于", icon: <PersonIcon /> },
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          p: 2.5,
          textAlign: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          个人博客
        </Typography>
      </Box>
      <List sx={{ px: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => handleNavigate(item.id)}
              sx={{
                borderRadius: "14px",
                mx: 0.5,
                my: 0.25,
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.contrastText,
                  },
                },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color:
                    currentPage === item.id
                      ? "inherit"
                      : theme.palette.text.secondary,
                  transition: "color 0.2s ease",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: currentPage === item.id ? 700 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ════════════════════════════════════════════
          APP BAR — Glassmorphism
          ════════════════════════════════════════════ */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: isDarkMode
            ? "rgba(17, 16, 20, 0.72)"
            : "rgba(255, 255, 255, 0.68)",
          backdropFilter: "blur(20px) saturate(1.8)",
          WebkitBackdropFilter: "blur(20px) saturate(1.8)",
          color: theme.palette.text.primary,
          borderBottom: "1px solid",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.06)"
            : "rgba(103,80,164,0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 } }}>
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

            {/* Logo */}
            <Typography
              variant="h6"
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              onClick={() => handleNavigate("home")}
            >
              <Box
                component="img"
                src={Logo}
                alt="SYORI"
                onClick={() => handleNavigate("home")}
                sx={{
                  height: 40,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              />
            </Typography>

            {/* Desktop Nav */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {menuItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        color="inherit"
                        onClick={() => handleNavigate(item.id)}
                        sx={{
                          borderRadius: "12px",
                          px: 2,
                          py: 1,
                          mx: 0.25,
                          position: "relative",
                          overflow: "hidden",
                          backgroundColor: isActive
                            ? alpha(theme.palette.primary.main, 0.1)
                            : "transparent",
                          color: isActive
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.06,
                            ),
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        {item.icon}
                        <Typography
                          variant="button"
                          sx={{
                            ml: 0.8,
                            fontWeight: isActive ? 700 : 500,
                            fontSize: "0.8rem",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {item.label}
                        </Typography>
                        {/* Active Indicator Dot */}
                        {isActive && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 4,
                              width: 20,
                              height: 3,
                              borderRadius: "2px",
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            }}
                          />
                        )}
                      </IconButton>
                    </motion.div>
                  );
                })}
              </Box>
            )}

            {/* Theme Controls */}
            <Box
              sx={{ display: "flex", alignItems: "center", ml: 1, gap: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={onThemeToggle}
                  color="inherit"
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  {isDarkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={onOpenThemeSettings}
                  color="inherit"
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Palette />
                </IconButton>
              </motion.div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: isDarkMode
              ? "rgba(20, 20, 26, 0.95)"
              : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px) saturate(1.8)",
            WebkitBackdropFilter: "blur(20px) saturate(1.8)",
            borderRight: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(103,80,164,0.08)",
          },
        }}
      >
        <Box sx={{ pt: 2 }}>{drawer}</Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
