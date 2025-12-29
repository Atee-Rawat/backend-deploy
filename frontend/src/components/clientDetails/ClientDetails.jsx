// components/clientDetails/ClientDetails.jsx
import React from 'react';
import './ClientDetails.css';
import { Typography, Button } from '@mui/material';

const ClientDetails = ({ client, onClose }) => {
  if (!client) return null;

  const hasGps = client.gpsLocation?.coordinates?.length === 2;

  return (
    <div className="client-details-overlay">
      <div className="client-details-card">
        <Typography variant="h5" gutterBottom>
          {client.name}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Manual Address:</strong> {client.manualAddress || 'N/A'}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Google Address:</strong> {client.address || 'N/A'}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Phone:</strong> {client.phoneNumber || 'N/A'}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>GPS Location:</strong>{' '}
          {hasGps
            ? `${client.gpsLocation.coordinates[1]}, ${client.gpsLocation.coordinates[0]}`
            : 'Not Available'}
        </Typography>

        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ClientDetails;
