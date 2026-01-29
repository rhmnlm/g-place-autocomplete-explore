import { Box, Container } from '@mui/material';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  mapSection: ReactNode;
  sidebarSection: ReactNode;
}

export const MainLayout = ({ mapSection, sidebarSection }: MainLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
            gap: 3,
            height: { xs: 'auto', md: 'calc(100vh - 48px)' },
            minHeight: { xs: 600, md: 500 },
          }}
        >
          {/* Map Section */}
          <Box
            sx={{
              height: { xs: 400, md: '100%' },
              minHeight: 400,
            }}
          >
            {mapSection}
          </Box>

          {/* Sidebar Section */}
          <Box
            sx={{
              height: { xs: 400, md: '100%' },
              minHeight: 300,
            }}
          >
            {sidebarSection}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainLayout;
