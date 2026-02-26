import React, { useEffect, useState } from "react";
import "./styles.css";
import useFetch from "../../hooks/useFetch";
import useForm from "../../hooks/useForm";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add'; 
import Skeleton from '@mui/material/Skeleton';
import MessageHandler from "../../components/MessageHandler";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import SuggestionDialog from '../Professor/SuggestionDialog'; 

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

const RevisorDashboard = () => {
    const { fetchPendingProducts, fetchEducationalTypes } = useFetch();
    const { reviewProduct } = useForm();
    
    const [pendingProducts, setPendingProducts] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [processing, setProcessing] = useState(false); 
    const [snackState, setSnackState] = useState({ open: false, message: '', type: 'success' });
    
    const [openSuggestionModal, setOpenSuggestionModal] = useState(false);

    // Edit Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Form State
    const [editForm, setEditForm] = useState({
        name: '',
        link: '',
        description: '',
        type_id: '',
        styles: [],
        intelligences: [],
        restrict_to_class: true,
        rejection_reason: ''
    });
    
    const [isRejecting, setIsRejecting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const controller = new AbortController();
        try {
            const [productsData, typesData] = await Promise.all([
                fetchPendingProducts(controller),
                fetchEducationalTypes(controller)
            ]);
            setPendingProducts(productsData);
            setTypes(typesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditForm({
            name: product.name,
            link: product.link,
            description: product.info,
            type_id: product.type,
            styles: product.styles_list || [],
            intelligences: product.intelligences_list || [],
            restrict_to_class: !!product.suggested_for_class, // True if suggested for a class
            rejection_reason: ''
        });
        setIsRejecting(false);
        setOpenDialog(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (e) => {
        setEditForm(prev => ({ ...prev, restrict_to_class: e.target.value === 'true' }));
    };

    const submitReview = async (action) => {
        // Step 1: Handle UI state transition for Rejection
        if (action === 'REJECT' && !isRejecting) {
            setIsRejecting(true); // Show reason field
            return;
        }

        setProcessing(true); // Inicia indicador de carregamento

        try {
            // Step 2: Prepare Payload
            const payload = { 
                ...editForm, 
                action: action // Add action explicitly
            };
            
            // Clean up rejection reason if approving
            if (action === 'APPROVE') {
                delete payload.rejection_reason;
            } else {
                payload.reason = editForm.rejection_reason; 
            }

            // Step 3: Call API via Hook
            const result = await reviewProduct(selectedProduct.id, payload);

            // Step 4: Handle Response
            if (result.success) {
                setSnackState({ 
                    open: true, 
                    message: action === 'APPROVE' ? 'Produto aprovado com sucesso!' : 'Produto rejeitado.', 
                    type: 'success' 
                });
                setOpenDialog(false); // Close dialog
                loadData(); // Refresh list
            } else {
                setSnackState({ 
                    open: true, 
                    message: result.message || 'Erro ao processar revisão.', 
                    type: 'error' 
                });
            }
        } catch (error) {
            console.error("Erro no envio:", error);
            setSnackState({ open: true, message: 'Erro inesperado.', type: 'error' });
        } finally {
            setProcessing(false); // Finaliza indicador de carregamento
        }
    };

    return (
        <div className="revisor-dashboard">
            <PageTitleUpdater title={"Painel do Revisor"} />
            <div className="revisor-container">
                <div className="revisor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <p className="primary-heading">
                            <RateReviewIcon sx={{ fontSize: 35, verticalAlign: 'middle', marginRight: 1 }} />
                            Painel de Revisão
                        </p>
                        <p className="secondary-text">Analise as sugestões de produtos educacionais ou cadastre novos diretamente.</p>
                    </div>
                    <Button 
                        variant="contained" 
                        className="bg-primary-color"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenSuggestionModal(true)}
                        sx={{ height: 'fit-content' }}
                    >
                        Criar Novo Produto
                    </Button>
                </div>

                {loading ? (
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                ) : (
                    <TableContainer component={Paper} className="revisor-table">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell>Produto Sugerido</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Sugerido por</TableCell>
                                    <TableCell>Contexto (Turma)</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Nenhuma sugestão pendente no momento.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                                {product.name}
                                            </TableCell>
                                            <TableCell>{product.type_name}</TableCell>
                                            <TableCell>{product.suggested_by_name || 'Desconhecido'}</TableCell>
                                            <TableCell>
                                                {product.suggested_for_class_name ? (
                                                    <span className="badge-class">{product.suggested_for_class_name}</span>
                                                ) : (
                                                    <span className="badge-global">Global</span>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEditClick(product)}
                                                >
                                                    Revisar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
            
            {/* --- Review Dialog --- */}
            {selectedProduct && (
                <Dialog open={openDialog} onClose={() => !processing && setOpenDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Revisar Sugestão</DialogTitle>
                    <DialogContent dividers>
                        {isRejecting ? (
                             <TextField
                                autoFocus
                                margin="dense"
                                name="rejection_reason"
                                label="Motivo da Rejeição *"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={editForm.rejection_reason}
                                onChange={handleFormChange}
                                error={!editForm.rejection_reason}
                                helperText="Obrigatório para rejeitar"
                                disabled={processing}
                            />
                        ) : (
                            <div className="review-form-grid">
                                <TextField
                                    margin="dense"
                                    name="name"
                                    label="Nome"
                                    fullWidth
                                    variant="outlined"
                                    value={editForm.name}
                                    onChange={handleFormChange}
                                    disabled={processing}
                                />
                                <TextField
                                    margin="dense"
                                    name="link"
                                    label="Link"
                                    fullWidth
                                    variant="outlined"
                                    value={editForm.link}
                                    onChange={handleFormChange}
                                    disabled={processing}
                                />
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        name="type_id"
                                        value={editForm.type_id}
                                        label="Tipo"
                                        onChange={handleFormChange}
                                        disabled={processing}
                                    >
                                        {types.map((t) => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                
                                <FormControl component="fieldset" margin="dense" className="scope-radio-group">
                                    <FormLabel component="legend">Escopo de Visibilidade</FormLabel>
                                    <RadioGroup
                                        name="restrict_to_class"
                                        value={editForm.restrict_to_class.toString()}
                                        onChange={handleRadioChange}
                                    >
                                        <FormControlLabel 
                                            value="true" 
                                            control={<Radio />} 
                                            label={`Restrito à Turma: ${selectedProduct.suggested_for_class_name || "N/A"}`} 
                                            disabled={!selectedProduct.suggested_for_class_name || processing}
                                        />
                                        <FormControlLabel 
                                            value="false" 
                                            control={<Radio />} 
                                            label="Global (Visível para todos)" 
                                            disabled={processing}
                                        />
                                    </RadioGroup>
                                </FormControl>
                                
                                <TextField
                                    margin="dense"
                                    name="description"
                                    label="Descrição"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    variant="outlined"
                                    value={editForm.description}
                                    onChange={handleFormChange}
                                    disabled={processing}
                                />

                                {/* Tags */}
                                <div className="checkbox-group-container">
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Estilos</InputLabel>
                                        <Select
                                            multiple
                                            name="styles"
                                            value={editForm.styles}
                                            onChange={handleFormChange}
                                            renderValue={(selected) => selected.join(', ')}
                                            disabled={processing}
                                        >
                                            {stylesList.map((style) => (
                                                <MenuItem key={style.code} value={style.code}>
                                                    <Checkbox checked={editForm.styles.indexOf(style.code) > -1} />
                                                    <ListItemText primary={style.description} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Inteligências</InputLabel>
                                        <Select
                                            multiple
                                            name="intelligences"
                                            value={editForm.intelligences}
                                            onChange={handleFormChange}
                                            renderValue={(selected) => selected.join(', ')}
                                            disabled={processing}
                                        >
                                            {intelligencesList.map((im) => (
                                                <MenuItem key={im.code} value={im.code}>
                                                    <Checkbox checked={editForm.intelligences.indexOf(im.code) > -1} />
                                                    <ListItemText primary={im.description} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} disabled={processing}>Cancelar</Button>
                        {!isRejecting && (
                             <Button 
                                onClick={() => submitReview('REJECT')} 
                                color="error"
                                disabled={processing}
                            >
                                Rejeitar
                            </Button>
                        )}
                        {isRejecting && (
                             <Button 
                                onClick={() => submitReview('REJECT')} 
                                color="error"
                                variant="contained"
                                disabled={processing}
                            >
                                {processing ? <CircularProgress size={24} color="inherit" /> : "Confirmar Rejeição"}
                            </Button>
                        )}
                        {!isRejecting && (
                            <Button 
                                onClick={() => submitReview('APPROVE')} 
                                color="success" 
                                variant="contained"
                                disabled={processing}
                            >
                                {processing ? <CircularProgress size={24} color="inherit" /> : "Salvar e Aprovar"}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}

            {/* Modal de Criação de Produto para o Revisor */}
            <SuggestionDialog 
                open={openSuggestionModal} 
                onClose={() => setOpenSuggestionModal(false)}
                isRevisor={true} 
            />

            <MessageHandler 
                open={snackState.open} 
                message={snackState.message} 
                type={snackState.type} 
                onClose={() => setSnackState({ ...snackState, open: false })} 
            />
        </div>
    );
}

export default RevisorDashboard;