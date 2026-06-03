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
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Box sx={{ py: 3 }}>{children}</Box>
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

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            textAlign: "center",
            borderRadius: "32px",
            border: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(103,80,164,0.06)",
            backdropFilter: "blur(16px) saturate(1.6)",
            WebkitBackdropFilter: "blur(16px) saturate(1.6)",
            background: isDarkMode
              ? "rgba(22, 22, 28, 0.6)"
              : "rgba(255, 255, 255, 0.65)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: isDarkMode
                ? "0 8px 40px rgba(0,0,0,0.3)"
                : `0 8px 40px ${alpha(theme.palette.primary.main, 0.06)}`,
            },
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                mb: 3,
              }}
            >
              {/* Avatar ring glow */}
              <Box
                sx={{
                  position: "absolute",
                  inset: -4,
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
                  width: 120,
                  height: 120,
                  border: "4px solid transparent",
                }}
              />
            </Box>
          </motion.div>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {authorInfo.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {authorInfo.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 3,
              my: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Email fontSize="small" color="primary" />
              <Typography variant="body2">{authorInfo.email}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn fontSize="small" color="primary" />
              <Typography variant="body2">{authorInfo.location}</Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            {authorInfo.bio}
          </Typography>

          {/* Social Icons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}
          >
            {[
              {
                icon: <GitHub fontSize="large" />,
                href: authorInfo.social.github,
              },
              {
                icon: <Twitter fontSize="large" />,
                href: authorInfo.social.twitter,
              },
              {
                icon: <LinkedIn fontSize="large" />,
                href: authorInfo.social.linkedin,
              },
            ].map((social, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  sx={{
                    color: "text.secondary",
                    transition: "color 0.2s",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {social.icon}
                </Link>
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0, 0, 1] }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: "24px",
            border: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(103,80,164,0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 700, mb: 3, letterSpacing: "-0.01em" }}
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
                    fontSize: "0.9rem",
                    py: 2.5,
                    px: 1,
                    borderRadius: "12px",
                    borderWidth: "1.5px",
                    fontWeight: 500,
                    transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>

      {/* Tabs: Experience / Projects */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: "24px",
          border: "1px solid",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.06)"
            : "rgba(103,80,164,0.06)",
          backdropFilter: "blur(12px)",
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
              borderRadius: "12px 12px 0 0",
              minWidth: 140,
              py: 1.5,
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
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
                    borderRadius: "20px",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.05)",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.04)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {exp.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          sx={{ fontWeight: 600 }}
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
                          borderRadius: "10px",
                          fontWeight: 600,
                          borderWidth: "1.5px",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.7,
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
          <Grid container spacing={2}>
            {authorInfo.projects?.map((project, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: "20px",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.05)",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.06)}`,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {project.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        minHeight: "3em",
                        lineHeight: 1.6,
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
                            borderRadius: "7px",
                            fontWeight: 500,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.06,
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
