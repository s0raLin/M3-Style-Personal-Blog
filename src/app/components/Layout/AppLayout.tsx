import { useState } from "react";
import {
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
  alpha,
  ButtonBase,
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
import Logo from "@/assets/mitsuki.png";
import MiniPlayer from "./MiniPlayer";

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
                borderRadius: "16px",
                mx: 0.5,
                my: 0.25,
                transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
                "&.Mui-selected": {
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
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
                  transition: "color 0.25s ease",
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
          APP BAR — Floating island pill(s)
          ════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "fixed",
          top: 12,
          left: 0,
          right: 0,
          zIndex: 1100,
          display: "flex",
          justifyContent: isMobile ? "space-between" : "center",
          px: 2,
          pointerEvents: "none",
        }}
      >
        {/* ── Mobile: Left island (nav) ── */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.6,
              borderRadius: "22px",
              backgroundColor: isDarkMode
                ? "rgba(22, 22, 28, 0.75)"
                : "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(24px) saturate(1.8)",
              WebkitBackdropFilter: "blur(24px) saturate(1.8)",
              border: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(103,80,164,0.1)",
              boxShadow: isDarkMode
                ? "0 4px 24px rgba(0,0,0,0.3)"
                : "0 4px 24px rgba(0,0,0,0.06)",
              pointerEvents: "auto",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              size="small"
              sx={{ borderRadius: "14px" }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="button"
              sx={{
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.03em",
                color: "text.primary",
                pr: 0.5,
              }}
            >
              {menuItems.find((m) => m.id === currentPage)?.label || "首页"}
            </Typography>
          </Box>
        )}

        {/* ── Mobile: Right island (theme controls) ── */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.3,
              px: 1.5,
              py: 0.6,
              borderRadius: "22px",
              backgroundColor: isDarkMode
                ? "rgba(22, 22, 28, 0.75)"
                : "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(24px) saturate(1.8)",
              WebkitBackdropFilter: "blur(24px) saturate(1.8)",
              border: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(103,80,164,0.1)",
              boxShadow: isDarkMode
                ? "0 4px 24px rgba(0,0,0,0.3)"
                : "0 4px 24px rgba(0,0,0,0.06)",
              pointerEvents: "auto",
            }}
          >
            <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={onThemeToggle}
                size="small"
                sx={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {isDarkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </IconButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={onOpenThemeSettings}
                size="small"
                sx={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Palette fontSize="small" />
              </IconButton>
            </motion.div>
          </Box>
        )}

        {/* ── Desktop: Single centered island ── */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 2,
              py: 0.6,
              borderRadius: "22px",
              backgroundColor: isDarkMode
                ? "rgba(22, 22, 28, 0.75)"
                : "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(24px) saturate(1.8)",
              WebkitBackdropFilter: "blur(24px) saturate(1.8)",
              border: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(103,80,164,0.1)",
              boxShadow: isDarkMode
                ? "0 4px 24px rgba(0,0,0,0.3)"
                : "0 4px 24px rgba(0,0,0,0.06)",
              pointerEvents: "auto",
            }}
          >
            {/* Logo */}
            <ButtonBase
              disableRipple
              onClick={() => handleNavigate("home")}
              sx={{ borderRadius: "14px", px: 0.7, py: 0.3 }}
            >
              <Box
                component="img"
                src={Logo}
                alt="SYORI"
                sx={{ height: 48 }}
              />
            </ButtonBase>

            {/* Desktop Nav */}
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    color="inherit"
                    onClick={() => handleNavigate(item.id)}
                    sx={{
                      borderRadius: "14px",
                      px: 1.6,
                      py: 0.7,
                      mx: 0.1,
                      backgroundColor: isActive
                        ? alpha(theme.palette.primary.main, 0.15)
                        : "transparent",
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      transition:
                        "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          isActive ? 0.22 : 0.1,
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
                        fontSize: "0.78rem",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </IconButton>
                </motion.div>
              );
            })}

            {/* Theme Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
              <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={onThemeToggle}
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  {isDarkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </IconButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={onOpenThemeSettings}
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Palette fontSize="small" />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        )}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: isDarkMode
              ? "rgba(20, 20, 26, 0.98)"
              : "rgba(255, 255, 255, 0.98)",
            backdropFilter: { xs: "none", md: "blur(24px) saturate(1.6)" },
            WebkitBackdropFilter: { xs: "none", md: "blur(24px) saturate(1.6)" },
            borderRight: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(103,80,164,0.08)",
            borderRadius: "0 24px 24px 0",
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
          pt: currentPage === "home" ? 0 : "72px",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ flex: 1 }}>{children}</Box>

        {/* ════════════════════════════════════════════
            BOTTOM PLAYER BAR (non-home, sticky)
            ════════════════════════════════════════════ */}
        {currentPage !== "home" && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              zIndex: 10,
              px: { xs: 0.5, sm: 1 },
              pb: { xs: 0.5, sm: 1 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.8, sm: 1.5 },
                  px: { xs: 1, sm: 1.5 },
                  py: { xs: 1, sm: 1.2 },
                  borderRadius: "20px",
                  maxWidth: 520,
                  width: "100%",
                  backgroundColor: isDarkMode
                    ? "rgba(22, 22, 28, 0.82)"
                    : "rgba(255, 255, 255, 0.72)",
                  backdropFilter: "blur(24px) saturate(2)",
                  WebkitBackdropFilter: "blur(24px) saturate(2)",
                  border: "1px solid",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(103,80,164,0.1)",
                  boxShadow: isDarkMode
                    ? "0 -4px 24px rgba(0,0,0,0.35)"
                    : "0 -4px 24px rgba(0,0,0,0.06)",
                }}
              >
                <MiniPlayer />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
