import React, { ReactNode, useState } from "react"; // 引入 useState
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
  Divider,
  Tabs, // 引入 Tabs
  Tab, // 引入 Tab
} from "@mui/material";
import {
  Email,
  LocationOn,
  GitHub,
  Twitter,
  LinkedIn,
  Work,
  Code, // 引入新图标
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { authorInfo } from "../../data/blogData";

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

export interface AuthorInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  avatar: string;
  bio: string;
  skills: string[];
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  experience: Experience[];
  projects: Project[]; // 新增项目字段
}

// 定义 TabPanel 的 Props 类型
interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

// 定义 Tab 面板组件

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

  // 处理 Tab 切换的类型
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 个人简介卡片 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{ p: { xs: 3, md: 5 }, mb: 4, textAlign: "center" }}
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
            <Avatar
              src={authorInfo.avatar}
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto 24px",
                border: "4px solid",
                borderColor: "primary.main",
              }}
            />
          </motion.div>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
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

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={authorInfo.social.github}
                target="_blank"
                rel="noopener"
              >
                <GitHub fontSize="large" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={authorInfo.social.twitter}
                target="_blank"
                rel="noopener"
              >
                <Twitter fontSize="large" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={authorInfo.social.linkedin}
                target="_blank"
                rel="noopener"
              >
                <LinkedIn fontSize="large" />
              </Link>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
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
                    padding: "20px 12px",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                    transition: "all 0.3s",
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>

      {/* Tabs 切换区域 */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<Work fontSize="small" />}
              iconPosition="start"
              label="工作经历"
              sx={{ fontWeight: 600 }}
            />
            <Tab
              icon={<Code fontSize="small" />}
              iconPosition="start"
              label="项目经验"
              sx={{ fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {authorInfo.experience.map((exp, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
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
                          sx={{ fontWeight: 500 }}
                        >
                          {exp.company}
                        </Typography>
                      </Box>
                      <Chip
                        label={exp.period}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}
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
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(25, 118, 210, 0.02)",
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
                      sx={{ mb: 2, height: "3em", overflow: "hidden" }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {project.tech.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          size="small"
                          sx={{ fontSize: "0.7rem" }}
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
