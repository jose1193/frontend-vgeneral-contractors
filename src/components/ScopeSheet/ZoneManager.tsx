import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';

interface Zone {
  id: number;
  type: string;
  name: string;
  images: string[];
}

const ZoneManager = () => {
  const zoneTypes = {
    BEDROOM: 'Bedroom',
    BATHROOM: 'Bathroom',
    GARAGE: 'Garage',
    KITCHEN: 'Kitchen',
    LIVING_ROOM: 'Living Room',
    DINING_ROOM: 'Dining Room',
    OFFICE: 'Office',
    LAUNDRY: 'Laundry Room',
    BASEMENT: 'Basement',
    ATTIC: 'Attic',
    OTHER: 'Other'
  };

  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneType, setSelectedZoneType] = useState<string>('');
  const [customZoneName, setCustomZoneName] = useState('');
  const [expandedZones, setExpandedZones] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getNextAvailableNumber = (zoneType: string) => {
    const existingZones = zones.filter(z => z.type === zoneType);
    const usedNumbers = new Set(
      existingZones.map(z => {
        const match = z.name.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      })
    );
    
    let number = 1;
    while (usedNumbers.has(number)) {
      number++;
    }
    return number;
  };

  const addZone = () => {
    if (!selectedZoneType) return;

    const zoneType = selectedZoneType;
    const number = getNextAvailableNumber(zoneType);
    
    const newZone: Zone = {
      id: Date.now(),
      type: zoneType,
      name: zoneType === 'OTHER' 
        ? customZoneName || 'Custom Zone'
        : `${zoneTypes[zoneType]} ${number}`,
      images: []
    };

    setZones([...zones, newZone]);
    setSelectedZoneType('');
    setCustomZoneName('');
    setExpandedZones(prev => ({
      ...prev,
      [newZone.id]: true
    }));
  };

  const handleZoneImage = (zoneId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setZones(zones.map(zone => {
          if (zone.id === zoneId) {
            return {
              ...zone,
              images: [...zone.images, e.target?.result as string]
            };
          }
          return zone;
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeZoneImage = (zoneId: number, imageIndex: number) => {
    setZones(zones.map(zone => {
      if (zone.id === zoneId) {
        const newImages = [...zone.images];
        newImages.splice(imageIndex, 1);
        return {
          ...zone,
          images: newImages
        };
      }
      return zone;
    }));
  };

  const toggleZoneExpansion = (zoneId: number) => {
    setExpandedZones(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
  };

  const removeZone = (zoneId: number) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
  };

  return (
    <Box sx={{ maxWidth: '4xl', mx: 'auto', '& > *': { mb: 3 } }}>
      {/* Zone Selector */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de zona</InputLabel>
              <Select
                value={selectedZoneType}
                onChange={(e) => setSelectedZoneType(e.target.value)}
                label="Tipo de zona"
              >
                {Object.entries(zoneTypes).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedZoneType === 'OTHER' && (
              <TextField
                label="Nombre personalizado"
                value={customZoneName}
                onChange={(e) => setCustomZoneName(e.target.value)}
                sx={{ width: { xs: '100%', md: '200px' } }}
              />
            )}

            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={addZone}
              disabled={!selectedZoneType || (selectedZoneType === 'OTHER' && !customZoneName)}
            >
              Agregar Zona
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Zones List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {zones.map(zone => (
          <Card key={zone.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => toggleZoneExpansion(zone.id)}
                  >
                    {expandedZones[zone.id] ? 
                      <KeyboardArrowUpIcon /> : 
                      <KeyboardArrowDownIcon />
                    }
                  </IconButton>
                  <Typography variant="h6">{zone.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddCircleIcon />}
                    onClick={() => {
                      const number = getNextAvailableNumber(zone.type);
                      const newZone: Zone = {
                        id: Date.now(),
                        type: zone.type,
                        name: `${zoneTypes[zone.type]} ${number}`,
                        images: []
                      };
                      setZones([...zones, newZone]);
                      setExpandedZones(prev => ({
                        ...prev,
                        [newZone.id]: true
                      }));
                    }}
                  >
                    Nueva {zoneTypes[zone.type]}
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => removeZone(zone.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              {expandedZones[zone.id] && (
                <Grid container spacing={2}>
                  {zone.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ position: 'relative', '&:hover .overlay': { opacity: 1 } }}>
                        <img
                          src={image}
                          alt={`${zone.name} ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '128px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <Box
                          className="overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            borderRadius: 1
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => setSelectedImage(image)}
                            sx={{ color: 'white' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => removeZoneImage(zone.id, index)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        height: '128px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      component="label"
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleZoneImage(zone.id, e)}
                      />
                      <Box sx={{ textAlign: 'center' }}>
                        <CameraAltIcon sx={{ fontSize: 32, color: 'grey.500' }} />
                        <Typography variant="caption" sx={{ display: 'block', color: 'grey.500' }}>
                          Agregar foto
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <img
            src={selectedImage || ''}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxHeight: '80vh'
            }}
          />
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ZoneManager;
