import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Grid, Tabs, Tab, Typography, IconButton, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Diretório onde os sprites estão localizados em public
export const ASSETS_DIR = "/SpritesAvatar";

// Definição das camadas e sua ordem de empilhamento (z-index)
export const LAYERS = {
    BODY: { id: 'body', label: 'Corpo', zIndex: 0 },
    BOTTOM: { id: 'bottom', label: 'Inferior', zIndex: 1 },
    TOP: { id: 'top', label: 'Superior', zIndex: 2 },
    HAT: { id: 'hat', label: 'Chapéu', zIndex: 3 },
};

// Banco de assets simulado no frontend (para adicionar uma roupa, siga o padrão de nomeação de arquivos)
export const ASSET_DATABASE = {
    [LAYERS.BODY.id]: [
        { id: 'base_01', name: 'Base 1', filename: 'base_01.png', color: 'skin' },
        { id: 'base_02', name: 'Base 2', filename: 'base_02.png', color: 'skin' },
    ],
    [LAYERS.TOP.id]: [
        { id: 'none', name: 'Sem roupa', filename: null },
        { id: 'shirt_pink', name: 'Camiseta Rosa', filename: 'shirt_pink.png', color: '#ff4ae7ff' },
        { id: 'shirt_blue', name: 'Camisa Azul', filename: 'shirt_blue.png', color: '#4169E1' },
    ],
    [LAYERS.BOTTOM.id]: [
        { id: 'none', name: 'Sem roupa', filename: null },
        { id: 'pants_green', name: 'Calça Verde', filename: 'pants_green.png', color: '#5ec541ff' },
        { id: 'pants_brown', name: 'Calça Marrom', filename: 'pants_brown.png', color: '#5e410fff' },
    ],
    [LAYERS.HAT.id]: [
        { id: 'none', name: 'Nenhum', filename: null },
        { id: 'hat_red', name: 'Touca Vermelho', filename: 'hat_red.png', color: '#cb2f2fff' },
        { id: 'hat_yellow', name: 'Chapéu amarelo', filename: 'hat_yellow.png', color: '#ffda36ff' },

    ]
};

const DEFAULT_CONFIG = {
    body: 'base_01',
    top: 'none',
    bottom: 'none',
    hat: 'none'
};

const loadAvatarConfig = () => {
    const saved = localStorage.getItem('sire_avatar_config');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            
            const validatedConfig = { ...DEFAULT_CONFIG };
            
            Object.keys(parsed).forEach(layerId => {
                const itemId = parsed[layerId];
                const itemExists = ASSET_DATABASE[layerId]?.some(item => item.id === itemId);
                if (itemExists) {
                    validatedConfig[layerId] = itemId;
                }
            });
            return validatedConfig;
        } catch (e) {
            console.error("Error loading avatar config:", e);
        }
    }
    return DEFAULT_CONFIG;
};

const AvatarCustomizer = ({ open, onClose }) => {
    const [avatarConfig, setAvatarConfig] = useState(loadAvatarConfig);
    const [currentTab, setCurrentTab] = useState(LAYERS.TOP.id);

    
    useEffect(() => {
        if (open) {
            const config = loadAvatarConfig();
            setAvatarConfig(config);
        }
    }, [open]);

    // Gerenciamento do estado do avatar em localStorage
    const handleSave = () => {
        localStorage.setItem('sire_avatar_config', JSON.stringify(avatarConfig));
        window.dispatchEvent(new Event('avatar_updated'));
        console.log("Avatar configuration saved:", avatarConfig);
        onClose();
    };

    const handleItemSelect = (layerId, itemId) => {
        setAvatarConfig(prev => ({ ...prev, [layerId]: itemId }));
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    // Memorização da renderização das camadas para performance
    const renderedLayers = useMemo(() => {
        return Object.values(LAYERS)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(layer => {
                const itemId = avatarConfig[layer.id];
                const item = ASSET_DATABASE[layer.id]?.find(i => i.id === itemId);
                
                if (!item || !item.filename) return null;

                return (
                    <img
                        key={layer.id}
                        src={`${ASSETS_DIR}/${item.filename}`}
                        alt={`${layer.label} - ${item.name}`}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            imageRendering: 'pixelated',
                            zIndex: layer.zIndex,
                            objectFit: 'contain'
                        }}
                    />
                );
            });
    }, [avatarConfig]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Personalizar Avatar
                </Typography>
                <IconButton aria-label="close" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0 }}>
                <Grid container sx={{ height: '500px' }}>
                    {/* Área de Preview */}
                    <Grid item xs={12} md={5} sx={{ 
                        bgcolor: '#f0f4f8', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        borderRight: { md: '1px solid #e0e0e0' }, position: 'relative'
                    }}>
                        <Box sx={{ width: '300px', height: '400px', position: 'relative' }}>
                            {renderedLayers}
                        </Box>
                    </Grid>

                    {/* Área de Controles */}
                    <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                                {Object.values(LAYERS).map(layer => (
                                    <Tab key={layer.id} label={layer.label} value={layer.id} />
                                ))}
                            </Tabs>
                        </Box>
                        
                        <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                            <Grid container spacing={2}>
                                {ASSET_DATABASE[currentTab]?.map((item) => (
                                    <Grid item xs={4} sm={3} key={item.id}>
                                        <Paper
                                            elevation={avatarConfig[currentTab] === item.id ? 4 : 1}
                                            onClick={() => handleItemSelect(currentTab, item.id)}
                                            sx={{
                                                p: 1, textAlign: 'center', cursor: 'pointer', height: '100%',
                                                border: avatarConfig[currentTab] === item.id ? '2px solid #40A3A6' : '2px solid transparent',
                                                bgcolor: avatarConfig[currentTab] === item.id ? '#e0f2f1' : 'background.paper',
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                                            }}
                                        >
                                            <Box sx={{ width: 30, height: 30, mb: 1, mx: 'auto', borderRadius: '50%', bgcolor: item.color || '#ccc' }} />
                                            <Typography variant="caption" sx={{ lineHeight: 1.2 }}>{item.name}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#40A3A6', '&:hover': { bgcolor: '#2E7D80' } }}>
                    Salvar e Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AvatarCustomizer;
