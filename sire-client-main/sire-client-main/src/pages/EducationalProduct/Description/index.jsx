import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Description = ({ product }) => {
    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Descrição/Conceituação
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: 'whitesmoke',
                        margin: '0 .5rem .5rem .5rem',
                        borderRadius: '0.3rem',
                    }}>
                    { product.description }
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    Exemplos de Aplicação
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: 'whitesmoke',
                        margin: '0 .5rem .5rem .5rem',
                        borderRadius: '0.3rem',
                    }}>
                    { product.example }
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    Dados estatísticos do Uso e Eficácia do Produto Educacional
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: 'whitesmoke',
                        margin: '0 .5rem .5rem .5rem',
                        borderRadius: '0.3rem',
                    }}>
                        <ul style={{ padding: '0 1rem' }}>
                            {product.staticData.map((data) => (
                                <li key={data}>{data}</li>
                            ))}
                        </ul>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    id="panel4-header"
                    // sx={{ fontSize: '1.1rem' }}
                >
                    Descrição de Artigo Científico Relacionado ao Uso do Produto Educacional
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: 'whitesmoke',
                        margin: '0 .5rem .5rem .5rem',
                        borderRadius: '0.3rem',
                    }}>
                    { product.article }
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default Description;
