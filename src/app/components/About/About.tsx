import React, { ReactNode, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Paper,
  Grid,
  Chip,
  Link,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Email,
  LocationOn,
  GitHub,
  Twitter,
  LinkedIn,
  Work,
  Code,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";

import siteData from "../../data/siteData.json";
import { AuthorInfo } from "../../types/blog";

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link?: string;
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
    >
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.1, 1, 0.2, 1] }}
          >
            <Box sx={{ py: { xs: 3, md: 4 } }}>{children}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function About() {
  const [tabValue, setTabValue] = useState<number>(0);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const authorInfo = siteData.authorInfo as AuthorInfo;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // ── MD3E surface tokens ──
  const glassBg = isDarkMode
    ? "rgba(22, 22, 28, 0.55)"
    : "rgba(255, 255, 255, 0.6)";
  const glassBorder = isDarkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(103,80,164,0.06)";
  const glassShadow = isDarkMode
    ? "0 8px 48px rgba(0,0,0,0.35)"
    : `0 8px 48px ${alpha(theme.palette.primary.main, 0.06)}`;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      {/* ═══ MD3E Profile Card — Oversized Glass ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.1, 1, 0.2, 1] }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, md: 5.5 },
            mb: 5,
            textAlign: "center",
            borderRadius: "32px",
            border: "1px solid",
            borderColor: glassBorder,
            backdropFilter: "blur(20px) saturate(1.5)",
            WebkitBackdropFilter: "blur(20px) saturate(1.5)",
            background: glassBg,
            transition: "box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
            "&:hover": {
              boxShadow: glassShadow,
            },
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 18,
              delay: 0.08,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                mb: 3.5,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: -5,
                  borderRadius: "50%",
                  padding: "3px",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMaskComposite: "xor",
                }}
              />
              <Avatar
                src={authorInfo.avatar}
                sx={{
                  width: 128,
                  height: 128,
                  border: "4px solid transparent",
                  transition: "transform 0.5s ease",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              />
            </Box>
          </motion.div>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 0.8,
              letterSpacing: "-0.03em",
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            {authorInfo.name}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            {authorInfo.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 3.5,
              my: 3.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Email fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {authorInfo.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {authorInfo.location}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.9,
              fontSize: "0.95rem",
              letterSpacing: "0.01em",
            }}
          >
            {authorInfo.bio}
          </Typography>

          {/* Social Links — MD3E Icon Pills */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 3.5 }}
          >
            {[
              {
                icon: <GitHub />,
                href: authorInfo.social.github,
              },
              {
                icon: <Twitter />,
                href: authorInfo.social.twitter,
              },
              {
                icon: <LinkedIn />,
                href: authorInfo.social.linkedin,
              },
            ].map((social, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.94 }}
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "16px",
                    color: "text.secondary",
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.03)",
                    border: "1px solid",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: alpha(theme.palette.primary.main, 0.25),
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  {social.icon}
                </Link>
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>

      {/* ═══ MD3E Skills — Expressive Pills ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: [0.1, 1, 0.2, 1] }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4.5 },
            mb: 4,
            borderRadius: "28px",
            border: "1px solid",
            borderColor: glassBorder,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            background: glassBg,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 700, mb: 3, letterSpacing: "-0.02em" }}
          >
            技能专长
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {authorInfo.skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Chip
                  label={skill}
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontSize: "0.88rem",
                    py: 2.6,
                    px: 1.2,
                    borderRadius: "14px",
                    borderWidth: "1.5px",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.14),
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      transform: "translateY(-3px)",
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>

      {/* ═══ MD3E Tabs — Experience / Projects ═══ */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4.5 },
          borderRadius: "28px",
          border: "1px solid",
          borderColor: glassBorder,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: glassBg,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          textColor="primary"
          sx={{
            mb: 1,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "2px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: "14px 14px 0 0",
              minWidth: 140,
              py: 1.5,
              letterSpacing: "0.01em",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
              },
            },
          }}
        >
          <Tab
            icon={<Work fontSize="small" />}
            iconPosition="start"
            label="工作经历"
          />
          <Tab
            icon={<Code fontSize="small" />}
            iconPosition="start"
            label="项目经验"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2.5}>
            {authorInfo.experience.map((exp, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "22px",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.01)",
                    transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.06)}`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2.5,
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                          {exp.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          sx={{ fontWeight: 600, letterSpacing: "0.01em" }}
                        >
                          {exp.company}
                        </Typography>
                      </Box>
                      <Chip
                        label={exp.period}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{
                          borderRadius: "12px",
                          fontWeight: 600,
                          borderWidth: "1.5px",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.8,
                        fontSize: "0.88rem",
                      }}
                    >
                      {exp.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2.5}>
            {authorInfo.projects?.map((project, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: "22px",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.01)",
                    transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 8px 28px ${alpha(theme.palette.primary.main, 0.08)}`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 1.2, letterSpacing: "-0.01em" }}
                    >
                      {project.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2.5,
                        minHeight: "3em",
                        lineHeight: 1.7,
                        fontSize: "0.85rem",
                      }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {project.tech.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          size="small"
                          sx={{
                            fontSize: "0.7rem",
                            borderRadius: "9px",
                            fontWeight: 500,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08,
                            ),
                            color: theme.palette.primary.main,
                            border: "none",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
}
