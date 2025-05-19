import { useState } from 'react';
import { Outlet, useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Avatar, Drawer, Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StudentPanel from '../features/student/StudentPanel';
import AttendanceMarking from '../features/starosta/AttendanceMarking';
import TeacherPanel from '../features/teacher/TeacherPanel';
import DeanPanel from '../features/dean/DeanPanel';

const drawerWidth = 260;

function SideNav({ onNavigate }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#fff', // White background
          color: '#000', // Text color black
          borderRight: '1px solid #757575', // Thin black vertical divider
        },
      }}
    >
      <Toolbar sx={{ minHeight: 72 }} />
      <List sx={{ px: 1 }}>
        <Accordion sx={{ bgcolor: 'transparent', color: '#000', boxShadow: 'none' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#757575' }} />}>
            <ListItemIcon sx={{ color: '#757575' }}><EventAvailableIcon /></ListItemIcon>
            <ListItemText primary="Посещаемость" />
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List disablePadding>
              <ListItemButton sx={{ pl: 6 }} onClick={() => onNavigate('/attendance/student')}>
                <ListItemIcon sx={{ color: '#757575' }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Студент" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 6 }} onClick={() => onNavigate('/attendance/starosta')}>
                <ListItemIcon sx={{ color: '#757575' }}><GroupIcon /></ListItemIcon>
                <ListItemText primary="Староста" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 6 }} onClick={() => onNavigate('/attendance/teacher')}>
                <ListItemIcon sx={{ color: '#757575' }}><SchoolIcon /></ListItemIcon>
                <ListItemText primary="Преподаватель" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 6 }} onClick={() => onNavigate('/attendance/dean')}>
                <ListItemIcon sx={{ color: '#757575' }}><AdminPanelSettingsIcon /></ListItemIcon>
                <ListItemText primary="Декан" />
              </ListItemButton>
            </List>
          </AccordionDetails>
        </Accordion>
      </List>
    </Drawer>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
      <SideNav onNavigate={navigate} />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${drawerWidth}px`,
          height: '65px',
          bgcolor: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          borderRight: '1px solid #757575',
          borderBottom: '1px solid #757575',
          boxSizing: 'border-box',
          p: 0,
          m: 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#000',
            fontWeight: 650,
            letterSpacing: 1,
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            width: '100%',
            lineHeight: '67px',
            p: 0,
            m: 0,
          }}
        >
          UniVibe
        </Typography>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fff', p: 0, minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: '#fff',
            color: '#757575',
            borderBottom: '1px solid #757575',
            boxShadow: 'none',
            fontFamily: 'Inter, sans-serif',
            width: '100vw',
            left: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{
              minHeight: 72,
              px: 4,
              display: 'flex',
              justifyContent: 'flex-end',
              ml: `${drawerWidth}px`,
              width: `calc(100vw - ${drawerWidth}px)`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ color: '#757575' }}>
                <NotificationsIcon />
              </IconButton>
              <Avatar src="/avatars/user.png" sx={{ bgcolor: '#757575', width: 40, height: 40 }} />
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4, pt: 7 }}>
          <Routes>
            <Route path="/attendance/student" element={<StudentPanel />} />
            <Route path="/attendance/starosta" element={<AttendanceMarking />} />
            <Route path="/attendance/teacher" element={<TeacherPanel />} />
            <Route path="/attendance/dean" element={<DeanPanel />} />
            <Route path="*" element={<StudentPanel />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}