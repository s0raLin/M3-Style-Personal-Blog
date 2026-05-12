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
} from '@mui/material';
import {
  Email,
  LocationOn,
  GitHub,
  Twitter,
  LinkedIn,
  Work,
} from '@mui/icons-material';
import { motion } from 'motion/react';
import { authorInfo } from '../../data/blogData';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Avatar
              src={authorInfo.avatar}
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto 24px',
                border: '4px solid',
                borderColor: 'primary.main',
              }}
            />
          </motion.div>

          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            {authorInfo.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {authorInfo.title}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Email fontSize="small" />
              <Typography variant="body2">{authorInfo.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn fontSize="small" />
              <Typography variant="body2">{authorInfo.location}</Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            {authorInfo.bio}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href={authorInfo.social.github} target="_blank" rel="noopener">
                <GitHub fontSize="large" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href={authorInfo.social.twitter} target="_blank" rel="noopener">
                <Twitter fontSize="large" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href={authorInfo.social.linkedin} target="_blank" rel="noopener">
                <LinkedIn fontSize="large" />
              </Link>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              技能专长
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
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
                      fontSize: '0.9rem',
                      padding: '20px 12px',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                      },
                      transition: 'all 0.3s',
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              工作经历
            </Typography>
            <Grid container spacing={3}>
              {authorInfo.experience.map((exp, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.3s' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'primary.contrastText',
                              p: 1.5,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Work />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {exp.title}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                              {exp.company}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {exp.period}
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                              {exp.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
}
