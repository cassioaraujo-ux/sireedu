import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import useForm from '../../../hooks/useForm';
import useFetch from '../../../hooks/useFetch';
import MessageHandler from '../../../components/MessageHandler';
import CircularProgress from "@mui/material/CircularProgress";
import './styles.css';

const stylesList = [
    { code: 'ATIVO', description: 'Ativo' },
    { code: 'REFLEXIVO', description: 'Reflexivo' },
    { code: 'TEORICO', description: 'Teórico' },
    { code: 'PRAGMATICO', description: 'Pragmático' },
];

const intelligencesList = [
    { code: 'VERBAL_LINGUISTICA', description: 'Verbal-Linguística' },
    { code: 'LOGICA_MATEMATICA', description: 'Lógico-Matemática' },
    { code: 'VISUAL_ESPACIAL', description: 'Visual-Espacial' },
    { code: 'CINESTESICA_CORPORAL', description: 'Cinestésica-Corporal' },
    { code: 'RITMICA_MUSICAL', description: 'Rítmica-Musical' },
    { code: 'INTERPESSOAL', description: 'Interpessoal' },
    { code: 'INTRAPESSOAL', description: 'Intrapessoal' },
    { code: 'NATURALISTA', description: 'Naturalista' },
];

const SuggestionDialog = ({ open, onClose, classId }) => {
    const { suggestProduct } = useForm();
    const { fetchEducationalTypes } = useFetch();
    
    const [types, setTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        link: '',
        description: '',
        type_id: '',
        styles: [],
        intelligences: [],
        class_id: '' // New Field
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData(prev => ({ ...prev, class_id: classId })); // Set class ID on open
            
            const controller = new AbortController();
            const loadTypes = async () => {
                setLoadingTypes(true);
                try {
                    const data = await fetchEducationalTypes(controller);
                    setTypes(data);
                } catch (error) {
                    console.error("Failed to load types");
                } finally {
                    setLoadingTypes(false);
                }
            };
            loadTypes();
            return () => controller.abort();
        }
    }, [open, classId, fetchEducationalTypes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.link || !formData.type_id) {
            setMessageType('error');
            setMessage('Preencha os campos obrigatórios (Nome, Link, Tipo).');
            setOpenSnack(true);
            return;
        }

        setLoading(true);
        const result = await suggestProduct(formData);
        
        if (result.success) {
            setMessageType('success');
            setMessage('Sugestão enviada com sucesso! Aguardando aprovação.');
            setOpenSnack(true);
            setTimeout(() => {
                onClose();
                setFormData({
                    name: '',
                    link: '',
                    description: '',
                    type_id: '',
                    styles: [],
                    intelligences: [],
                    class_id: ''
                });
            }, 2000);
        } else {
            setMessageType('error');
            setMessage(result.message || 'Erro ao enviar sugestão.');
            setOpenSnack(true);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Sugerir Novo Produto Educacional</DialogTitle>
            <DialogContent className="suggestion-dialog-content">
                <p className="suggestion-subtitle">
                    Contribua com a plataforma sugerindo novos materiais. 
                    Sua sugestão passará por uma revisão antes de ficar visível.
                </p>

                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Nome do Produto *"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                />
                
                <TextField
                    margin="dense"
                    name="link"
                    label="Link de Acesso *"
                    type="url"
                    fullWidth
                    variant="outlined"
                    value={formData.link}
                    onChange={handleChange}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel>Tipo de Material *</InputLabel>
                    <Select
                        name="type_id"
                        value={formData.type_id}
                        label="Tipo de Material *"
                        onChange={handleChange}
                    >
                        {types.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    margin="dense"
                    name="description"
                    label="Descrição / Informações"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={formData.description}
                    onChange={handleChange}
                />

                <div className="checkbox-group-container">
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Estilos de Aprendizagem Recomendados</InputLabel>
                        <Select
                            multiple
                            name="styles"
                            value={formData.styles}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {stylesList.map((style) => (
                                <MenuItem key={style.code} value={style.code}>
                                    <Checkbox checked={formData.styles.indexOf(style.code) > -1} />
                                    <ListItemText primary={style.description} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Inteligências Múltiplas Recomendadas</InputLabel>
                        <Select
                            multiple
                            name="intelligences"
                            value={formData.intelligences}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {intelligencesList.map((im) => (
                                <MenuItem key={im.code} value={im.code}>
                                    <Checkbox checked={formData.intelligences.indexOf(im.code) > -1} />
                                    <ListItemText primary={im.description} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    className="bg-primary-color"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar Sugestão"}
                </Button>
            </DialogActions>

            <MessageHandler 
                open={openSnack} 
                message={message} 
                type={messageType} 
                onClose={() => setOpenSnack(false)} 
            />
        </Dialog>
    );
};

export default SuggestionDialog;